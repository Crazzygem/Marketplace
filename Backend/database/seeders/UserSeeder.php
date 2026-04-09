<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'is_customer' => true,
                'is_staff' => false,
                'is_shop_owner' => false,
                'is_admin' => false,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'is_customer' => true,
                'is_staff' => false,
                'is_shop_owner' => false,
                'is_admin' => false,
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'bob@example.com',
                'password' => Hash::make('password'),
                'is_customer' => true,
                'is_staff' => false,
                'is_shop_owner' => false,
                'is_admin' => false,
            ],
            [
                'name' => 'Alice Williams',
                'email' => 'alice@example.com',
                'password' => Hash::make('password'),
                'is_customer' => true,
                'is_staff' => true,
                'is_shop_owner' => false,
                'is_admin' => false,
            ],
            [
                'name' => 'Charlie Brown',
                'email' => 'charlie@example.com',
                'password' => Hash::make('password'),
                'is_customer' => true,
                'is_staff' => false,
                'is_shop_owner' => true,
                'is_admin' => false,
            ],
        ];

        foreach ($customers as $customerData) {
            User::firstOrCreate(
                ['email' => $customerData['email']],
                $customerData
            );
        }
    }
}
