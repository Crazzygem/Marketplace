<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Order;
use App\Models\Shop;
use App\Models\ShopMember;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShopController extends Controller
{
    // 1. Create a Shop (Application)
    public function store(Request $request)
    {
        $request->validate([
            'shop_name' => 'required|string|unique:shops,shop_name',
            'description' => 'nullable|string',
        ]);

        $shop = Shop::create([
            'owner_id' => Auth::id(), // The logged-in user
            'shop_name' => $request->shop_name,
            'description' => $request->description,
            'status' => 'Active', // Automatically activate for immediate use
        ]);

        // Automatically add the owner as a member with 'owner' role
        ShopMember::create([
            'shop_id' => $shop->shop_id,
            'user_id' => Auth::id(),
            'role' => 'owner',
        ]);

        return response()->json(['message' => 'Shop created successfully.', 'shop' => $shop]);
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
        $itemsListed = Listing::where('shop_id', $shopId)->count();
        $totalSales = Order::whereIn('listing_id', $listingIds)
            ->where('status', 'Delivered')
            ->sum('quantity');
        $totalRevenue = Order::whereIn('listing_id', $listingIds)
            ->where('status', 'Delivered')
            ->sum('total_price');
        $activeOrders = Order::whereIn('listing_id', $listingIds)
            ->whereIn('status', ['Pending', 'Confirmed', 'Shipped'])
            ->count();

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
            'shop_details' => $shop,
            'stats' => [
                'total_views' => $totalViews,
                'items_listed' => $itemsListed,
                'total_sales' => $totalSales,
                'total_revenue' => $totalRevenue,
                'active_orders' => $activeOrders,
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
        ]);
    }
}
