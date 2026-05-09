<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Order;
use App\Models\Shop;
use App\Models\ShopMember;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ShopController extends Controller
{
    // 1. Create a Shop (Application)
    public function store(Request $request)
    {
        $request->validate([
            'shop_name' => 'required|string|unique:shops,shop_name',
            'description' => 'nullable|string',
        ]);

        $user = Auth::user();
        
        $shop = Shop::create([
            'owner_id' => $user->id, // The logged-in user
            'shop_name' => $request->shop_name,
            'description' => $request->description,
            'status' => 'Active', // Automatically activate for immediate use
        ]);

        // Set user as shop owner
        $user->is_shop_owner = true;
        $user->save();

        // Automatically add the owner as a member with 'owner' role
        ShopMember::create([
            'shop_id' => $shop->shop_id,
            'user_id' => $user->id,
            'role' => 'owner',
        ]);

        return response()->json(['message' => 'Shop created successfully.', 'shop' => $shop], 201);
    }

    // 2. Get Shop Analytics (For the Shop Owner's Charts)
    public function stats()
    {
        $user = Auth::user();
        $shop = Shop::where('owner_id', $user->id)->first();

        if (! $shop) {
            return response()->json(['message' => 'No shop found'], 404);
        }

        $shopId = $shop->shop_id;

        // Get all listings for this shop
        $listingIds = Listing::where('shop_id', $shopId)->pluck('listing_id');

        // Stats calculations
        $totalViews = Listing::where('shop_id', $shopId)->sum('view_count');
        $totalListings = Listing::where('shop_id', $shopId)->count();
        $activeListings = Listing::where('shop_id', $shopId)->where('status', 'Active')->count();
        $soldListings = Listing::where('shop_id', $shopId)->where('status', 'Sold')->count();

        // Chart: Views per Listing (Bar Chart)
        $topListingsByViews = Listing::where('shop_id', $shopId)
            ->orderBy('view_count', 'desc')
            ->take(5)
            ->select('title', 'view_count')
            ->get();

        // Chart: Top Selling Items by sales_count
        $topSellingItems = Listing::where('shop_id', $shopId)
            ->orderBy('sales_count', 'desc')
            ->take(5)
            ->select('title', 'sales_count')
            ->get();

        // Sales by date (last 30 days)
        $salesByDate = [];
        $revenueByDate = [];
        $dates = [];

        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $dates[] = Carbon::now()->subDays($i)->format('M d');

            $dailySales = Order::whereIn('listing_id', $listingIds)
                ->where('status', 'Delivered')
                ->whereDate('created_at', $date)
                ->sum('quantity');

            $dailyRevenue = Order::whereIn('listing_id', $listingIds)
                ->where('status', 'Delivered')
                ->whereDate('created_at', $date)
                ->sum('total_price');

            $salesByDate[] = $dailySales;
            $revenueByDate[] = $dailyRevenue;
        }

        return response()->json([
            'shop' => $shop,
            'stats' => [
                'total_views' => $totalViews,
                'total_listings' => $totalListings,
                'active_listings' => $activeListings,
                'sold_listings' => $soldListings,
            ],
            'charts' => [
                'top_items_by_views' => $topListingsByViews,
                'top_selling_items' => $topSellingItems,
                'sales_by_date' => [
                    'labels' => $dates,
                    'data' => $salesByDate,
                ],
                'revenue_by_date' => [
                    'labels' => $dates,
                    'data' => $revenueByDate,
                ],
            ],
            'top_listings' => $topListingsByViews,
        ]);
    }

    // 3. Update Shop Details
    public function update(Request $request)
    {
        $user = Auth::user();
        $shop = Shop::where('owner_id', $user->id)->first();

        if (! $shop) {
            return response()->json(['message' => 'No shop found'], 404);
        }

        $request->validate([
            'shop_name' => 'sometimes|string|max:255|unique:shops,shop_name,' . $shop->shop_id . ',shop_id',
            'description' => 'nullable|string|max:2000',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'logo_url' => 'nullable|string|max:500',
        ]);

        $shop->update($request->only([
            'shop_name',
            'description',
            'contact_email',
            'contact_phone',
            'address',
            'logo_url',
        ]));

        return response()->json([
            'message' => 'Shop updated successfully.',
            'shop' => $shop->fresh(),
        ]);
    }
}
