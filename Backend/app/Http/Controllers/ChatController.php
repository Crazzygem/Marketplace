<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\ChatRoom;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get chat rooms for the authenticated user
        $chatRooms = ChatRoom::where(function ($query) {
            $query->where('buyer_id', Auth::id())
                ->orWhere('seller_id', Auth::id());
        })
            ->with(['messages' => function ($query) {
                $query->orderBy('created_at', 'desc')->limit(10);
            }, 'buyer', 'seller'])
            ->paginate(20);

        return response()->json($chatRooms);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,listing_id',
            'message' => 'required|string',
        ]);

        $listing = Listing::findOrFail($request->listing_id);

        // Determine if the authenticated user is buyer or seller
        $isBuyer = Auth::id() !== $listing->shop->owner_id;
        $buyerId = $isBuyer ? Auth::id() : $listing->shop->owner_id;
        $sellerId = $isBuyer ? $listing->shop->owner_id : Auth::id();

        // Check if a chat room already exists for this listing and users
        $chatRoom = ChatRoom::where('listing_id', $request->listing_id)
            ->where(function ($query) use ($buyerId, $sellerId) {
                $query->where([['buyer_id', $buyerId], ['seller_id', $sellerId]])
                    ->orWhere([['buyer_id', $sellerId], ['seller_id', $buyerId]]);
            })
            ->first();

        if (! $chatRoom) {
            $chatRoom = ChatRoom::create([
                'listing_id' => $request->listing_id,
                'buyer_id' => $buyerId,
                'seller_id' => $sellerId,
            ]);
        }

        // Create the message
        $message = ChatMessage::create([
            'room_id' => $chatRoom->room_id,
            'sender_id' => Auth::id(),
            'message_text' => $request->message,
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Message sent successfully',
            'chat_room' => $chatRoom,
            'message_data' => $message,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $chatRoom = ChatRoom::with(['messages.sender', 'buyer', 'seller'])->findOrFail($id);

        // Check if the authenticated user is part of this chat
        if ($chatRoom->buyer_id !== Auth::id() && $chatRoom->seller_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Mark messages as read
        ChatMessage::where('room_id', $id)
            ->where('sender_id', '<>', Auth::id())
            ->update(['is_read' => true]);

        return response()->json($chatRoom);
    }

    /**
     * Send a message to an existing chat room.
     */
    public function sendMessage(Request $request, $roomId)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $chatRoom = ChatRoom::findOrFail($roomId);

        // Check if the authenticated user is part of this chat
        if ($chatRoom->buyer_id !== Auth::id() && $chatRoom->seller_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = ChatMessage::create([
            'room_id' => $roomId,
            'sender_id' => Auth::id(),
            'message_text' => $request->message,
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'Message sent successfully', 'message_data' => $message], 201);
    }
}
