<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\SavedItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SavedItemController extends Controller
{
    /**
     * Display a listing of the user's saved items.
     */
    public function index()
    {
        $user = Auth::user();

        $savedItems = SavedItem::with(['listing.shop', 'listing.category'])
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($savedItem) {
                return [
                    'id' => $savedItem->id,
                    'listing' => $savedItem->listing,
                    'savedAt' => $savedItem->saved_at,
                ];
            });

        return response()->json($savedItems);
    }

    /**
     * Store a newly created saved item in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,listing_id',
        ]);

        $user = Auth::user();

        // Check if the listing is already saved by this user
        $existingSavedItem = SavedItem::where('user_id', $user->id)
            ->where('listing_id', $request->listing_id)
            ->first();

        if ($existingSavedItem) {
            return response()->json(['message' => 'Listing is already saved'], 400);
        }

        $savedItem = SavedItem::create([
            'user_id' => $user->id,
            'listing_id' => $request->listing_id,
        ]);

        return response()->json([
            'message' => 'Listing saved successfully',
            'saved_item' => $savedItem,
        ], 201);
    }

    /**
     * Remove the specified saved item from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();

        $savedItem = SavedItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $savedItem->delete();

        return response()->json(['message' => 'Listing removed from saved items']);
    }

    /**
     * Check if a listing is saved by the current user.
     */
    public function isSaved($listingId)
    {
        $user = Auth::user();

        $isSaved = SavedItem::where('user_id', $user->id)
            ->where('listing_id', $listingId)
            ->exists();

        return response()->json(['is_saved' => $isSaved]);
    }

    /**
     * Toggle the saved status of a listing.
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,listing_id',
        ]);

        $user = Auth::user();

        $existingSavedItem = SavedItem::where('user_id', $user->id)
            ->where('listing_id', $request->listing_id)
            ->first();

        if ($existingSavedItem) {
            // Remove from saved items
            $existingSavedItem->delete();

            return response()->json(['message' => 'Listing removed from saved items', 'is_saved' => false]);
        } else {
            // Add to saved items
            SavedItem::create([
                'user_id' => $user->id,
                'listing_id' => $request->listing_id,
            ]);

            return response()->json(['message' => 'Listing added to saved items', 'is_saved' => true]);
        }
    }
}
