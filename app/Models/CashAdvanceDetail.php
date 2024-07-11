<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CashAdvanceDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'CASH_ADVANCE_DETAIL_ID';

    protected $table = 't_cash_advance_detail';

    protected $guarded = ['CASH_ADVANCE_DETAIL_ID'];

    protected $with = ['document'];

    public function cash_advance(): BelongsTo
    {
        return $this->belongsTo(CashAdvance::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'CASH_ADVANCE_DETAIL_DOCUMENT_ID');
    }
}