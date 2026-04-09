<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class UpdateAdminRoles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-admin-roles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update admin user to have all roles enabled';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find the admin user (assuming ID 1 is the admin)
        $adminUser = User::where('is_admin', true)->first();

        if (! $adminUser) {
            $this->error('No admin user found!');

            return 1;
        }

        // Update the admin user to have all roles
        $adminUser->update([
            'is_customer' => true,
            'is_staff' => true,
            'is_shop_owner' => true,
        ]);

        $this->info("Admin user (ID: {$adminUser->id}) updated with all roles!");
        $this->info("Name: {$adminUser->name}");
        $this->info("Email: {$adminUser->email}");
        $this->info('Roles - Customer: '.($adminUser->is_customer ? 'Yes' : 'No'));
        $this->info('Roles - Staff: '.($adminUser->is_staff ? 'Yes' : 'No'));
        $this->info('Roles - Shop Owner: '.($adminUser->is_shop_owner ? 'Yes' : 'No'));
        $this->info('Roles - Admin: '.($adminUser->is_admin ? 'Yes' : 'No'));

        return 0;
    }
}
