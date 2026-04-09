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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id('review_id');
            $table->unsignedBigInteger('reviewer_id'); // User who left the review
            $table->unsignedBigInteger('seller_id'); // Seller being reviewed
            $table->unsignedBigInteger('listing_id')->nullable(); // Optional: review for specific listing
            $table->integer('star_rating'); // 1-5 stars
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->foreign('reviewer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('seller_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('listing_id')->references('listing_id')->on('listings')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
