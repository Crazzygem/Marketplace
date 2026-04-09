<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $primaryKey = 'log_id'; // Matching your SQL schema

    public $timestamps = false; // Disable auto-timestamps (we only have created_at)

    protected $fillable = [
        'user_id',
        'action',
        'details',
        'ip_address',
        'created_at',
    ];

    // Relationship: An audit log belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
