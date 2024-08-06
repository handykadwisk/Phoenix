<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CashAdvanceReport extends Model
{
    use HasFactory;

    protected $primaryKey = 'REPORT_CASH_ADVANCE_ID';

    protected $table = 't_report_cash_advance';

    protected $guarded = ['REPORT_CASH_ADVANCE_ID'];

    public $timestamps = false;

    protected $with = [
        'cash_advance_detail_report',
        'cash_advance_differents',
        'person',
        'person_used_by',
        'person_approval',
        'user',
        'user_used_by',
        'user_approval',
        'approval_status'
    ];

    public function cash_advance(): BelongsTo
    {
        return $this->belongsTo(CashAdvance::class, 'REPORT_CASH_ADVANCE_CASH_ADVANCE_ID');
    }

    public function cash_advance_detail_report(): HasMany
    {
        return $this->hasMany(CashAdvanceDetailReport::class, 'REPORT_CASH_ADVANCE_ID');
    }

    public function cash_advance_differents(): BelongsTo
    {
        return $this->belongsTo(RCashAdvanceDifferent::class, 'REPORT_CASH_ADVANCE_TYPE');
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(TPerson::class, 'REPORT_CASH_ADVANCE_REQUESTED_BY');
    }

    public function person_used_by(): BelongsTo
    {
        return $this->belongsTo(TPerson::class, 'REPORT_CASH_ADVANCE_USED_BY');
    }

    public function person_approval(): BelongsTo
    {
        return $this->belongsTo(TPerson::class, 'REPORT_CASH_ADVANCE_FIRST_APPROVAL_BY');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'REPORT_CASH_ADVANCE_REQUESTED_BY');
    }

    public function user_used_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'REPORT_CASH_ADVANCE_USED_BY');
    }

    public function user_approval(): BelongsTo
    {
        return $this->belongsTo(User::class, 'REPORT_CASH_ADVANCE_FIRST_APPROVAL_BY');
    }

    public function approval_status(): BelongsTo
    {
        return $this->belongsTo(CashAdvanceStatus::class, 'REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 'CA_STATUS_ID');
    }
}
