<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPolicyInitialPremium extends Model
{
    use HasFactory;
    protected $primaryKey = 'POLICY_INITIAL_PREMIUM_ID';
    protected $table = 'm_policy_initial_premium';

    public $timestamps = false;
    // public $with = ['policy'];

    protected $fillable = [
        'POLICY_INITIAL_PREMIUM_ID',
        'POLICY_ID',
        'CURRENCY_ID',
        'SUM_INSURED',
        'RATE',
        'INITIAL_PREMIUM',
        'INSTALLMENT',
        'CREATED_BY',
        'CREATED_DATE',
        'UPDATED_BY',
        'UPDATED_DATE'
    ];

    // public function currency() {
    //     return $this->hasOne(RCurrency::class, 'CURRENCY_ID', 'CURRENCY_ID');
    // }

    // public function policy() {
    //     return $this->belongsTo(Policy::class, 'POLICY_ID', 'POLICY_ID');
    // }

    // public function relation() {
    //     return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ID');
    // }

}
