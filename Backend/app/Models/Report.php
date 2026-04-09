<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $primaryKey = 'report_id';

    // Allow mass assignment for creating reports
    protected $fillable = [
        'reporter_id', 'listing_id', 'reason', 'is_resolved',
    ];

    // Relationship: A report belongs to a reporter (user)
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    // Relationship: A report belongs to a listing
    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }
}
