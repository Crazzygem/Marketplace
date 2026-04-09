<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemRevenue extends Model
{
    use HasFactory;

    protected $table = 'system_revenues'; // Specify the correct table name

    protected $primaryKey = 'id'; // Use the default 'id' primary key

    protected $fillable = [
        'amount', 'transaction_type', 'description', 'related_user_id',
        'related_listing_id', 'related_shop_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];
}
