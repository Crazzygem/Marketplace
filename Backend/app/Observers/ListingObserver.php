<?php

namespace App\Observers;

use App\Models\Listing;
use Illuminate\Support\Facades\Storage;

class ListingObserver
{
    /**
     * Handle the Listing "created" event.
     */
    public function created(Listing $listing): void
    {
        //
    }

    /**
     * Handle the Listing "updated" event.
     */
    public function updated(Listing $listing): void
    {
        //
    }

    /**
     * Handle the Listing "deleted" event.
     */
    public function deleted(Listing $listing): void
    {
        // Delete associated images when a listing is deleted
        $imagePaths = json_decode($listing->image_urls, true);

        if ($imagePaths && is_array($imagePaths)) {
            foreach ($imagePaths as $imagePath) {
                // Delete the image file from the listings disk
                Storage::disk('listings')->delete($imagePath);
            }
        }
    }

    /**
     * Handle the Listing "restored" event.
     */
    public function restored(Listing $listing): void
    {
        //
    }

    /**
     * Handle the Listing "force deleted" event.
     */
    public function forceDeleted(Listing $listing): void
    {
        // Even when force deleting, remove the associated images
        $imagePaths = json_decode($listing->image_urls, true);

        if ($imagePaths && is_array($imagePaths)) {
            foreach ($imagePaths as $imagePath) {
                // Delete the image file from the listings disk
                Storage::disk('listings')->delete($imagePath);
            }
        }
    }
}
