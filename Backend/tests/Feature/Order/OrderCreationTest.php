<?php

namespace Tests\Feature\Order;

use App\Models\Listing;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_create_order(): void
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->create(['price' => 100.00, 'stock_quantity' => 10]);

        $response = $this->actingAs($user)
            ->postJson('/api/orders', [
                'listing_id' => $listing->listing_id,
                'quantity' => 2,
                'shipping_address' => 'Test Address',
                'payment_method' => 'Credit Card',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('order.total_price', '200.00');

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'listing_id' => $listing->listing_id,
            'quantity' => 2,
        ]);

        // Check stock reduction
        $this->assertEquals(8, $listing->fresh()->stock_quantity);
    }

    public function test_cannot_order_more_than_stock_available(): void
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->create(['stock_quantity' => 5]);

        $response = $this->actingAs($user)
            ->postJson('/api/orders', [
                'listing_id' => $listing->listing_id,
                'quantity' => 6,
                'shipping_address' => 'Test Address',
                'payment_method' => 'Credit Card',
            ]);

        $response->assertStatus(400)
            ->assertJson(['message' => 'Insufficient stock available']);
    }

    public function test_customer_can_view_own_orders(): void
    {
        $user = User::factory()->create();
        Order::factory()->count(3)->create(['user_id' => $user->id]);
        Order::factory()->count(2)->create(); // Others' orders

        $response = $this->actingAs($user)
            ->getJson('/api/orders');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_order_owner_can_cancel_pending_order(): void
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->create(['stock_quantity' => 10]);
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'listing_id' => $listing->listing_id,
            'quantity' => 2,
            'status' => 'Pending',
        ]);
        
        // Initial stock check
        $listing->decrement('stock_quantity', 2);
        $this->assertEquals(8, $listing->fresh()->stock_quantity);

        $response = $this->actingAs($user)
            ->deleteJson("/api/orders/{$order->order_id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('orders', ['order_id' => $order->order_id]);
        
        // Check stock restoration
        $this->assertEquals(10, $listing->fresh()->stock_quantity);
    }

    public function test_cannot_cancel_shipped_order(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'Shipped',
        ]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/orders/{$order->order_id}");

        $response->assertStatus(400)
            ->assertJson(['message' => 'Cannot cancel order that is no longer pending']);
    }

    public function test_seller_can_update_order_status(): void
    {
        $seller = User::factory()->shopOwner()->create();
        $shop = \App\Models\Shop::factory()->create(['owner_id' => $seller->id]);
        $listing = Listing::factory()->create(['shop_id' => $shop->shop_id]);
        $order = Order::factory()->create([
            'listing_id' => $listing->listing_id,
            'status' => 'Pending',
        ]);

        $response = $this->actingAs($seller)
            ->putJson("/api/orders/{$order->order_id}", [
                'status' => 'Confirmed',
            ]);

        $response->assertStatus(200);
        $this->assertEquals('Confirmed', $order->fresh()->status);
        
        // Check if sales count incremented
        $this->assertEquals($order->quantity, $listing->fresh()->sales_count);
    }
}
