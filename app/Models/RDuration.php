<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RDuration extends Model
{
    //
    protected $table = 'r_duration_type';
    protected $guarded = ['DURATION_ID'];
    public $timestamps = false;
}
