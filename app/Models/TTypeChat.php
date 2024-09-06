<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TTypeChat extends Model
{
    use HasFactory;

    protected $primaryKey = 'TYPE_CHAT_ID';

    protected $table = 't_type_chat';

    protected $guarded = [
        'TYPE_CHAT_ID',
    ];

    public $timestamps = false;
}
