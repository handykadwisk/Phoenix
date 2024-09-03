<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MCashAdvanceProofOfDocument extends Model
{
    use HasFactory;

    protected $primaryKey = 'CASH_ADVANCE_PROOF_OF_DOCUMENT_ID';

    protected $table = 'm_cash_advance_proof_of_document';

    protected $guarded = ['CASH_ADVANCE_PROOF_OF_DOCUMENT_ID'];

    public $timestamps = false;

    protected $with = [
        'document'
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'CASH_ADVANCE_PROOF_OF_DOCUMENT_REPORT_CASH_ADVANCE_DOCUMENT_ID');
    }
}