<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reimburse extends Model
{
    use HasFactory;

    protected $primaryKey = 'REIMBURSE_ID';

    protected $table = 't_reimburse';

    protected $guarded = ['REIMBURSE_ID'];

    public $timestamps = false;

    protected $with = [
        'reimburse_detail',
        'm_reimburse_proof_of_document',
        'division',
        'cost_center',
        'office',
        'notes',
        'employee',
        'employee_used_by',
        'employee_approval',
        'approval_status'
    ];

    public function reimburse_detail(): HasMany
    {
        return $this->hasMany(ReimburseDetail::class, 'REIMBURSE_ID');
    }

    public function m_reimburse_proof_of_document(): HasMany
    {
        return $this->hasMany(MReimburseProofOfDocument::class, 'REIMBURSE_PROOF_OF_DOCUMENT_REIMBURSE_ID');
    }

    public function division(): BelongsTo
    {
        return $this->belongsTo(TCompanyDivision::class, 'REIMBURSE_DIVISION');
    }

    public function cost_center(): BelongsTo
    {
        return $this->belongsTo(TCompanyDivision::class, 'REIMBURSE_COST_CENTER');
    }

    public function office(): BelongsTo
    {
        return $this->belongsTo(TCompanyOffice::class, 'REIMBURSE_BRANCH');
    }

    public function notes(): BelongsTo
    {
        return $this->belongsTo(RReimburseNotes::class, 'REIMBURSE_TYPE');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(TEmployee::class, 'REIMBURSE_REQUESTED_BY');
    }

    public function employee_used_by(): BelongsTo
    {
        return $this->belongsTo(TEmployee::class, 'REIMBURSE_USED_BY');
    }

    public function employee_approval(): BelongsTo
    {
        return $this->belongsTo(TEmployee::class, 'REIMBURSE_FIRST_APPROVAL_BY');
    }

    public function approval_status(): BelongsTo
    {
        return $this->belongsTo(CashAdvanceStatus::class, 'REIMBURSE_FIRST_APPROVAL_STATUS', 'CASH_ADVANCE_STATUS_ID');
    }
}