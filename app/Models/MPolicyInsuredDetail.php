<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPolicyInsuredDetail extends Model
{
    use HasFactory;
    protected $primaryKey = 'POLICY_INSURED_DETAIL_ID';
    protected $table = 'm_policy_insured_detail';

    public $timestamps = false;
    public $with = ['interestInsured'];

    protected $guarded = ['POLICY_INSURED_DETAIL_ID'];

    public function interestInsured()
    {
        return $this->hasOne(RInterestInsured::class, 'INTEREST_INSURED_ID', 'INTEREST_INSURED_ID');
    }
}
