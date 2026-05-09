<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Shop;
use App\Models\ShopMember;
use Illuminate\Http\Request;
use Illuminate\Support\Str; // Added for XSS sanitization
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Listing::query();

        // Filter by category if provided
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by shop if provided
        if ($request->has('shop_id')) {
            $query->where('shop_id', $request->shop_id);
        }

        // Search by title if provided
        if ($request->has('search')) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // By default, exclude sold items from public listings
        // Use ?include_sold=true to include sold items (e.g., for admin or shop owner views)
        $includeSold = $request->boolean('include_sold', false);
        if (!$includeSold) {
            $query->where(function ($q) {
                $q->where('is_sold', false)
                  ->orWhereNull('is_sold');
            });
        }

        // By default, exclude inactive items from public listings
        // Use ?include_inactive=true to include inactive items (e.g., for shop owner views)
        $includeInactive = $request->boolean('include_inactive', false);
        if (!$includeInactive) {
            $query->where('status', '!=', 'Inactive');
        }

        $listings = $query->with(['shop', 'category'])->paginate(20);

        return response()->json($listings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'shop_id' => 'nullable|exists:shops,shop_id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:categories,category_id',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:10240', // 10MB max per image
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
            'status' => 'nullable|in:Draft,Active,Sold Out,Inactive',
        ]);

        $userId = Auth::id();

        // Check if the user is trying to create a listing for a shop
        if ($request->has('shop_id') && $request->shop_id !== null) {
            // Verify that the user owns the shop or is a member with permission
            // Eager load members to avoid N+1 query
            $shop = Shop::with('members')->find($request->shop_id);

            if (! $shop) {
                return response()->json(['message' => 'Shop not found'], 404);
            }

            // Check if the user is the owner of the shop
            if ($shop->owner_id != $userId) {
                // Check if the user is a member of the shop with appropriate permissions (no N+1 query)
                $isMember = $shop->members->contains('user_id', $userId);

                if (! $isMember) {
                    return response()->json(['message' => 'You do not have permission to add listings to this shop'], 403);
                }
            }
        }

        // Handle image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('', 'listings'); // Store directly in the 'listings' disk root
                $imagePaths[] = $path;
            }
        }

        // Add existing images if provided (for consistency, though not typically used in store)
        if ($request->has('existing_images')) {
            $imagePaths = array_merge($imagePaths, $request->input('existing_images'));
        }

        // Debug: Log the data being created
        Log::info('Creating listing with data:', [
            'shop_id' => $request->shop_id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'image_urls' => json_encode($imagePaths),
            'status' => $request->status ?? 'Draft',
        ]);

        $listing = Listing::create([
            'shop_id' => $request->shop_id,
            'category_id' => $request->category_id,
            'title' => Str::limit(strip_tags($request->title), 255),
            'description' => strip_tags($request->description),
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'image_urls' => json_encode($imagePaths), // Store as JSON in the database
            'status' => $request->status ?? 'Draft',
        ]);

        // Reload the listing with shop relationship to ensure complete data is returned
        $createdListing = Listing::with(['shop', 'category'])->findOrFail($listing->listing_id);

        return response()->json(['message' => 'Listing created successfully', 'listing' => $createdListing], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $listing = Listing::with(['shop', 'category'])->findOrFail($id);

        // Increment view count
        $listing->increment('view_count');

        return response()->json($listing);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Laravel has issues with PUT requests and multipart/form-data
        // The form data might not be parsed correctly in PUT requests
        // Let's access the input directly from the raw request body

        // Get the raw input data
        $rawInput = file_get_contents('php://input');

        // Create a temporary file to store the raw data and process it
        $tempFile = tempnam(sys_get_temp_dir(), 'upload_');
        file_put_contents($tempFile, $rawInput);

        // Parse the multipart data manually
        $contentType = $request->header('content-type');
        $boundary = '';

        if (preg_match('/boundary=(.*)$/i', $contentType, $matches)) {
            $boundary = trim($matches[1], '"');
        }

        $parsedData = [];
        if (! empty($boundary)) {
            $parts = preg_split('/--'.preg_quote($boundary, '/').'(--)?/', $rawInput);
            foreach ($parts as $part) {
                if (strpos($part, 'Content-Disposition: form-data;') !== false) {
                    // Extract field name and value
                    if (preg_match('/name="([^"]+)"/', $part, $nameMatches) &&
                        preg_match("/\r\n\r\n(.+)\r\n/s", $part, $valueMatches)) {

                        $fieldName = $nameMatches[1];
                        $fieldValue = trim($valueMatches[1]);

                        // Only store non-file fields
                        if (strpos($part, 'filename=') === false) {
                            $parsedData[$fieldName] = $fieldValue;
                        }
                    }
                }
            }
        }

        // Use parsed data or fallback to request input
        // Sanitize input to prevent XSS
        $title = $parsedData['title'] ?? $request->input('title');
        $description = $parsedData['description'] ?? $request->input('description');
        $price = $parsedData['price'] ?? $request->input('price');
        $stock_quantity = $parsedData['stock_quantity'] ?? $request->input('stock_quantity');
        $category_id = $parsedData['category_id'] ?? $request->input('category_id');
        $status = $parsedData['status'] ?? $request->input('status');
        $existing_images = $parsedData['existing_images'] ?? $request->input('existing_images');

        $requestData = [
            'title' => Str::limit(strip_tags($title), 255),
            'description' => strip_tags($description),
            'price' => $price,
            'stock_quantity' => $stock_quantity,
            'category_id' => $category_id,
            'status' => $status,
            'existing_images' => $existing_images,
            'replace_images' => $request->input('replace_images', 'false'),
        ];

        $validator = Validator::make($requestData, [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|nullable|numeric|min:0',
            'category_id' => 'sometimes|nullable|exists:categories,category_id',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
            'replace_images' => 'sometimes|in:true,false',
            'status' => 'sometimes|nullable|in:Draft,Active,Sold Out,Inactive',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());

            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $listing = Listing::with('shop')->findOrFail($id);
        $userId = Auth::id();

        // Check if the user has permission to update this listing
        if ($listing->shop) {
            // If the listing belongs to a shop, check if the user is authorized
            if ($listing->shop->owner_id != $userId) {
                // Check if the user is a member of the shop with appropriate permissions (no N+1 query)
                $isMember = $listing->shop->members->contains('user_id', $userId);

                if (! $isMember) {
                    return response()->json(['message' => 'You do not have permission to update this listing'], 403);
                }
            }
        } else {
            // For independent listings, we'll temporarily allow the current user to update
            // In a production environment, add a user_id field to track ownership
        }

        // Handle image uploads and preserve existing images
        $imagePaths = json_decode($listing->image_urls, true) ?: [];

        // Check if we should replace images or keep existing ones
        $replaceImages = $request->input('replace_images', 'false') === 'true';

        if ($replaceImages) {
            // If replacing images, start with an empty array
            $imagePaths = [];
        } else {
            // If not replacing, preserve existing images if no new ones are provided
            // Or if existing images are provided in the request, use those instead of the current ones
            if ($request->has('existing_images')) {
                $imagePaths = $request->input('existing_images');
            }
        }

        // Process any new images that were uploaded
        $newImages = $request->file('images');
        if ($newImages) {
            // Handle both single file and multiple file cases
            if (is_array($newImages) || $newImages instanceof \Illuminate\Http\UploadedFile) {
                $images = is_array($newImages) ? $newImages : [$newImages];

                foreach ($images as $image) {
                    if ($image instanceof \Illuminate\Http\UploadedFile) {
                        // Store the file using Laravel's storage system
                        $path = $image->store('', 'listings'); // Store directly in the 'listings' disk root
                        $imagePaths[] = $path;
                    }
                }
            }
        }

        // Use the parsed data that we validated earlier instead of $request->only()
        $updateData = [
            'title' => $title,
            'description' => $description,
            'price' => $price,
            'stock_quantity' => $stock_quantity,
            'category_id' => $category_id,
            'status' => $status,
            'image_urls' => json_encode($imagePaths),  // Always update image_urls even if no new images
        ];

        // Remove null values to avoid updating with null (but keep image_urls)
        $filteredUpdateData = [];
        foreach ($updateData as $key => $value) {
            if ($value !== null) {
                $filteredUpdateData[$key] = $value;
            }
        }

        // Always include image_urls in the update
        $filteredUpdateData['image_urls'] = $updateData['image_urls'];

        $listing->update($filteredUpdateData);

        // Reload the listing with shop relationship to ensure complete data is returned
        $updatedListing = Listing::with(['shop', 'category'])->findOrFail($id);

        return response()->json(['message' => 'Listing updated successfully', 'listing' => $updatedListing]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $listing = Listing::with('shop')->findOrFail($id);
        $userId = Auth::id();

        // Check if the user has permission to delete this listing
        if ($listing->shop) {
            // If the listing belongs to a shop, check if the user is authorized
            if ($listing->shop->owner_id != $userId) {
                // Check if the user is a member of the shop with appropriate permissions (no N+1 query)
                $isMember = $listing->shop->members->contains('user_id', $userId);

                if (! $isMember) {
                    return response()->json(['message' => 'You do not have permission to delete this listing'], 403);
                }
            }
        } else {
            // For independent listings, we'll temporarily allow the current user to delete
            // In a production environment, add a user_id field to track ownership
        }

        $listing->delete();

        return response()->json(['message' => 'Listing deleted successfully']);
    }

    /**
     * Mark a listing as sold (manual seller action)
     */
    public function markAsSold($id)
    {
        $listing = Listing::with(['shop', 'shop.members'])->findOrFail($id);
        $userId = Auth::id();

        // Check if the user has permission to update this listing
        if ($listing->shop) {
            if ($listing->shop->owner_id != $userId) {
                // Check if the user is a member of the shop with appropriate permissions (no N+1 query)
                $isMember = $listing->shop->members->contains('user_id', $userId);

                if (! $isMember) {
                    return response()->json(['message' => 'You do not have permission to update this listing'], 403);
                }
            }
        }

        $listing->markAsSold();

        return response()->json([
            'message' => 'Listing marked as sold successfully',
            'listing' => $listing->fresh(),
        ]);
    }

    /**
     * Restock a sold listing (make it available again)
     */
    public function restock($id)
    {
        $listing = Listing::with(['shop', 'shop.members'])->findOrFail($id);
        $userId = Auth::id();

        // Check if the user has permission to update this listing
        if ($listing->shop) {
            if ($listing->shop->owner_id != $userId) {
                // Check if the user is a member of the shop with appropriate permissions (no N+1 query)
                $isMember = $listing->shop->members->contains('user_id', $userId);

                if (! $isMember) {
                    return response()->json(['message' => 'You do not have permission to update this listing'], 403);
                }
            }
        }

        $listing->restock();

        return response()->json([
            'message' => 'Listing restocked successfully',
            'listing' => $listing->fresh(),
        ]);
    }
}
