<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExpensesDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'EXPENSES_DETAIL_ID';

    protected $table = 't_expenses_detail';

    protected $guarded = ['EXPENSES_DETAIL_ID'];

    public $timestamps = false;

    protected $with = ['payment_type','currency','m_expenses_document','relation_organization'];

    public function expenses(): BelongsTo
    {
        return $this->belongsTo(Expenses::class);
    }

    public function payment_type(): BelongsTo
    {
        return $this->belongsTo(RPaymentType::class, 'EXPENSES_DETAIL_TYPE');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(RCurrency::class, 'EXPENSES_DETAIL_CURRENCY');
    }

    public function m_expenses_document(): HasMany
    {
        return $this->hasMany(MExpensesDocument::class, 'EXPENSES_DOCUMENT_EXPENSES_DETAIL_ID');
    }

    public function relation_organization(): BelongsTo
    {
        return $this->belongsTo(Relation::class, 'EXPENSES_DETAIL_RELATION_ORGANIZATION_ID');
    }
}