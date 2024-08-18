<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CashAdvance extends Model
{
    use HasFactory;

    protected $primaryKey = 'CASH_ADVANCE_ID';

    protected $table = 't_cash_advance';

    protected $guarded = ['CASH_ADVANCE_ID'];

    public $timestamps = false;

    protected $with = [
        'cash_advance_detail',
        'cost_center',
        'office',
        'user',
        'person',
        'person_used_by',
        'person_approval',
        'user_used_by',
        'user_approval',
        'approval_status'
    ];

    public function cash_advance_report()
    {
        return $this->hasOne(CashAdvanceReport::class, 'REPORT_CASH_ADVANCE_CASH_ADVANCE_ID');
    }

    public function cash_advance_detail(): HasMany
    {
        return $this->hasMany(CashAdvanceDetail::class, 'CASH_ADVANCE_ID');
    }

    public function cost_center(): BelongsTo
    {
        return $this->belongsTo(TRelationDivision::class, 'CASH_ADVANCE_COST_CENTER');
    }

    public function office(): BelongsTo
    {
        return $this->belongsTo(TRelationOffice::class, 'CASH_ADVANCE_BRANCH');
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(TPerson::class, 'CASH_ADVANCE_REQUESTED_BY');
    }

    public function person_used_by(): BelongsTo
    {
        return $this->belongsTo(TPerson::class, 'CASH_ADVANCE_USED_BY');
    }

    public function person_approval(): BelongsTo
    {
        return $this->belongsTo(TPerson::class, 'CASH_ADVANCE_FIRST_APPROVAL_BY');
    }
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'CASH_ADVANCE_REQUESTED_BY');
    }

    public function user_used_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'CASH_ADVANCE_USED_BY');
    }

    public function user_approval(): BelongsTo
    {
        return $this->belongsTo(User::class, 'CASH_ADVANCE_FIRST_APPROVAL_BY');
    }

    public function approval_status(): BelongsTo
    {
        return $this->belongsTo(CashAdvanceStatus::class, 'CASH_ADVANCE_FIRST_APPROVAL_STATUS', 'CASH_ADVANCE_STATUS_ID');
    }
}