<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Listing;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;

class ListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the admin user (who is the only shop owner)
        $adminUser = User::where('email', 'admin@gmail.com')->first();

        if (! $adminUser) {
            // If admin user doesn't exist, create it
            $adminUser = User::create([
                'name' => 'Admin User',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('password'),
                'is_customer' => true,
                'is_staff' => true,
                'is_shop_owner' => true,
                'is_admin' => true,
            ]);
        }

        // Get the admin's shop
        $shop = Shop::where('owner_id', $adminUser->id)->first();

        if (! $shop) {
            // Create a shop for the admin user if it doesn't exist
            $shop = Shop::create([
                'owner_id' => $adminUser->id,
                'shop_name' => 'Admin Official Store',
                'description' => 'Official store managed by the admin user',
                'contact_email' => $adminUser->email,
                'contact_phone' => '+1-555-ADMIN',
                'address' => 'Admin Headquarters, System City',
                'status' => 'Active',
            ]);
        }

        // Create some sample categories if they don't exist
        $categories = [
            ['category_name' => 'Electronics', 'description' => 'Electronic devices and accessories'],
            ['category_name' => 'Clothing', 'description' => 'Clothing and fashion items'],
            ['category_name' => 'Home & Garden', 'description' => 'Home and garden supplies'],
            ['category_name' => 'Books', 'description' => 'Books and educational materials'],
            ['category_name' => 'Sports', 'description' => 'Sports and outdoor equipment'],
        ];

        foreach ($categories as $categoryData) {
            \App\Models\Category::firstOrCreate(
                ['category_name' => $categoryData['category_name']],
                $categoryData
            );
        }

        // Get some category IDs for use in listings
        $electronicsCategory = \App\Models\Category::where('category_name', 'Electronics')->first();
        $clothingCategory = \App\Models\Category::where('category_name', 'Clothing')->first();
        $homeGardenCategory = \App\Models\Category::where('category_name', 'Home & Garden')->first();
        $sportsCategory = \App\Models\Category::where('category_name', 'Sports')->first();

        // Sample listings data
        $listings = [
            [
                'title' => 'iPhone 15 Pro',
                'description' => 'Brand new iPhone 15 Pro in excellent condition. Comes with original box and accessories.',
                'price' => 999.99,
                'stock_quantity' => 5,
                'category_id' => $electronicsCategory->category_id,
                'status' => 'Active',
            ],
            [
                'title' => 'Gaming Laptop',
                'description' => 'High-performance gaming laptop with RTX 4070, 16GB RAM, 1TB SSD. Perfect for gaming and content creation.',
                'price' => 1499.99,
                'stock_quantity' => 3,
                'category_id' => $electronicsCategory->category_id,
                'status' => 'Active',
            ],
            [
                'title' => 'Designer Jeans',
                'description' => 'Premium designer jeans in excellent condition. Size 32x32. Worn only once.',
                'price' => 89.99,
                'stock_quantity' => 10,
                'category_id' => $clothingCategory->category_id,
                'status' => 'Active',
            ],
            [
                'title' => 'Coffee Maker',
                'description' => 'Brand new coffee maker with multiple brewing options. Never used, still in box.',
                'price' => 79.99,
                'stock_quantity' => 7,
                'category_id' => $homeGardenCategory->category_id,
                'status' => 'Active',
            ],
            [
                'title' => 'Mountain Bike',
                'description' => 'Gentleman\'s mountain bike, barely used. Perfect for trails and commuting.',
                'price' => 349.99,
                'stock_quantity' => 2,
                'category_id' => 5, // Sports category
                'status' => 'Active',
            ],
            [
                'title' => 'Wireless Headphones',
                'description' => 'Noise-cancelling wireless headphones with premium sound quality and 30-hour battery life.',
                'price' => 199.99,
                'stock_quantity' => 8,
                'category_id' => $electronicsCategory->category_id,
                'status' => 'Active',
            ],
            [
                'title' => 'Smart Watch',
                'description' => 'Latest generation smartwatch with health monitoring, GPS, and water resistance.',
                'price' => 299.99,
                'stock_quantity' => 6,
                'category_id' => $electronicsCategory->category_id,
                'status' => 'Active',
            ],
            [
                'title' => 'Ergonomic Desk Chair',
                'description' => 'Comfortable ergonomic office chair with lumbar support and adjustable height.',
                'price' => 189.99,
                'stock_quantity' => 4,
                'category_id' => $homeGardenCategory->category_id,
                'status' => 'Active',
            ],
            [
                'title' => 'Running Shoes',
                'description' => 'Lightweight running shoes with extra cushioning and breathable material.',
                'price' => 129.99,
                'stock_quantity' => 12,
                'category_id' => $sportsCategory->category_id ?? 5, // Sports category
                'status' => 'Active',
            ],
            [
                'title' => 'Travel Backpack',
                'description' => 'Water-resistant travel backpack with laptop compartment and multiple pockets.',
                'price' => 79.99,
                'stock_quantity' => 15,
                'category_id' => $sportsCategory->category_id ?? 5, // Sports category
                'status' => 'Active',
            ],
            [
                'title' => 'Professional Blender',
                'description' => 'High-powered kitchen blender with multiple speed settings and durable blades.',
                'price' => 89.99,
                'stock_quantity' => 9,
                'category_id' => $homeGardenCategory->category_id,
                'status' => 'Active',
            ],
            [
                'title' => 'Designer Sunglasses',
                'description' => 'Stylish UV-protection sunglasses with polarized lenses and lightweight frame.',
                'price' => 149.99,
                'stock_quantity' => 11,
                'category_id' => $clothingCategory->category_id,
                'status' => 'Active',
            ],
            [
                'title' => 'Athletic Sneakers',
                'description' => 'Comfortable athletic sneakers suitable for gym, running, and casual wear.',
                'price' => 119.99,
                'stock_quantity' => 10,
                'category_id' => $sportsCategory->category_id ?? 5, // Sports category
                'status' => 'Active',
            ],
            [
                'title' => 'Digital Camera',
                'description' => 'Professional digital camera with 24MP sensor, 4K video, and interchangeable lenses.',
                'price' => 799.99,
                'stock_quantity' => 3,
                'category_id' => $electronicsCategory->category_id,
                'status' => 'Active',
            ],
            [
                'title' => 'Tablet Device',
                'description' => '10-inch tablet with high-resolution display, long battery life, and stylus support.',
                'price' => 399.99,
                'stock_quantity' => 7,
                'category_id' => $electronicsCategory->category_id,
                'status' => 'Active',
            ],
        ];

        // Create the listings
        foreach ($listings as $index => $listingData) {
            // Create a unique image filename based on the product title
            $slug = strtolower(preg_replace('/[^A-Za-z0-9\-]/', '-', $listingData['title']));
            // Clean up any multiple consecutive hyphens
            $slug = preg_replace('/-+/', '-', $slug);
            // Remove leading/trailing hyphens
            $slug = trim($slug, '-');
            $imageName = $slug.'.jpg';

            // Create the listing with shop_id
            \App\Models\Listing::create([
                'shop_id' => $shop->shop_id,
                'title' => $listingData['title'],
                'description' => $listingData['description'],
                'price' => $listingData['price'],
                'stock_quantity' => $listingData['stock_quantity'],
                'category_id' => $listingData['category_id'],
                'status' => $listingData['status'],
                'image_urls' => json_encode([]), // No images - users can upload their own
            ]);
        }
    }
}
