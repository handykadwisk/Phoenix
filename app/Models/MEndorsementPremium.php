<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MEndorsementPremium extends Model
{
    use HasFactory;

    protected $primaryKey = 'ENDORSEMENT_PREMIUM_ID';
    protected $table = 'm_endorsement_premium';
    protected $guarded = ['ENDORSEMENT_PREMIUM_ID'];

    public $timestamps = false;
    public $with = ['currency'];

    public function currency() {
        return $this->hasOne(RCurrency::class, 'CURRENCY_ID', 'CURRENCY_ID');
    }
}
