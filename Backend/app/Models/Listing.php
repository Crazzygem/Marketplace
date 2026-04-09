<?php

namespace App\Models;

use App\Observers\ListingObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([ListingObserver::class])]
class Listing extends Model
{
    use HasFactory;

    protected $primaryKey = 'listing_id';

    protected $fillable = [
        'shop_id', 'category_id', 'title', 'description',
        'price', 'stock_quantity', 'image_urls', 'status', 'view_count',
        'sales_count', 'is_sold', 'sold_at',
    ];

    protected $casts = [
        'image_urls' => 'array',
        'price' => 'decimal:2',
        'is_sold' => 'boolean',
        'sold_at' => 'datetime',
    ];

    // Relationship: A listing belongs to a shop
    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id');
    }

    // Relationship: A listing belongs to a category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // Relationship: A listing has many reviews
    public function reviews()
    {
        return $this->hasMany(Review::class, 'listing_id');
    }

    // Scopes
    public function scopeSold($query)
    {
        return $query->where('is_sold', true);
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_sold', false);
    }

    // Methods
    public function markAsSold(): void
    {
        $this->update([
            'is_sold' => true,
            'sold_at' => now(),
        ]);
    }

    public function restock(): void
    {
        $this->update([
            'is_sold' => false,
            'sold_at' => null,
        ]);
    }

    public function incrementSales(int $quantity = 1): void
    {
        $this->increment('sales_count', $quantity);
    }
}
