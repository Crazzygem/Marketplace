<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Listing;
use App\Models\Order;
use App\Models\Report;
use App\Models\Review;
use App\Models\SavedItem;
use App\Models\Shop;
use App\Models\ShopMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // 1. GET DASHBOARD STATS (For the "Charts")
    public function dashboardStats()
    {
        // Chart 1: User Growth (Last 7 Users) - Simple line chart data
        $recentUsers = User::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(7)
            ->get();

        // Chart 2: Listings by Category (Pie Chart)
        $categories = DB::table('listings')
            ->join('categories', 'listings.category_id', '=', 'categories.category_id')
            ->select('categories.category_name', DB::raw('count(*) as total'))
            ->groupBy('categories.category_name')
            ->get();

        // Cards: Total numbers
        $stats = [
            'total_users' => User::count(),
            'total_shops' => Shop::count(),
            'pending_shops' => Shop::where('status', 'Pending')->count(),
            'total_revenue' => DB::table('system_revenues')->sum('amount'), // Monetization Metric
        ];

        // Return flat structure for test compatibility
        return response()->json([
            'totalUsers' => $stats['total_users'],
            'totalShops' => $stats['total_shops'],
            'totalRevenue' => $stats['total_revenue'],
            'recentUsers' => $recentUsers,
            'shopsByCategory' => $categories,
            'revenueByMonth' => collect([]), // Placeholder for future revenue by month
        ]);
    }

    // 2. MANAGEMENT CONTROL: Ban a User
    public function banUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->is_banned = true;
        $user->save();

        // Log this action (Audit Trail)
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'BAN_USER',
            'details' => "Banned user ID: $id",
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'User has been banned.']);
    }

    // 3. MANAGEMENT CONTROL: Approve a Shop Application
    public function verifyShop(Request $request, $id)
    {
        $shop = Shop::findOrFail($id);
        $shop->status = 'Active';
        $shop->save();

        // Mark owner as verified
        $owner = User::find($shop->owner_id);
        $owner->is_verified = true;
        $owner->save();

        return response()->json(['message' => 'Shop approved and Owner verified.']);
    }

    // 4. MANAGEMENT CONTROL: View all reports (Moderation Queue)
    public function getReports()
    {
        $reports = Report::with(['listing', 'listing.seller'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $reports]);
    }

    // 5. MANAGEMENT CONTROL: Dismiss/Resolve a report
    public function resolveReport($id)
    {
        $report = Report::findOrFail($id);
        $report->is_resolved = true;
        $report->save();

        return response()->json(['message' => 'Report marked as resolved.']);
    }

    // 6. MANAGEMENT CONTROL: Unban a User
    public function unbanUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->is_banned = false;
        $user->save();

        // Log this action (Audit Trail)
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'UNBAN_USER',
            'details' => "Unbanned user ID: $id",
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'User has been unbanned.']);
    }

    // 7. MANAGEMENT CONTROL: Get all users
    public function getUsers()
    {
        $users = User::select('id', 'name', 'email', 'is_customer', 'is_staff', 'is_shop_owner', 'is_admin', 'is_banned', 'created_at')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => [
                        'customer' => $user->is_customer,
                        'staff' => $user->is_staff,
                        'shop_owner' => $user->is_shop_owner,
                        'admin' => $user->is_admin,
                    ],
                    'is_banned' => $user->is_banned,
                    'status' => $user->is_banned ? 'banned' : 'active',
                    'created_at' => $user->created_at->toISOString(),
                ];
            });

        return response()->json(['data' => $users]);
    }

    // 8. MANAGEMENT CONTROL: Create a new user
    public function createUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:customer,shop_owner,admin',
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_customer' => false,
            'is_shop_owner' => false,
            'is_admin' => false,
        ];

        // Set the appropriate role
        switch ($request->role) {
            case 'admin':
                $userData['is_admin'] = true;
                break;
            case 'shop_owner':
                $userData['is_shop_owner'] = true;
                break;
            case 'customer':
            default:
                $userData['is_customer'] = true;
                break;
        }

        $user = User::create($userData);

        // If shop owner, create a shop for them
        $shop = null;
        if ($request->role === 'shop_owner' && $request->has('shop_name')) {
            $request->validate([
                'shop_name' => 'required|string|unique:shops,shop_name',
            ]);

            $shop = Shop::create([
                'owner_id' => $user->id,
                'shop_name' => $request->shop_name,
                'description' => $request->shop_description ?? null,
                'status' => 'Active',
            ]);

            // Add owner as shop member
            ShopMember::create([
                'shop_id' => $shop->shop_id,
                'user_id' => $user->id,
                'role' => 'owner',
            ]);
        }

        // Log this action
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'CREATE_USER',
            'details' => "Created user ID: $user->id with role: $request->role",
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'User created successfully.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $request->role,
            ],
            'shop' => $shop,
        ], 201);
    }

    // 9. MANAGEMENT CONTROL: Update user role
    public function updateUserRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:customer,shop_owner,admin',
            'delete_shop' => 'sometimes|boolean',
            'shop_name' => 'sometimes|string|max:255',
        ]);

        $user = User::findOrFail($id);
        $currentAdmin = $request->user();
        $wasShopOwner = $user->is_shop_owner;

        // Prevent admin from changing their own role
        if ($user->id === $currentAdmin->id) {
            return response()->json(['message' => 'You cannot change your own role.'], 403);
        }

        // If changing TO shop_owner and user already owns a shop, return error
        if ($request->role === 'shop_owner' && $user->is_shop_owner) {
            $existingShop = Shop::where('owner_id', $user->id)->first();
            if ($existingShop) {
                return response()->json(['message' => 'User already owns a shop: ' . $existingShop->shop_name], 400);
            }
        }

        // If changing FROM shop_owner to customer, check if shop deletion is confirmed
        if ($wasShopOwner && $request->role === 'customer') {
            $shop = Shop::where('owner_id', $user->id)->first();
            if ($shop && !$request->get('delete_shop')) {
                $listingCount = $shop->listings()->count();
                return response()->json([
                    'message' => 'User owns a shop. Confirm deletion to proceed.',
                    'requires_confirmation' => true,
                    'shop' => [
                        'shop_id' => $shop->shop_id,
                        'shop_name' => $shop->shop_name,
                        'listing_count' => $listingCount,
                    ],
                ], 400);
            }
        }

        // Reset all roles
        $user->is_customer = false;
        $user->is_shop_owner = false;
        $user->is_admin = false;

        // Set the new role
        switch ($request->role) {
            case 'admin':
                $user->is_admin = true;
                break;
            case 'shop_owner':
                $user->is_shop_owner = true;
                break;
            case 'customer':
            default:
                $user->is_customer = true;
                break;
        }

        $user->save();

        // If changed TO shop_owner, create a shop
        if ($request->role === 'shop_owner' && !$wasShopOwner) {
            $shopName = $request->get('shop_name', $user->name);

            // Check if shop name already exists, append number if needed
            $counter = 1;
            $finalShopName = $shopName;
            while (Shop::where('shop_name', $finalShopName)->exists()) {
                $finalShopName = $shopName . ' ' . $counter++;
            }

            $shop = Shop::create([
                'owner_id' => $user->id,
                'shop_name' => $finalShopName,
                'description' => null,
                'status' => 'Active',
            ]);

            // Add owner as shop member
            ShopMember::create([
                'shop_id' => $shop->shop_id,
                'user_id' => $user->id,
                'role' => 'owner',
            ]);
        }

        // If changed FROM shop_owner to customer AND delete_shop is true, delete the shop
        if ($wasShopOwner && $request->role === 'customer' && $request->get('delete_shop')) {
            $shop = Shop::where('owner_id', $user->id)->first();
            if ($shop) {
                // Delete all listings first (cascade might not be set up)
                $shop->listings()->delete();
                // Delete shop members
                ShopMember::where('shop_id', $shop->shop_id)->delete();
                // Delete shop
                $shop->delete();
            }
        }

        // Log this action
        AuditLog::create([
            'user_id' => $currentAdmin->id,
            'action' => 'UPDATE_USER_ROLE',
            'details' => "Changed user ID: $user->id role to: $request->role",
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'User role updated successfully.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $request->role,
            ],
        ]);
    }

    // 10. MANAGEMENT CONTROL: Delete a user
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $currentAdmin = $request->user();

        // Prevent admin from deleting themselves
        if ($user->id === $currentAdmin->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        // Log this action before deletion
        AuditLog::create([
            'user_id' => $currentAdmin->id,
            'action' => 'DELETE_USER',
            'details' => "Deleted user ID: $id ({$user->name}, {$user->email})",
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        // Delete related data
        $shop = Shop::where('owner_id', $user->id)->first();
        if ($shop) {
            $listingIds = Listing::where('shop_id', $shop->shop_id)->pluck('listing_id');

            // Delete orders for listings
            Order::whereIn('listing_id', $listingIds)->delete();
            // Delete saved items for listings
            SavedItem::whereIn('listing_id', $listingIds)->delete();
            // Delete reviews for listings
            Review::whereIn('listing_id', $listingIds)->delete();
            // Delete listings
            Listing::where('shop_id', $shop->shop_id)->delete();
            // Delete shop members
            ShopMember::where('shop_id', $shop->shop_id)->delete();
            // Delete shop
            $shop->delete();
        }

        // Clean up remaining user data
        ShopMember::where('user_id', $user->id)->delete();
        SavedItem::where('user_id', $user->id)->delete();
        Review::where('reviewer_id', $user->id)->delete();
        Order::where('user_id', $user->id)->delete();

        // Delete user
        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }
}
