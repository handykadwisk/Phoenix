<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TChatParticipant extends Model
{
    use HasFactory;

    protected $primaryKey = 'CHAT_PARTICIPANT_ID';

    protected $table = 't_chat_participant';

    protected $guarded = [
        'CHAT_PARTICIPANT_ID',
    ];

    public $timestamps = false;
}
