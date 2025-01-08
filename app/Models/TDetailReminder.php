<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TDetailReminder extends Model
{
    use HasFactory;

    protected $primaryKey = 'REMINDER_DETAIL_ID';

    protected $table = 't_reminder_detail';

    protected $guarded = [
        'REMINDER_DETAIL_ID',
    ];

    public $timestamps = false;
}
