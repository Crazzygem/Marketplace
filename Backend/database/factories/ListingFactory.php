<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Listing;
use App\Models\Shop;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingFactory extends Factory
{
    protected $model = Listing::class;

    public function definition(): array
    {
        return [
            'shop_id' => Shop::factory(),
            'category_id' => Category::factory(),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'stock_quantity' => $this->faker->numberBetween(1, 100),
            'image_urls' => json_encode([$this->faker->imageUrl(), $this->faker->imageUrl()]),
            'status' => 'Active',
            'view_count' => $this->faker->numberBetween(0, 500),
            'sales_count' => $this->faker->numberBetween(0, 50),
            'is_sold' => false,
            'sold_at' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Draft',
        ]);
    }

    public function sold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Sold Out',
            'is_sold' => true,
            'sold_at' => now(),
        ]);
    }
}
