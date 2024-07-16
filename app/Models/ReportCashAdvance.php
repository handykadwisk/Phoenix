<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportCashAdvance extends Model
{
    use HasFactory;

    protected $primaryKey = 'REPORT_CASH_ADVANCE_ID';

    protected $table = 't_report_cash_advance';

    protected $guarded = ['REPORT_CASH_ADVANCE_ID'];

    public $timestamps = false;

    protected $with = [
        'cash_advance',
        'approval_status'
    ];

    public function cash_advance(): BelongsTo
    {
        return $this->belongsTo(CashAdvance::class, 'CASH_ADVANCE_ID');
    }

    public function approval_status(): BelongsTo
    {
        return $this->belongsTo(CashAdvanceStatus::class, 'REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 'CA_STATUS_ID');
    }
}