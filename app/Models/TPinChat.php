<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPinChat extends Model
{
    use HasFactory;

    protected $primaryKey = 'PIN_CHAT_ID';

    protected $table = 't_pin_chat';

    protected $guarded = [
        'PIN_CHAT_ID',
    ];

    public $timestamps = false;

    public function tUser()
    {
        return $this->hasOne(User::class, 'id', 'CREATED_PIN_CHAT_BY');
    }

    // public function tChat()
    // {
    //     return $this->hasMany(TChat::class, 'CHAT_ID', 'CHAT_ID');
    // }

    public function tChat()
    {
        return $this->belongsTo(TChat::class, 'CHAT_ID', 'CHAT_ID');
    }
}
