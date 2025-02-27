<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TClaim extends Model
{
    //
    protected $table = 't_claim';
    protected $guarded = ['CLAIM_ID'];
    protected $primaryKey = 'CLAIM_ID';
    public $timetamps = false;
}
