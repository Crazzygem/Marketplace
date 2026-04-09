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
        Schema::create('chat_rooms', function (Blueprint $table) {
            $table->id('room_id');
            $table->unsignedBigInteger('listing_id')->nullable(); // Optional: for specific listing
            $table->unsignedBigInteger('buyer_id'); // Buyer in the chat
            $table->unsignedBigInteger('seller_id'); // Seller in the chat
            $table->timestamps();

            $table->foreign('listing_id')->references('listing_id')->on('listings')->onDelete('set null');
            $table->foreign('buyer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('seller_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_rooms');
    }
};
