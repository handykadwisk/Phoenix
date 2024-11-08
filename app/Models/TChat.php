<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TChat extends Model
{
    use HasFactory;

    protected $primaryKey = 'CHAT_ID';

    protected $table = 't_chat';

    protected $guarded = [
        'CHAT_ID',
    ];

    // public $with = ['pinChat'];

    public $timestamps = false;

    public function tUser()
    {
        return $this->hasOne(User::class, 'id', 'CREATED_CHAT_BY');
    }

    public function pinChat()
    {
        return $this->hasMany(TPinChat::class, "CHAT_ID", "CHAT_ID");
    }

    public function tParticipant()
    {
        return $this->hasMany(TChatParticipant::class, "CHAT_ID", "CHAT_ID");
    }
}
