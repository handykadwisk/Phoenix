<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MExpensesProofOfDocument extends Model
{
    use HasFactory;

    protected $primaryKey = 'EXPENSES_PROOF_OF_DOCUMENT_ID';

    protected $table = 'm_expenses_proof_of_document';

    protected $guarded = ['EXPENSES_PROOF_OF_DOCUMENT_ID'];

    public $timestamps = false;

    protected $with = [
        'document'
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'EXPENSES_PROOF_OF_DOCUMENT_EXPENSES_DOCUMENT_ID');
    }
}