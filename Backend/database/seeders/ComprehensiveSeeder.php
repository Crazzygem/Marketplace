<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Listing;
use App\Models\Order;
use App\Models\Review;
use App\Models\SavedItem;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ComprehensiveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data (optional - uncomment if needed)
        // DB::table('saved_items')->delete();
        // DB::table('reviews')->delete();
        // DB::table('orders')->delete();
        // DB::table('listings')->delete();
        // DB::table('shops')->delete();
        // DB::table('users')->delete();
        // DB::table('categories')->delete();

        // Create default categories
        $categories = [
            ['category_name' => 'Electronics', 'description' => 'Electronic devices and accessories'],
            ['category_name' => 'Clothing', 'description' => 'Apparel and fashion items'],
            ['category_name' => 'Home & Garden', 'description' => 'Home improvement and garden supplies'],
            ['category_name' => 'Books', 'description' => 'Books and educational materials'],
            ['category_name' => 'Sports', 'description' => 'Sports equipment and accessories'],
            ['category_name' => 'Automotive', 'description' => 'Cars, motorcycles and automotive accessories'],
            ['category_name' => 'Toys & Games', 'description' => 'Toys, games and entertainment'],
            ['category_name' => 'Health & Beauty', 'description' => 'Health, beauty and personal care products'],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        // Get all categories for assigning to listings
        $allCategories = Category::all()->toArray();

        // Get existing images from storage
        $existingImages = Storage::disk('public')->files('listings');
        $imagePaths = [];

        foreach ($existingImages as $imagePath) {
            $imagePaths[] = basename($imagePath);
        }

        // Create additional users with different roles
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'is_customer' => true,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'is_customer' => true,
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'bob@example.com',
                'password' => Hash::make('password'),
                'is_customer' => true,
                'is_shop_owner' => true,
            ],
            [
                'name' => 'Alice Williams',
                'email' => 'alice@example.com',
                'password' => Hash::make('password'),
                'is_customer' => true,
                'is_staff' => true,
            ],
        ];

        $createdUsers = [];
        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => $userData['password'],
                    'is_customer' => $userData['is_customer'] ?? false,
                    'is_staff' => $userData['is_staff'] ?? false,
                    'is_shop_owner' => $userData['is_shop_owner'] ?? false,
                    'is_admin' => $userData['is_admin'] ?? false,
                ]
            );
            $createdUsers[] = $user;
        }

        // Create shops for shop owners
        $shopOwners = User::where('is_shop_owner', true)->get();
        $createdShops = [];

        foreach ($shopOwners as $owner) {
            $shop = Shop::create([
                'owner_id' => $owner->id,
                'shop_name' => "{$owner->name}'s Store",
                'description' => "Store owned by {$owner->name}, offering quality products.",
                'contact_email' => $owner->email,
                'contact_phone' => '+1-555-'.str_pad(rand(100, 9999), 4, '0', STR_PAD_LEFT),
                'address' => '123 Main St, '.['New York', 'Los Angeles', 'Chicago', 'Houston'][array_rand(['New York', 'Los Angeles', 'Chicago', 'Houston'])],
                'status' => 'Active',
            ]);
            $createdShops[] = $shop;
        }

        // Create listings with duplicated images
        $sampleProducts = [
            ['title' => 'Wireless Bluetooth Headphones', 'description' => 'High-quality wireless headphones with noise cancellation', 'price' => 89.99, 'stock_quantity' => 25],
            ['title' => 'Smartphone Case', 'description' => 'Protective case for latest smartphone models', 'price' => 19.99, 'stock_quantity' => 100],
            ['title' => 'Fitness Tracker Watch', 'description' => 'Track your steps, heart rate, and sleep patterns', 'price' => 79.99, 'stock_quantity' => 40],
            ['title' => 'Coffee Maker', 'description' => 'Programmable coffee maker with thermal carafe', 'price' => 59.99, 'stock_quantity' => 15],
            ['title' => 'Yoga Mat', 'description' => 'Non-slip eco-friendly yoga mat', 'price' => 24.99, 'stock_quantity' => 60],
            ['title' => 'Laptop Backpack', 'description' => 'Water-resistant backpack with laptop compartment', 'price' => 45.99, 'stock_quantity' => 30],
            ['title' => 'Desk Lamp', 'description' => 'Adjustable LED desk lamp with multiple brightness levels', 'price' => 34.99, 'stock_quantity' => 20],
            ['title' => 'Bluetooth Speaker', 'description' => 'Portable speaker with excellent sound quality', 'price' => 69.99, 'stock_quantity' => 35],
            ['title' => 'Running Shoes', 'description' => 'Comfortable running shoes for daily exercise', 'price' => 89.99, 'stock_quantity' => 18],
            ['title' => 'Cookware Set', 'description' => '10-piece non-stick cookware set', 'price' => 129.99, 'stock_quantity' => 12],
        ];

        $createdListings = [];
        foreach ($sampleProducts as $index => $product) {
            // Select a random category
            $randomCategory = $allCategories[array_rand($allCategories)];

            // Select a random shop if available, otherwise assign to first shop
            $shopId = null;
            if (! empty($createdShops)) {
                $randomShop = $createdShops[array_rand($createdShops)];
                $shopId = $randomShop->shop_id;
            }

            // Duplicate an image and rename it based on the product
            $imageToDuplicate = null;
            if (! empty($imagePaths)) {
                $imageToDuplicate = $imagePaths[$index % count($imagePaths)];

                // Create a new filename based on the product title
                $newFilename = Str::slug($product['title']).'_'.uniqid().'.'.pathinfo($imageToDuplicate, PATHINFO_EXTENSION);

                // Copy the image to the new name
                Storage::disk('public')->copy("listings/{$imageToDuplicate}", "listings/{$newFilename}");

                $imageList = [$newFilename];
            } else {
                $imageList = [];
            }

            $listing = Listing::create([
                'shop_id' => $shopId,
                'category_id' => $randomCategory['category_id'],
                'title' => $product['title'],
                'description' => $product['description'],
                'price' => $product['price'],
                'stock_quantity' => $product['stock_quantity'],
                'image_urls' => json_encode($imageList),
                'status' => 'Active',
            ]);

            $createdListings[] = $listing;
        }

        // Create some orders
        $customers = User::where('is_customer', true)->get();
        foreach ($customers as $customer) {
            // Randomly create 1-3 orders per customer
            $numOrders = rand(1, 3);
            for ($i = 0; $i < $numOrders; $i++) {
                if (! empty($createdListings)) {
                    $randomListing = $createdListings[array_rand($createdListings)];

                    Order::create([
                        'user_id' => $customer->id,
                        'listing_id' => $randomListing->listing_id,
                        'quantity' => rand(1, 3),
                        'total_price' => $randomListing->price * rand(1, 3),
                        'shipping_address' => 'Address for '.$customer->name.', '.['New York', 'Los Angeles', 'Chicago', 'Houston'][array_rand(['New York', 'Los Angeles', 'Chicago', 'Houston'])],
                        'payment_method' => ['Credit Card', 'PayPal', 'Bank Transfer'][array_rand(['Credit Card', 'PayPal', 'Bank Transfer'])],
                        'status' => ['Pending', 'Confirmed', 'Shipped', 'Delivered'][array_rand(['Pending', 'Confirmed', 'Shipped', 'Delivered'])],
                    ]);
                }
            }
        }

        // Create some reviews
        foreach ($createdListings as $listing) {
            // Randomly create 0-3 reviews per listing
            $numReviews = rand(0, 3);
            for ($i = 0; $i < $numReviews; $i++) {
                if (! empty($createdUsers)) {
                    $randomUser = $createdUsers[array_rand($createdUsers)];

                    Review::create([
                        'reviewer_id' => $randomUser->id,
                        'seller_id' => $randomUser->id, // Using same user as reviewer and seller for simplicity
                        'listing_id' => $listing->listing_id,
                        'star_rating' => rand(1, 5),
                        'comment' => ['Great product!', 'Good value for money.', 'Could be better.', 'Excellent quality.', 'Fast shipping.'][array_rand(['Great product!', 'Good value for money.', 'Could be better.', 'Excellent quality.', 'Fast shipping.'])],
                    ]);
                }
            }
        }

        // Create some saved items for users
        foreach ($createdUsers as $user) {
            // Randomly save 0-5 items per user
            $numSaved = rand(0, 5);
            $usedListings = [];
            for ($i = 0; $i < $numSaved; $i++) {
                if (! empty($createdListings)) {
                    $randomListing = $createdListings[array_rand($createdListings)];

                    // Make sure the same listing isn't saved twice by the same user
                    if (! in_array($randomListing->listing_id, $usedListings)) {
                        SavedItem::create([
                            'user_id' => $user->id,
                            'listing_id' => $randomListing->listing_id,
                        ]);
                        $usedListings[] = $randomListing->listing_id;
                    }
                }
            }
        }

        $this->command->info('Comprehensive seeding completed successfully!');
    }
}
