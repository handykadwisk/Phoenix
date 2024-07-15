<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashAdvancePurpose extends Model
{
    use HasFactory;

    protected $primaryKey = 'CASH_ADVANCE_PURPOSE_ID';

    protected $table = 'r_cash_advance_purpose';

    protected $guarded = ['CASH_ADVANCE_PURPOSE_ID'];
}
