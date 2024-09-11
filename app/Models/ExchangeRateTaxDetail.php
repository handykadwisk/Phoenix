<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExchangeRateTaxDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'EXCHANGE_RATE_TAX_DETAIL_ID';

    protected $table = 't_exchange_rate_tax_detail';

    protected $guarded = ['EXCHANGE_RATE_TAX_DETAIL_ID'];

    public $timestamps = false;

    protected $with = ['currency'];

    public function currency(): BelongsTo
    {
        return $this->belongsTo(RCurrency::class, 'EXCHANGE_RATE_TAX_DETAIL_CURRENCY_ID');
    }
}