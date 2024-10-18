<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MReminderParticipant extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_REMINDER_PARTICIPANT_ID';

    protected $table = 'm_reminder_participant';

    protected $guarded = [
        'M_REMINDER_PARTICIPANT_ID',
    ];

    public $timestamps = false;
}
