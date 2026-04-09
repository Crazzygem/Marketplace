<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get sample users and listings
        $users = User::whereIn('email', [
            'john@example.com',
            'jane@example.com',
            'admin@gmail.com',
        ])->get();

        $listings = Listing::all();

        if ($users->count() > 0 && $listings->count() > 0) {
            foreach ($users as $user) {
                foreach ($listings as $listing) {
                    // Randomly decide whether to create a review for this user-listing combination
                    if (rand(0, 2) === 0) { // 33% chance
                        Review::create([
                            'reviewer_id' => $user->id,
                            'seller_id' => $listing->shop ? $listing->shop->owner_id : $user->id,
                            'listing_id' => $listing->listing_id,
                            'star_rating' => rand(1, 5),
                            'comment' => $this->getRandomComment(),
                        ]);
                    }
                }
            }
        }
    }

    private function getRandomComment(): string
    {
        $comments = [
            'Great product, highly recommend!',
            'Good value for money.',
            'Average quality, could be better.',
            'Not satisfied with the purchase.',
            'Amazing quality and fast delivery!',
            'Exactly as described, thank you!',
            'Product arrived damaged.',
            'Very pleased with the purchase.',
            'Would buy again.',
            'Decent product for the price.',
        ];

        return $comments[array_rand($comments)];
    }
}
