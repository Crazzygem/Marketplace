<?php

namespace Database\Factories;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShopFactory extends Factory
{
    protected $model = Shop::class;

    public function definition(): array
    {
        return [
            'owner_id' => User::factory(),
            'shop_name' => $this->faker->company(),
            'description' => $this->faker->paragraph(),
            'logo_url' => $this->faker->imageUrl(),
            'status' => 'Pending',
            'subscription_tier' => 'basic',
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Active',
        ]);
    }
}
