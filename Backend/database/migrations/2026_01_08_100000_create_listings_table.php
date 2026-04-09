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
        Schema::create('listings', function (Blueprint $table) {
            $table->id('listing_id');
            $table->unsignedBigInteger('shop_id');
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->integer('stock_quantity')->default(0);
            $table->string('image_urls')->nullable(); // JSON string of image URLs
            $table->enum('status', ['Draft', 'Active', 'Sold Out', 'Inactive'])->default('Draft');
            $table->integer('view_count')->default(0);
            $table->timestamps();

            $table->foreign('shop_id')->references('shop_id')->on('shops')->onDelete('cascade');
            $table->foreign('category_id')->references('category_id')->on('categories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
