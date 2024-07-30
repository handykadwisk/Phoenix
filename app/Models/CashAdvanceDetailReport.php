<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CashAdvanceDetailReport extends Model
{
    use HasFactory;

    protected $primaryKey = 'REPORT_CASH_ADVANCE_DETAIL_ID';

    protected $table = 't_report_cash_advance_detail';

    protected $guarded = ['REPORT_CASH_ADVANCE_DETAIL_ID'];

    protected $with = [
        'document', 
        'purpose',
        'cost_classification'
    ];

    public function cash_advance_report(): BelongsTo
    {
        return $this->belongsTo(CashAdvanceReport::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'REPORT_CASH_ADVANCE_DETAIL_DOCUMENT_ID');
    }

    public function purpose(): BelongsTo
    {
        return $this->belongsTo(CashAdvancePurpose::class, 'REPORT_CASH_ADVANCE_DETAIL_PURPOSE');
    }

    public function cost_classification()
    {
        return $this->belongsTo(CashAdvanceCostClassification::class, 'REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION');
    }
}
