<?php

namespace App\Console\Commands;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Console\Command;

class CreateAdminShop extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin-shop';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a shop for the admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find the admin user
        $adminUser = User::where('is_admin', true)->first();

        if (! $adminUser) {
            $this->error('No admin user found!');

            return 1;
        }

        // Check if admin already has a shop
        $existingShop = $adminUser->ownShop;
        if ($existingShop) {
            $this->warn("Admin user already has a shop (ID: {$existingShop->shop_id})");

            return 0;
        }

        // Create a shop for the admin user
        $shop = Shop::create([
            'owner_id' => $adminUser->id,
            'shop_name' => 'Admin Super Store',
            'description' => 'Official store managed by the admin user',
            'contact_email' => $adminUser->email,
            'contact_phone' => '+1-555-ADMIN',
            'address' => 'Admin Headquarters, System City',
            'status' => 'Active',
        ]);

        $this->info('Shop created successfully for admin user!');
        $this->info("Shop ID: {$shop->shop_id}");
        $this->info("Shop Name: {$shop->shop_name}");
        $this->info("Owner: {$adminUser->name} (ID: {$adminUser->id})");

        return 0;
    }
}
