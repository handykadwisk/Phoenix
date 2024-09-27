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
}
