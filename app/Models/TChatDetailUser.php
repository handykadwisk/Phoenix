<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TChatDetailUser extends Model
{
    use HasFactory;

    protected $primaryKey = 'CHAT_DETAIL_USER_ID';

    protected $table = 't_chat_detail_user';

    protected $guarded = [
        'CHAT_DETAIL_USER_ID',
    ];

    public $timestamps = false;

    public function tChatDetail()
    {
        return $this->hasOne(TChatDetail::class, "CHAT_DETAIL_ID", "CHAT_DETAIL_ID");
    }

    public function tChat()
    {
        return $this->hasOne(TChat::class, "CHAT_ID", "CHAT_ID");
    }

    public function userFormTo()
    {
        return $this->hasOne(User::class, "id", "CHAT_DETAIL_USER_FROM");
    }
}
