<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $primaryKey = 'review_id';

    protected $fillable = [
        'reviewer_id', 'seller_id', 'listing_id', 'star_rating', 'comment',
    ];

    // Relationship: A review belongs to a reviewer (user)
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    // Relationship: A review belongs to a seller (user)
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    // Relationship: A review belongs to a listing
    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }
}
