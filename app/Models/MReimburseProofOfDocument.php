<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MReimburseProofOfDocument extends Model
{
    use HasFactory;

    protected $primaryKey = 'REIMBURSE_PROOF_OF_DOCUMENT_ID';

    protected $table = 'm_reimburse_proof_of_document';

    protected $guarded = ['REIMBURSE_PROOF_OF_DOCUMENT_ID'];

    public $timestamps = false;

    protected $with = [
        'document'
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'REIMBURSE_PROOF_OF_DOCUMENT_REIMBURSE_DOCUMENT_ID');
    }
}