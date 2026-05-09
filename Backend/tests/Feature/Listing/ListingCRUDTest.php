<?php

namespace Tests\Feature\Listing;

use App\Models\Category;
use App\Models\Listing;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ListingCRUDTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('listings');
    }

    public function test_anyone_can_view_listings(): void
    {
        Listing::factory()->count(3)->create();

        $response = $this->getJson('/api/listings');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_anyone_can_view_single_listing(): void
    {
        $listing = Listing::factory()->create();

        $response = $this->getJson("/api/listings/{$listing->listing_id}");

        $response->assertStatus(200)
            ->assertJsonPath('listing_id', $listing->listing_id)
            ->assertJsonPath('title', $listing->title);
    }

    public function test_listing_view_increments_view_count(): void
    {
        $listing = Listing::factory()->create(['view_count' => 0]);

        $this->getJson("/api/listings/{$listing->listing_id}");

        $this->assertEquals(1, $listing->fresh()->view_count);
    }

    public function test_authenticated_user_can_create_listing_for_own_shop(): void
    {
        $user = User::factory()->create();
        $shop = Shop::factory()->create(['owner_id' => $user->id]);
        $category = Category::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/listings', [
                'shop_id' => $shop->shop_id,
                'category_id' => $category->category_id,
                'title' => 'New Listing',
                'description' => 'Listing Description',
                'price' => 100.50,
                'stock_quantity' => 10,
                'status' => 'Active',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('listing.title', 'New Listing');

        $this->assertDatabaseHas('listings', [
            'title' => 'New Listing',
            'shop_id' => $shop->shop_id,
        ]);
    }

    public function test_listing_creation_with_images(): void
    {
        $user = User::factory()->create();
        $shop = Shop::factory()->create(['owner_id' => $user->id]);

        $response = $this->actingAs($user)
            ->postJson('/api/listings', [
                'shop_id' => $shop->shop_id,
                'title' => 'Listing with Images',
                'description' => 'Description',
                'price' => 50.00,
                'stock_quantity' => 5,
                'images' => [
                    UploadedFile::fake()->image('product1.jpg'),
                    UploadedFile::fake()->image('product2.jpg'),
                ],
            ]);

        $response->assertStatus(201);
        
        $listing = Listing::where('title', 'Listing with Images')->first();
        $imageUrls = json_decode($listing->image_urls, true);
        
        $this->assertCount(2, $imageUrls);
        Storage::disk('listings')->assertExists($imageUrls[0]);
        Storage::disk('listings')->assertExists($imageUrls[1]);
    }

    public function test_user_cannot_create_listing_for_other_shop(): void
    {
        $user = User::factory()->create();
        $otherShop = Shop::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/listings', [
                'shop_id' => $otherShop->shop_id,
                'title' => 'Unauthorized Listing',
                'description' => 'Description',
                'price' => 50.00,
                'stock_quantity' => 5,
            ]);

        $response->assertStatus(403);
    }

    public function test_shop_owner_can_update_own_listing(): void
    {
        $user = User::factory()->create();
        $shop = Shop::factory()->create(['owner_id' => $user->id]);
        $listing = Listing::factory()->create(['shop_id' => $shop->shop_id]);

        // Note: ListingController has issues with PUT and multipart/form-data
        // We'll test with simple JSON update first as the controller seems to have a fallback
        $response = $this->actingAs($user)
            ->putJson("/api/listings/{$listing->listing_id}", [
                'title' => 'Updated Title',
                'price' => 150.00,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('listing.title', 'Updated Title');

        $this->assertEquals(150.00, $listing->fresh()->price);
    }

    public function test_shop_owner_can_delete_own_listing(): void
    {
        $user = User::factory()->create();
        $shop = Shop::factory()->create(['owner_id' => $user->id]);
        $listing = Listing::factory()->create(['shop_id' => $shop->shop_id]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/listings/{$listing->listing_id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('listings', ['listing_id' => $listing->listing_id]);
    }

    public function test_user_cannot_delete_others_listing(): void
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->create(); // Belongs to another user via its shop

        $response = $this->actingAs($user)
            ->deleteJson("/api/listings/{$listing->listing_id}");

        $response->assertStatus(403);
    }

    public function test_mark_as_sold_functionality(): void
    {
        $user = User::factory()->create();
        $shop = Shop::factory()->create(['owner_id' => $user->id]);
        $listing = Listing::factory()->create(['shop_id' => $shop->shop_id, 'is_sold' => false]);

        $response = $this->actingAs($user)
            ->postJson("/api/listings/{$listing->listing_id}/mark-as-sold");

        $response->assertStatus(200);
        $this->assertTrue($listing->fresh()->is_sold);
        $this->assertNotNull($listing->fresh()->sold_at);
    }

    public function test_restock_functionality(): void
    {
        $user = User::factory()->create();
        $shop = Shop::factory()->create(['owner_id' => $user->id]);
        $listing = Listing::factory()->sold()->create(['shop_id' => $shop->shop_id]);

        $response = $this->actingAs($user)
            ->postJson("/api/listings/{$listing->listing_id}/restock");

        $response->assertStatus(200);
        $this->assertFalse($listing->fresh()->is_sold);
        $this->assertNull($listing->fresh()->sold_at);
    }
}
