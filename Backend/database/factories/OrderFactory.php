<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $listing = Listing::factory()->create();
        $quantity = $this->faker->numberBetween(1, 5);
        $totalPrice = $listing->price * $quantity;

        return [
            'user_id' => User::factory(),
            'listing_id' => $listing->listing_id,
            'quantity' => $quantity,
            'total_price' => $totalPrice,
            'status' => 'Pending',
            'shipping_address' => $this->faker->address(),
            'payment_method' => 'Credit Card',
            'transaction_id' => $this->faker->uuid(),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Confirmed',
        ]);
    }
}
