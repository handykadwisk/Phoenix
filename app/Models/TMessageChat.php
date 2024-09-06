<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TMessageChat extends Model
{
    use HasFactory;

    protected $primaryKey = 'MESSAGE_CHAT_ID';

    protected $table = 't_message_chat';

    protected $guarded = [
        'MESSAGE_CHAT_ID',
    ];

    public $timestamps = false;

    public function tUser()
    {
        return $this->hasOne(User::class, 'id', 'USER_ID');
    }
}
