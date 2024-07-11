<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OtherExpenses extends Model
{
    use HasFactory;

    protected $primaryKey = 'OTHER_EXPENSES_ID';

    protected $table = 't_other_expenses';

    protected $guarded = ['OTHER_EXPENSES_ID'];

    public $timestamps = false;

    protected $with = [
        'other_expenses_detail',
        'user',
        'user_used_by',
        'user_approval',
        'approval_status'
    ];

    public function other_expenses_detail(): HasMany
    {
        return $this->hasMany(OtherExpensesDetail::class, 'OTHER_EXPENSES_ID');
    }
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'OTHER_EXPENSES_REQUESTED_BY');
    }

    public function user_used_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'OTHER_EXPENSES_USED_BY');
    }

    public function user_approval(): BelongsTo
    {
        return $this->belongsTo(User::class, 'OTHER_EXPENSES_FIRST_APPROVAL_BY');
    }

    public function approval_status(): BelongsTo
    {
        return $this->belongsTo(CashAdvanceStatus::class, 'OTHER_EXPENSES_FIRST_APPROVAL_STATUS', 'CA_STATUS_ID');
    }
}
