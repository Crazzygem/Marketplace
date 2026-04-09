<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopMember extends Model
{
    use HasFactory;

    protected $primaryKey = 'member_id';

    protected $fillable = [
        'shop_id', 'user_id', 'role',
    ];

    // Relationship: A shop member belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship: A shop member belongs to a shop
    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id');
    }
}
