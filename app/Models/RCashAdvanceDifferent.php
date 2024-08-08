<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RCashAdvanceDifferent extends Model
{
    use HasFactory;

    protected $primaryKey = 'CASH_ADVANCE_DIFFERENTS_ID';

    protected $table = 'r_cash_advance_differents';

    protected $guarded = ['CASH_ADVANCE_DIFFERENTS_ID'];

    public $timestamps = false;
}
