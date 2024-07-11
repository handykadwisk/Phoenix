<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OtherExpensesDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'OTHER_EXPENSES_DETAIL_ID';

    protected $table = 't_other_expenses_detail';

    protected $guarded = ['OTHER_EXPENSES_DETAIL_ID'];

    protected $with = ['document'];

    public function other_expenses(): BelongsTo
    {
        return $this->belongsTo(Reimburse::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'OTHER_EXPENSES_DETAIL_DOCUMENT_ID');
    }
}
