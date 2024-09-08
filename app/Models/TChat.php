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

    public $timestamps = false;
}
