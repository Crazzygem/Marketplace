<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Check if column exists before attempting to drop
        if (Schema::hasColumn('users', 'is_seller')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('is_seller');
            });
        }
    }

    public function down(): void
    {
        // Only add column if it doesn't exist
        if (!Schema::hasColumn('users', 'is_seller')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('is_seller')->default(false)->after('is_customer');
            });
        }
    }
};
