<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RCashAdvanceApproval extends Model
{
    use HasFactory;

    protected $primaryKey = 'CASH_ADVANCE_APPROVAL_ID';

    protected $table = 'r_cash_advance_approval';

    protected $guarded = ['CASH_ADVANCE_APPROVAL_ID'];
}