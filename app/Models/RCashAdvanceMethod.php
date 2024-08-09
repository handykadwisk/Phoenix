<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RCashAdvanceMethod extends Model
{
    use HasFactory;

    protected $primaryKey = 'CASH_ADVANCE_METHOD_ID';

    protected $table = 'r_cash_advance_method';

    protected $guarded = ['CASH_ADVANCE_METHOD_ID'];

    public $timestamps = false;
}