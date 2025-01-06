<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MExpensesDocument extends Model
{
    use HasFactory;

    protected $primaryKey = 'EXPENSES_DOCUMENT_ID';

    protected $table = 'm_expenses_document';

    protected $guarded = ['EXPENSES_DOCUMENT_ID'];

    public $timestamps = false;

    protected $with = ['document'];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'EXPENSES_DOCUMENT_EXPENSES_DETAIL_DOCUMENT_ID');
    }
}