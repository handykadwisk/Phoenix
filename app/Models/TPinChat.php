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
}
