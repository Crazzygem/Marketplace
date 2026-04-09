<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'category_name' => 'Electronics',
                'description' => 'Electronic devices and accessories',
                'icon' => 'fa-mobile-alt',
                'is_popular' => true,
            ],
            [
                'category_name' => 'Clothing',
                'description' => 'Apparel and fashion items',
                'icon' => 'fa-tshirt',
                'is_popular' => true,
            ],
            [
                'category_name' => 'Home & Garden',
                'description' => 'Home improvement and garden supplies',
                'icon' => 'fa-home',
                'is_popular' => true,
            ],
            [
                'category_name' => 'Books',
                'description' => 'Books and educational materials',
                'icon' => 'fa-book',
                'is_popular' => true,
            ],
            [
                'category_name' => 'Sports',
                'description' => 'Sports equipment and accessories',
                'icon' => 'fa-running',
                'is_popular' => false,
            ],
            [
                'category_name' => 'Automotive',
                'description' => 'Cars, motorcycles and automotive accessories',
                'icon' => 'fa-car',
                'is_popular' => false,
            ],
            [
                'category_name' => 'Toys & Games',
                'description' => 'Toys, games and entertainment',
                'icon' => 'fa-gamepad',
                'is_popular' => false,
            ],
            [
                'category_name' => 'Health & Beauty',
                'description' => 'Health, beauty and personal care products',
                'icon' => 'fa-spa',
                'is_popular' => false,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }
    }
}
