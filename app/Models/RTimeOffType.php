<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RTimeOffType extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'TIME_OFF_TYPE_ID';

    protected $table = 'r_time_off_type';

    protected $guarded = [
        'TIME_OFF_TYPE_ID',
    ];

    public $timestamps = false;
}
