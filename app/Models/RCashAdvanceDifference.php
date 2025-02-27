<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RCashAdvanceDifference extends Model
{
    use HasFactory;

    protected $primaryKey = 'CASH_ADVANCE_DIFFERENCE_ID';

    protected $table = 'r_cash_advance_difference';

    protected $guarded = ['CASH_ADVANCE_DIFFERENCE_ID'];

    public $timestamps = false;
}