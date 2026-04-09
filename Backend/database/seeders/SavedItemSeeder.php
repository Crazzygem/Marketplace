<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\SavedItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class SavedItemSeeder extends Seeder
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
            foreach ($users as $user) {
                foreach ($listings as $listing) {
                    // Randomly decide whether to save this listing for the user
                    if (rand(0, 2) < 2) { // 66% chance
                        SavedItem::firstOrCreate([
                            'user_id' => $user->id,
                            'listing_id' => $listing->listing_id,
                        ], [
                            'saved_at' => now(),
                        ]);
                    }
                }
            }

            // Ensure admin user has some saved items regardless of random chance
            $adminUser = User::where('email', 'admin@gmail.com')->first();
            if ($adminUser) {
                // Count how many saved items the admin already has
                $adminSavedItemCount = SavedItem::where('user_id', $adminUser->id)->count();

                // Add up to 3 saved items if admin doesn't have enough
                $listingsToAdd = collect($listings)->random(min(3 - $adminSavedItemCount, $listings->count()));

                foreach ($listingsToAdd as $listing) {
                    SavedItem::firstOrCreate([
                        'user_id' => $adminUser->id,
                        'listing_id' => $listing->listing_id,
                    ], [
                        'saved_at' => now(),
                    ]);
                }
            }
        }
    }
}
