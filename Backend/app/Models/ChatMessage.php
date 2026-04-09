<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    protected $primaryKey = 'message_id';

    public $timestamps = false; // Based on your SQL

    protected $fillable = [
        'room_id', 'sender_id', 'message_text', 'is_read', 'created_at',
    ];

    // Relationship: A message belongs to a chat room
    public function room()
    {
        return $this->belongsTo(ChatRoom::class, 'room_id');
    }

    // Relationship: A message belongs to a sender (user)
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
