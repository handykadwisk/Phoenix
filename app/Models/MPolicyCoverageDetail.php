<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPolicyCoverageDetail extends Model
{
    use HasFactory;
    protected $primaryKey = 'POLICY_COVERAGE_DETAIL_ID';
    protected $table = 'm_policy_coverage_detail';

    public $timestamps = false;
    public $with = ['currency', 'interestInsured'];

    protected $guarded = ['POLICY_COVERAGE_DETAIL_ID'];

    public function currency() {
        return $this->hasOne(RCurrency::class, 'CURRENCY_ID', 'CURRENCY_ID');
    }
    public function interestInsured() {
        return $this->hasOne(RInterestInsured::class, 'INTEREST_INSURED_ID', 'INTEREST_INSURED_ID');
    }

}
