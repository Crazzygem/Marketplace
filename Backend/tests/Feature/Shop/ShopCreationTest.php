<?php

namespace Tests\Feature\Shop;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_shop(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/shops', [
                'shop_name' => 'My Shop',
                'description' => 'Shop Description',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('shop.shop_name', 'My Shop');

        $this->assertDatabaseHas('shops', [
            'shop_name' => 'My Shop',
            'owner_id' => $user->id,
        ]);
        
        // Ensure user is updated as shop owner
        $this->assertTrue($user->fresh()->is_shop_owner);
    }

    public function test_shop_creation_requires_name(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/shops', [
                'description' => 'Missing Name',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('shop_name');
    }

    public function test_user_can_create_multiple_shops(): void
    {
        $user = User::factory()->shopOwner()->create();
        Shop::factory()->create(['owner_id' => $user->id]);

        $response = $this->actingAs($user)
            ->postJson('/api/shops', [
                'shop_name' => 'Second Shop',
                'description' => 'Another description',
            ]);

        // Current API allows multiple shops - this is a potential issue (B5 in TODO)
        $response->assertStatus(201);
    }

    public function test_shop_owner_can_view_shop_stats(): void
    {
        $user = User::factory()->shopOwner()->create();
        $shop = Shop::factory()->create(['owner_id' => $user->id]);

        $response = $this->actingAs($user)
            ->getJson('/api/my-shop/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'shop',
                'stats' => [
                    'total_views',
                    'total_listings',
                    'active_listings',
                    'sold_listings',
                ],
                'charts',
                'top_listings',
            ]);
    }

    public function test_non_shop_owner_cannot_view_shop_stats(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson('/api/my-shop/stats');

        $response->assertStatus(404)
            ->assertJson(['message' => 'No shop found']);
    }
}
