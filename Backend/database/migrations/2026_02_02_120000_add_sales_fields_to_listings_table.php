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
        Schema::table('listings', function (Blueprint $table) {
            $table->integer('sales_count')->default(0)->after('view_count');
            $table->boolean('is_sold')->default(false)->after('sales_count');
            $table->timestamp('sold_at')->nullable()->after('is_sold');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['sales_count', 'is_sold', 'sold_at']);
        });
    }
};
