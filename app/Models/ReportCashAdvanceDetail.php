<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportCashAdvanceDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'REPORT_CASH_ADVANCE_DETAIL_ID';

    protected $table = 't_report_cash_advance_detail';

    protected $guarded = ['REPORT_CASH_ADVANCE_DETAIL_ID'];
}