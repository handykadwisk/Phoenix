<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CashAdvanceDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'CASH_ADVANCE_DETAIL_ID';

    protected $table = 't_cash_advance_detail';

    protected $guarded = ['CASH_ADVANCE_DETAIL_ID'];

    protected $with = [
        'm_cash_advance_document',
        'document',
        'purpose',
        'relation_organization'
    ];

    public function cash_advance(): BelongsTo
    {
        return $this->belongsTo(CashAdvance::class);
    }

    public function m_cash_advance_document(): HasMany
    {
        return $this->hasMany(MCashAdvanceDocument::class, 'CASH_ADVANCE_DOCUMENT_CASH_ADVANCE_DETAIL_ID');
    }

    public function relation_organization(): BelongsTo
    {
        return $this->belongsTo(Relation::class, 'CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID');
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'CASH_ADVANCE_DETAIL_DOCUMENT_ID');
    }

    public function purpose(): BelongsTo
    {
        return $this->belongsTo(CashAdvancePurpose::class, 'CASH_ADVANCE_DETAIL_PURPOSE');
    }
}