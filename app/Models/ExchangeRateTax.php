<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExchangeRateTax extends Model
{
    use HasFactory;

    protected $primaryKey = 'EXCHANGE_RATE_TAX_ID';

    protected $table = 't_exchange_rate_tax';

    protected $guarded = ['EXCHANGE_RATE_TAX_ID'];

    public $timestamps = false;

    protected $with = ['exchange_rate_tax_detail'];

    public function exchange_rate_tax_detail(): HasMany
    {
        return $this->hasMany(ExchangeRateTaxDetail::class, 'EXCHANGE_RATE_TAX_ID', 'EXCHANGE_RATE_TAX_ID');
    }
}