<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CashAdvance extends Model
{
    use HasFactory;

    protected $primaryKey = 'EXPENSES_ID';

    protected $table = 't_cash_advance';

    protected $guarded = ['EXPENSES_ID'];

    protected $with = [
        'cash_advance_detail',
        'user',
        'user_used_by',
        'user_approval',
        'approval_status'
    ];

    public function cash_advance_detail(): HasMany
    {
        return $this->hasMany(CashAdvanceDetail::class, 'EXPENSES_ID');
    }
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'EXPENSES_REQUESTED_BY');
    }

    public function user_used_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'USED_BY');
    }

    public function user_approval(): BelongsTo
    {
        return $this->belongsTo(User::class, 'FIRST_APPROVAL_BY');
    }

    public function approval_status(): BelongsTo
    {
        return $this->belongsTo(CashAdvanceStatus::class, 'FIRST_APPROVAL_STATUS', 'CA_STATUS_ID');
    }

}