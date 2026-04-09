<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $primaryKey = 'order_id';

    protected $fillable = [
        'user_id', 'listing_id', 'quantity', 'total_price',
        'status', 'shipping_address', 'payment_method', 'transaction_id',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    // Relationship: An order belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship: An order belongs to a listing
    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }
}
