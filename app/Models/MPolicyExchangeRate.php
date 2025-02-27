<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPolicyExchangeRate extends Model
{
    use HasFactory;
    protected $primaryKey = 'POLICY_EXCHANGE_RATE_ID';
    protected $table = 'm_policy_exchange_rate';

    public $timestamps = false;
    // public $with = ['currency'];

    protected $guarded = ['POLICY_EXCHANGE_RATE_ID'];

    // public function currency() {
    //     return $this->hasOne(RCurrency::class, 'CURRENCY_ID', 'CURRENCY_ID');
    // }
}
