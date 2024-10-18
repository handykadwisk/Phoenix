<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MReminderMethodNotification extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_REMINDER_METHOD_NOTIFICATION_ID';

    protected $table = 'm_reminder_method_notification';

    protected $guarded = [
        'M_REMINDER_METHOD_NOTIFICATION_ID',
    ];

    public $timestamps = false;
}
