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
        Schema::create('shops', function (Blueprint $table) {
            $table->id('shop_id');
            $table->unsignedBigInteger('owner_id');
            $table->string('shop_name');
            $table->text('description')->nullable();
            $table->string('logo_url')->nullable();
            $table->enum('status', ['Pending', 'Active', 'Suspended'])->default('Pending');
            $table->string('subscription_tier')->default('basic');
            $table->timestamps();

            $table->foreign('owner_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
