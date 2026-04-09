<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedItem extends Model
{
    protected $fillable = [
        'user_id',
        'listing_id',
        'saved_at',
    ];

    public $timestamps = false;

    protected $casts = [
        'saved_at' => 'datetime',
    ];

    // Relationship: SavedItem belongs to User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship: SavedItem belongs to Listing
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }
}
