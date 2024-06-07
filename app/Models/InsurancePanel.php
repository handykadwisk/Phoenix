<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InsurancePanel extends Model
{
    use HasFactory;

    protected $primaryKey = 'IP_ID';

    protected $table = 't_insurance_panel';

    public $timestamps = false;
    public $with = ['installment', 'insurance', 'currency', 'policy'];

    protected $fillable = [
        'IP_ID',
        'POLICY_ID',
        'POLICY_INITIAL_PREMIUM_ID',
        'IP_PREMIUM_TYPE',
        'INSURANCE_ID',
        'IP_POLICY_LEADER',
        'IP_CURRENCY_ID',
        'IP_TERM',
        'IP_POLICY_INITIAL_PREMIUM',
        'IP_POLICY_SHARE',
        'IP_DISC_INSURANCE',
        'IP_PIP_AFTER_DISC',
        'IP_POLICY_BF',
        'IP_BF_AMOUNT',
        'IP_VAT',
        'IP_PPH_23',
        'IP_NET_BF',
        'IP_PAYMENT_METHOD',
        'IP_VAT_AMOUNT',
        'IP_CREATED_BY',
        'IP_CREATED_DATE',
        'IP_UPDATED_BY',
        'IP_UPDATED_DATE'
    ];

    public function installment() {
        return $this->hasMany(Installment::class, 'INSURANCE_PANEL_ID', 'IP_ID');
    }

    public function insurance() {
        return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID', 'INSURANCE_ID');
    }

    public function currency() {
        return $this->hasOne(RCurrency::class, 'CURRENCY_ID', 'IP_CURRENCY_ID');
    }

    public function policy() {
        return $this->hasOne(Policy::class, 'POLICY_ID', 'POLICY_ID');
    }

    // public function insuranceType() {
    //     return $this->hasOne(RInsuranceType::class, 'INSURANCE_TYPE_ID', 'INSURANCE_TYPE_ID');
    // }

    // public function relation() {
    //     return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ID');
    // }
}
