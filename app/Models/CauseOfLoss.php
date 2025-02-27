<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CauseOfLoss extends Model
{
    //
    protected $table = 'r_cause_of_loss';
    protected $guarded = ['CAUSE_OF_LOSS_ID'];
    protected $primaryKey = 'CAUSE_OF_LOSS_ID';
    public $timestamps = false;
}
