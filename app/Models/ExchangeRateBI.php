<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExchangeRateBI extends Model
{
    use HasFactory;

    protected $primaryKey = 'EXCHANGE_RATE_BI_ID';

    protected $table = 't_exchange_rate_bi';

    protected $guarded = ['EXCHANGE_RATE_BI_ID'];

    public $timestamps = false;

    protected $with = ['exchange_rate_bi_detail'];

    public function exchange_rate_bi_detail(): HasMany
    {
        return $this->hasMany(ExchangeRateBIDetail::class, 'EXCHANGE_RATE_BI_ID', 'EXCHANGE_RATE_BI_ID');
    }
}