<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TDetailReminder extends Model
{
    use HasFactory;

    protected $primaryKey = 'DETAIL_REMINDER_ID';

    protected $table = 't_detail_reminder';

    protected $guarded = [
        'DETAIL_REMINDER_ID',
    ];

    public $timestamps = false;
}
