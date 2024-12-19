<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeOff extends Model
{
    use HasFactory;

    protected $primaryKey = 'REQUEST_TIME_OFF_ID';

    protected $table = 't_request_time_off';

    protected $guarded = [
        'REQUEST_TIME_OFF_ID',
    ];

    public $timestamps = false;
}
