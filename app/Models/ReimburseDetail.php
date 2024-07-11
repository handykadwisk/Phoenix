<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReimburseDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'REIMBURSE_DETAIL_ID';

    protected $table = 't_reimburse_detail';

    protected $guarded = ['REIMBURSE_DETAIL_ID'];

    protected $with = ['document'];

    public function reimburse(): BelongsTo
    {
        return $this->belongsTo(Reimburse::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'REIMBURSE_DETAIL_DOCUMENT_ID');
    }
}
