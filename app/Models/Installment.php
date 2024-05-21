<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Installment extends Model
{
    use HasFactory;
    
     protected $primaryKey = 'IP_ID';

    protected $table = 't_installment';

    public $timestamps = false;

    // untuk relationship
    // public $with = ['policyInitialPremium','insuranceType', 'relation'];

    protected $fillable = [
        'INSTALLMENT_ID',
        'INSURANCE_PANEL_ID',
        'INSTALLMENT_TERM',
        'INSTALLMENT_PERCENTAGE',
        'INSTALLMENT_DUE_DATE',
        'INSTALLMENT_AR',
        'INSTALLMENT_AP',
        'INSTALLMENT_GROSS_BF',
        'INSTALLMENT_VAT',
        'INSTALLMENT_PPH_23',
        'INSTALLMENT_NET_BF',
        'INSTALLMENT_ADMIN_COST',
        'INSTALLMENT_POLICY_COST'
    ];

}
