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
        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('listing_id');
            $table->integer('quantity');
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'])->default('Pending');
            $table->string('shipping_address');
            $table->string('payment_method');
            $table->string('transaction_id')->nullable(); // For tracking payment
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('listing_id')->references('listing_id')->on('listings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
