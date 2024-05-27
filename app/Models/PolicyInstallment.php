<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PolicyInstallment extends Model
{
    use HasFactory;

    protected $primaryKey = 'POLICY_INSTALLMENT_ID';

    protected $table = 't_policy_installment';

    public $timestamps = false;
    // public $with = ['policyInitialPremium','insuranceType', 'relation'];

    protected $fillable = [
        'POLICY_INSTALLMENT_ID',
        'POLICY_ID',
        'POLICY_INSTALLMENT_TERM',
        'POLICY_INSTALLMENT_PERCENTAGE',
        'INSTALLMENT_DUE_DATE',
        'POLICY_INSTALLMENT_AMOUNT'
    ];
}
