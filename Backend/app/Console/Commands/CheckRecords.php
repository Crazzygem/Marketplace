<?php

namespace App\Console\Commands;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Console\Command;

class CheckRecords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:records';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check the number of users and listings in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userCount = User::count();
        $listingCount = Listing::count();

        $this->info("Number of users: {$userCount}");
        $this->info("Number of listings: {$listingCount}");

        if ($userCount === 0) {
            $this->warn('No users found in the database. You may need to seed the database.');
        }

        if ($listingCount === 0) {
            $this->warn('No listings found in the database. You may need to seed the database.');
        }
    }
}
