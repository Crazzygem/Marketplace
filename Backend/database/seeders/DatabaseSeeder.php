<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run the individual seeders in the correct order
        $this->call(CategorySeeder::class);
        $this->call(AdminUserSeeder::class);
        $this->call(AdminShopSeeder::class);
        $this->call(UserSeeder::class);        // Add regular users
        $this->call(ShopMemberSeeder::class);  // Add shop members/staff
        $this->call(ListingSeeder::class);
        $this->call(OrderSeeder::class);
        $this->call(ReviewSeeder::class);
        $this->call(SavedItemSeeder::class);
    }
}
