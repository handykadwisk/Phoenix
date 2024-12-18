<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Expenses extends Model
{
    use HasFactory;

    protected $primaryKey = 'EXPENSES_ID';

    protected $table = 't_expenses';

    protected $guarded = ['EXPENSES_ID'];

    public $timestamps = false;

    protected $with = [
        'expenses_detail',
        'm_expenses_proof_of_document',
        'division',
        'cost_center',
        'office',
        'notes',
        'employee',
        'employee_used_by',
        'employee_approval',
        'approval_status'
    ];

    public function expenses_detail(): HasMany
    {
        return $this->hasMany(ExpensesDetail::class, 'EXPENSES_ID');
    }

    public function m_expenses_proof_of_document(): HasMany
    {
        return $this->hasMany(MExpensesProofOfDocument::class, 'EXPENSES_PROOF_OF_DOCUMENT_EXPENSES_ID');
    }

    public function division(): BelongsTo
    {
        return $this->belongsTo(TCompanyDivision::class, 'EXPENSES_DIVISION');
    }

    public function cost_center(): BelongsTo
    {
        return $this->belongsTo(TCompanyDivision::class, 'EXPENSES_COST_CENTER');
    }

    public function office(): BelongsTo
    {
        return $this->belongsTo(TCompanyOffice::class, 'EXPENSES_BRANCH');
    }

    public function notes(): BelongsTo
    {
        return $this->belongsTo(RReimburseNotes::class, 'EXPENSES_TYPE');
    }
    
    public function employee(): BelongsTo
    {
        return $this->belongsTo(TEmployee::class, 'EXPENSES_REQUESTED_BY');
    }

    public function employee_used_by(): BelongsTo
    {
        return $this->belongsTo(TEmployee::class, 'EXPENSES_USED_BY');
    }

    public function employee_approval(): BelongsTo
    {
        return $this->belongsTo(TEmployee::class, 'EXPENSES_FIRST_APPROVAL_BY');
    }
    
    public function approval_status(): BelongsTo
    {
        return $this->belongsTo(CashAdvanceStatus::class, 'EXPENSES_FIRST_APPROVAL_STATUS', 'CASH_ADVANCE_STATUS_ID');
    }
}