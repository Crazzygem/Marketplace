<?php

namespace Tests\Unit\Models;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_role_method(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();

        $this->assertTrue($admin->hasRole('admin'));
        $this->assertFalse($customer->hasRole('admin'));
    }

    public function test_user_has_any_role_method(): void
    {
        $admin = User::factory()->admin()->create();
        $shopOwner = User::factory()->shopOwner()->create();
        $customer = User::factory()->create();

        $this->assertTrue($admin->hasAnyRole(['admin', 'shop_owner']));
        $this->assertTrue($shopOwner->hasAnyRole(['admin', 'shop_owner']));
        $this->assertFalse($customer->hasAnyRole(['admin', 'shop_owner']));
    }

    public function test_user_has_all_roles_method(): void
    {
        $user = User::factory()->create([
            'is_admin' => true,
            'is_shop_owner' => true,
        ]);

        $this->assertTrue($user->hasAllRoles(['admin', 'shop_owner']));
        $this->assertFalse($user->hasAllRoles(['admin', 'staff']));
    }

    public function test_user_is_admin_computed(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();

        $this->assertTrue($admin->is_admin);
        $this->assertFalse($customer->is_admin);
    }

    public function test_user_is_shop_owner_computed(): void
    {
        $shopOwner = User::factory()->shopOwner()->create();
        $customer = User::factory()->create();

        $this->assertTrue($shopOwner->is_shop_owner);
        $this->assertFalse($customer->is_shop_owner);
    }

    public function test_user_is_banned_computed(): void
    {
        $bannedUser = User::factory()->banned()->create();
        $customer = User::factory()->create();

        $this->assertTrue($bannedUser->is_banned);
        $this->assertFalse($customer->is_banned);
    }

    public function test_user_factory_creates_with_default_customer_role(): void
    {
        $user = User::factory()->create();

        $this->assertTrue($user->is_customer);
        $this->assertFalse($user->is_admin);
        $this->assertFalse($user->is_shop_owner);
        $this->assertFalse($user->is_staff);
    }

    public function test_user_has_own_shop_relationship(): void
    {
        $user = User::factory()->shopOwner()->create();
        
        // Create a Shop record owned by this user
        $shop = \App\Models\Shop::factory()->create([
            'owner_id' => $user->id,
        ]);
        
        $this->assertInstanceOf(\App\Models\Shop::class, $user->ownShop);
        $this->assertEquals($shop->shop_id, $user->ownShop->shop_id);
    }

    public function test_user_has_shop_memberships_relationship(): void
    {
        $user = User::factory()->create();
        
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $user->shopMemberships);
    }
}
