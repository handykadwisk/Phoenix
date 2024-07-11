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
        'user',
        'user_used_by',
        'user_approval',
        'approval_status'
    ];

    public function reimburse_detail(): HasMany
    {
        return $this->hasMany(ReimburseDetail::class, 'REIMBURSE_ID');
    }
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'REIMBURSE_REQUESTED_BY');
    }

    public function user_used_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'REIMBURSE_USED_BY');
    }

    public function user_approval(): BelongsTo
    {
        return $this->belongsTo(User::class, 'REIMBURSE_FIRST_APPROVAL_BY');
    }

    public function approval_status(): BelongsTo
    {
        return $this->belongsTo(CashAdvanceStatus::class, 'REIMBURSE_FIRST_APPROVAL_STATUS', 'CA_STATUS_ID');
    }
}
