<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_ban_user(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create(['is_banned' => false]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/users/{$user->id}/ban");

        $response->assertStatus(200);
        $this->assertTrue($user->fresh()->is_banned);
    }

    public function test_admin_can_unban_user(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->banned()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/users/{$user->id}/unban");

        $response->assertStatus(200);
        $this->assertFalse($user->fresh()->is_banned);
    }

    public function test_non_admin_cannot_ban_users(): void
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/admin/users/{$targetUser->id}/ban");

        $response->assertStatus(403);
    }

    public function test_admin_can_view_all_users(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->count(3)->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/users');

        $response->assertStatus(200)
            ->assertJsonCount(4, 'data'); // 3 users + 1 admin
    }
}
