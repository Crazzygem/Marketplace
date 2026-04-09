<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add individual boolean columns for each role
            $table->boolean('is_customer')->default(false);
            $table->boolean('is_seller')->default(false);
            $table->boolean('is_staff')->default(false);
            $table->boolean('is_shop_owner')->default(false);
            $table->boolean('is_admin')->default(false);
        });

        // Migrate existing role data to the new boolean columns
        DB::statement('UPDATE users SET is_customer = 1 WHERE role = "customer"');
        DB::statement('UPDATE users SET is_seller = 1 WHERE role = "seller"');
        DB::statement('UPDATE users SET is_staff = 1 WHERE role = "staff"');
        DB::statement('UPDATE users SET is_shop_owner = 1 WHERE role = "shop_owner"');
        DB::statement('UPDATE users SET is_admin = 1 WHERE role = "admin"');

        // Set default to customer for any users who don't have a specific role set
        DB::statement('UPDATE users SET is_customer = 1 WHERE is_customer = 0 AND is_seller = 0 AND is_staff = 0 AND is_shop_owner = 0 AND is_admin = 0');

        Schema::table('users', function (Blueprint $table) {
            // Drop the old role enum column
            $table->dropColumn('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add back the old role enum column
            $table->enum('role', ['customer', 'seller', 'staff', 'shop_owner', 'admin'])->default('customer');
        });

        // Convert boolean roles back to enum (prioritizing higher roles)
        DB::statement('UPDATE users SET role = "admin" WHERE is_admin = 1');
        DB::statement('UPDATE users SET role = "shop_owner" WHERE is_shop_owner = 1 AND role != "admin"');
        DB::statement('UPDATE users SET role = "staff" WHERE is_staff = 1 AND role NOT IN ("admin", "shop_owner")');
        DB::statement('UPDATE users SET role = "seller" WHERE is_seller = 1 AND role NOT IN ("admin", "shop_owner", "staff")');
        DB::statement('UPDATE users SET role = "customer" WHERE is_customer = 1 AND role NOT IN ("admin", "shop_owner", "staff", "seller")');

        Schema::table('users', function (Blueprint $table) {
            // Drop the new boolean columns
            $table->dropColumn(['is_customer', 'is_seller', 'is_staff', 'is_shop_owner', 'is_admin']);
        });
    }
};
