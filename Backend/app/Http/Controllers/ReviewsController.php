<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Review::with(['reviewer']);

        // Filter by seller if provided
        if ($request->has('seller_id')) {
            $query->where('seller_id', $request->seller_id);
        }

        // Filter by listing if provided
        if ($request->has('listing_id')) {
            $query->where('listing_id', $request->listing_id);
        }

        $reviews = $query->paginate(20);

        return response()->json($reviews);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,listing_id',
            'star_rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Check if the user has purchased/bought the item (simplified check)
        $listing = Listing::findOrFail($request->listing_id);

        // For now, we'll just check if the user is authenticated and not the seller
        if ($listing->shop->owner_id === Auth::id()) {
            return response()->json(['message' => 'Cannot review your own listing'], 403);
        }

        $review = Review::create([
            'reviewer_id' => Auth::id(),
            'seller_id' => $listing->shop->owner_id,
            'listing_id' => $request->listing_id,
            'star_rating' => $request->star_rating,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Review created successfully', 'review' => $review], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $review = Review::with(['reviewer'])->findOrFail($id);

        return response()->json($review);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'star_rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'sometimes|string|max:1000',
        ]);

        $review = Review::findOrFail($id);

        // Check if the authenticated user is the reviewer
        if ($review->reviewer_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->update($request->only(['star_rating', 'comment']));

        return response()->json(['message' => 'Review updated successfully', 'review' => $review]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);

        // Check if the authenticated user is the reviewer
        if ($review->reviewer_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
