<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPinChatDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'PIN_CHAT_DETAIL_ID';

    protected $table = 'm_pin_chat_detail';

    protected $guarded = [
        'PIN_CHAT_DETAIL_ID',
    ];
    public $with = ['pinChat'];
    
    public $timestamps = false;

    public function pinChat()
    {
        return $this->hasOne(TPinChat::class, 'PIN_CHAT_ID', 'PIN_CHAT_DETAIL');
    }
}
