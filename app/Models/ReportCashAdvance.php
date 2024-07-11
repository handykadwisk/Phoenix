<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportCashAdvance extends Model
{
    use HasFactory;

    protected $primaryKey = 'REPORT_CASH_ADVANCE_ID';

    protected $table = 't_report_cash_advance';

    protected $guarded = ['REPORT_CASH_ADVANCE_ID'];

    public $timestamps = false;
}