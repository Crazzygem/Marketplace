<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    use HasFactory;

    protected $primaryKey = 'room_id';

    public $timestamps = false; // Based on your SQL

    protected $fillable = [
        'listing_id', 'buyer_id', 'seller_id',
    ];

    // Relationship: A chat room belongs to a listing
    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }

    // Relationship: A chat room belongs to a buyer
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    // Relationship: A chat room belongs to a seller
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    // Relationship: A chat room has many messages
    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'room_id');
    }
}
