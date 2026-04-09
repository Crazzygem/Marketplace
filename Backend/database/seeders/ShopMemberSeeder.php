<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\ShopMember;
use App\Models\User;
use Illuminate\Database\Seeder;

class ShopMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the admin user and shop
        $adminUser = User::where('email', 'admin@gmail.com')->first();
        $adminShop = Shop::where('owner_id', $adminUser->id)->first();

        // Get other users to add as staff
        $staffUser = User::where('email', 'alice@example.com')->first();

        if ($adminShop && $staffUser) {
            // Add Alice as staff member to the admin's shop
            ShopMember::firstOrCreate(
                [
                    'shop_id' => $adminShop->shop_id,
                    'user_id' => $staffUser->id,
                ],
                [
                    'role' => 'staff',
                ]
            );
        }

        // Create another shop for Charlie Brown
        $charlieUser = User::where('email', 'charlie@example.com')->first();
        if ($charlieUser) {
            $charlieShop = Shop::firstOrCreate(
                ['owner_id' => $charlieUser->id],
                [
                    'shop_name' => 'Charlie\'s Tech Store',
                    'description' => 'Tech gadgets and accessories',
                    'status' => 'Active',
                    'subscription_tier' => 'premium',
                ]
            );

            // Add Bob Johnson as staff to Charlie's shop
            $bobUser = User::where('email', 'bob@example.com')->first();
            if ($charlieShop && $bobUser) {
                ShopMember::firstOrCreate(
                    [
                        'shop_id' => $charlieShop->shop_id,
                        'user_id' => $bobUser->id,
                    ],
                    [
                        'role' => 'seller',
                    ]
                );
            }
        }
    }
}
