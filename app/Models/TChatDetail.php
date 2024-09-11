<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TChatDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'CHAT_DETAIL_ID';

    protected $table = 't_chat_detail';

    protected $guarded = [
        'CHAT_DETAIL_ID',
    ];

    public $timestamps = false;

    public function tUser()
    {
        return $this->hasOne(User::class, 'id', 'CREATED_CHAT_DETAIL_BY');
    }
}
