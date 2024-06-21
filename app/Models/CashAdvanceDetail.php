<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CashAdvanceDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'EXPENSES_DETAIL_ID';

    protected $table = 't_cash_advance_detail';

    protected $guarded = ['EXPENSES_DETAIL_ID'];

    public function cash_advance(): BelongsTo
    {
        return $this->belongsTo(CashAdvance::class);
    }
}