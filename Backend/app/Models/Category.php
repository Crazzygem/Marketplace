<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $primaryKey = 'category_id'; // Custom PK

    public $timestamps = false; // No created_at/updated_at in your SQL

    protected $fillable = [
        'category_name',
        'description',
        'icon',
        'is_popular',
    ];

    // Relationship: A category has many listings
    public function listings()
    {
        return $this->hasMany(Listing::class, 'category_id');
    }
}
