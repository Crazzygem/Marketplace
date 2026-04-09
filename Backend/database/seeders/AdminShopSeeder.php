<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the admin user
        $adminUser = User::where('email', 'admin@gmail.com')->first();

        if ($adminUser) {
            // Create a shop for the admin user
            Shop::create([
                'owner_id' => $adminUser->id,
                'shop_name' => 'Admin Official Store',
                'description' => 'Official store managed by the admin user',
                'contact_email' => $adminUser->email,
                'contact_phone' => '+1-555-ADMIN',
                'address' => 'Admin Headquarters, System City',
                'status' => 'Active',
            ]);
        }
    }
}
