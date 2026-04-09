<?php

namespace Tests\Feature\Admin;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_reports(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/reports');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_admin_can_verify_shop(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();
        $shop = Shop::factory()->create([
            'owner_id' => $user->id,
            'status' => 'Pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/shops/{$shop->shop_id}/verify");

        $response->assertStatus(200);
        $this->assertEquals('Active', $shop->fresh()->status);
    }

    public function test_non_admin_cannot_verify_shop(): void
    {
        $user = User::factory()->create();
        $shop = Shop::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/admin/shops/{$shop->shop_id}/verify");

        $response->assertStatus(403);
    }
}
