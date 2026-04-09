<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::with(['listing', 'listing.shop']);

        // Filter by authenticated user if not admin
        if (! Auth::user()->is_admin) {
            $query->where('user_id', Auth::id());
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(20);

        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|exists:listings,listing_id',
            'quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        $listing = Listing::findOrFail($request->listing_id);

        // Check if enough stock is available
        if ($listing->stock_quantity < $request->quantity) {
            return response()->json(['message' => 'Insufficient stock available'], 400);
        }

        // Calculate total price
        $totalPrice = $listing->price * $request->quantity;

        $order = Order::create([
            'user_id' => Auth::id(),
            'listing_id' => $request->listing_id,
            'quantity' => $request->quantity,
            'total_price' => $totalPrice,
            'shipping_address' => $request->shipping_address,
            'payment_method' => $request->payment_method,
        ]);

        // Reduce stock quantity
        $listing->decrement('stock_quantity', $request->quantity);

        return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = Order::with(['listing', 'listing.shop'])->findOrFail($id);

        // Check if the authenticated user owns this order or is an admin
        if ($order->user_id !== Auth::id() && ! Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'sometimes|in:Pending,Confirmed,Shipped,Delivered,Cancelled',
        ]);

        $order = Order::with('listing')->findOrFail($id);

        // Only admin or shop owner can update order status
        if (! Auth::user()->is_admin && $order->listing->shop->owner_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $oldStatus = $order->status;
        $newStatus = $request->input('status');

        $order->update($request->only(['status']));

        // When seller confirms the order, increment sales_count on the listing
        if ($newStatus === 'Confirmed' && $oldStatus !== 'Confirmed') {
            $order->listing->incrementSales($order->quantity);
        }

        return response()->json(['message' => 'Order updated successfully', 'order' => $order]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $order = Order::findOrFail($id);

        // Only the order owner can cancel their order (if still pending)
        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow deletion if order is still pending
        if ($order->status !== 'Pending') {
            return response()->json(['message' => 'Cannot cancel order that is no longer pending'], 400);
        }

        // Restore stock
        $order->listing->increment('stock_quantity', $order->quantity);

        $order->delete();

        return response()->json(['message' => 'Order cancelled successfully']);
    }
}
