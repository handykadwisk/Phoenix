<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TReminder extends Model
{
    use HasFactory;

    protected $primaryKey = 'REMINDER_ID';

    protected $table = 't_reminder';

    protected $guarded = [
        'REMINDER_ID',
    ];

    public $timestamps = false;

    public function mReminderParticipant()
    {
        return $this->hasMany(MReminderParticipant::class, 'REMINDER_ID', 'REMINDER_ID');
    }

    public function mMethodReminder()
    {
        return $this->hasMany(MReminderMethodNotification::class, 'REMINDER_ID', 'REMINDER_ID');
    }
}
