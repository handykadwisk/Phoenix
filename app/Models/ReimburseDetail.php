<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReimburseDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'REIMBURSE_DETAIL_ID';

    protected $table = 't_reimburse_detail';

    protected $guarded = ['REIMBURSE_DETAIL_ID'];

    protected $with = ['m_reimburse_document','relation_organization'];

    public function reimburse(): BelongsTo
    {
        return $this->belongsTo(Reimburse::class);
    }

    public function m_reimburse_document(): HasMany
    {
        return $this->hasMany(MReimburseDocument::class, 'REIMBURSE_DOCUMENT_REIMBURSE_DETAIL_ID');
    }

    public function relation_organization(): BelongsTo
    {
        return $this->belongsTo(Relation::class, 'REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID');
    }
}