<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    use HasFactory;

    protected $primaryKey = 'shop_id';

    protected $fillable = [
        'owner_id', 'shop_name', 'description', 'logo_url', 'status', 'subscription_tier',
    ];

    // Relationship: Shop has many employees
    public function members()
    {
        return $this->hasMany(ShopMember::class, 'shop_id');
    }

    // Relationship: Shop has many listings
    public function listings()
    {
        return $this->hasMany(Listing::class, 'shop_id');
    }
}
