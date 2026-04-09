<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get sample users
        $users = User::whereIn('email', [
            'john@example.com',
            'jane@example.com',
            'admin@gmail.com',
        ])->get();

        // Get sample listings
        $listings = Listing::all();

        if ($users->count() > 0 && $listings->count() > 0) {
            // Create sample orders
            foreach ($users as $user) {
                foreach ($listings as $listing) {
                    // Randomly decide whether to create an order for this user-listing combination
                    if (rand(0, 1)) { // 50% chance
                        Order::create([
                            'user_id' => $user->id,
                            'listing_id' => $listing->listing_id,
                            'quantity' => rand(1, 3),
                            'total_price' => $listing->price * rand(1, 3),
                            'status' => $this->getRandomStatus(),
                            'shipping_address' => $this->getRandomAddress(),
                            'payment_method' => $this->getRandomPaymentMethod(),
                        ]);
                    }
                }
            }
        }
    }

    private function getRandomStatus(): string
    {
        $statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

        return $statuses[array_rand($statuses)];
    }

    private function getRandomAddress(): string
    {
        $streets = ['123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Elm St', '654 Maple Dr'];
        $cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
        $states = ['NY', 'CA', 'IL', 'TX', 'AZ'];

        $street = $streets[array_rand($streets)];
        $city = $cities[array_rand($cities)];
        $state = $states[array_rand($states)];
        $zip = rand(10000, 99999);

        return "$street, $city, $state $zip";
    }

    private function getRandomPaymentMethod(): string
    {
        $methods = ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'];

        return $methods[array_rand($methods)];
    }
}
