<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ChatRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'photo_url',
    ];

    public function chatRoomMembers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'chat_room_members');
    }
}
