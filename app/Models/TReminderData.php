<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TReminderData extends Model
{
    use HasFactory;

    protected $primaryKey = 'REMINDER_DATA_ID';

    protected $table = 't_reminder_data';

    protected $guarded = [
        'REMINDER_DATA_ID',
    ];

    public $timestamps = false;
}
