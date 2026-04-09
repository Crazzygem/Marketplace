<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\ShopMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShopMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Get the user's shop (whether they're owner or admin with shop)
        $shop = $user->ownShop;

        if (! $shop) {
            return response()->json(['message' => 'No shop found'], 404);
        }

        // Only return members from this specific shop
        $members = ShopMember::with(['user'])
            ->where('shop_id', $shop->shop_id)
            ->paginate(20);

        return response()->json($members);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = Auth::user();
        $shop = $user->ownShop;

        if (! $shop) {
            return response()->json(['message' => 'You don\'t own a shop'], 403);
        }

        $targetUser = User::where('email', $request->email)->first();

        if ($targetUser->id === $user->id) {
            return response()->json(['message' => 'You cannot add yourself as a staff member'], 400);
        }

        $existingMember = ShopMember::where('shop_id', $shop->shop_id)
            ->where('user_id', $targetUser->id)
            ->first();

        if ($existingMember) {
            return response()->json(['message' => 'User is already a member of this shop'], 400);
        }

        $member = ShopMember::create([
            'shop_id' => $shop->shop_id,
            'user_id' => $targetUser->id,
            'role' => 'staff',
        ]);

        $member->load('user');

        return response()->json(['message' => 'Staff member added successfully', 'member' => $member], 201);
    }

    /**
     * Display specified resource.
     */
    public function show($id)
    {
        $member = ShopMember::with(['user', 'shop'])->findOrFail($id);

        $user = Auth::user();

        // Allow access if user owns the shop or is an admin
        $shop = $user->ownShop;
        if (($shop && $member->shop_id !== $shop->shop_id) && ! $user->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($member);
    }

    /**
     * Update specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'role' => 'sometimes|string|in:seller,staff',
        ]);

        $member = ShopMember::findOrFail($id);
        $user = Auth::user();
        $shop = $user->ownShop;

        // Only allow shop owner to update roles
        if (($shop && $member->shop_id !== $shop->shop_id) && ! $user->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $member->update($request->only(['role']));

        return response()->json(['message' => 'Shop member updated successfully', 'member' => $member]);
    }

    /**
     * Remove specified resource from storage.
     */
    public function destroy($id)
    {
        $member = ShopMember::findOrFail($id);
        $user = Auth::user();
        $shop = $user->ownShop;

        // Only allow shop owner to remove members
        if (($shop && $member->shop_id !== $shop->shop_id) && ! $user->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $member->delete();

        return response()->json(['message' => 'Shop member removed successfully']);
    }
}
