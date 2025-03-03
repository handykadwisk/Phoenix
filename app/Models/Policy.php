<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\MPolicyPremium;
use App\Models\PolicyInstallment;

class Policy extends Model
{
    use HasFactory;

    protected $primaryKey = 'policy_id';

    protected $table = 't_policy';

    public $timestamps = false;
    public $with = ['policyPremium', 'policyInstallment', 'insuranceType', 'relation', 'policyCoverage'];

    // protected $fillable = [
    //     'POLICY_ID',
    //     'RELATION_ID',
    //     'POLICY_NUMBER',
    //     'INSURANCE_TYPE_ID',
    //     'POLICY_THE_INSURED',
    //     'POLICY_INCEPTION_DATE',
    //     'POLICY_DUE_DATE',
    //     'POLICY_STATUS_ID',
    //     'POLICY_INSURANCE_PANEL',
    //     'POLICY_SHARE',
    //     'POLICY_CREATED_BY',
    //     'POLICY_CREATED_DATE',
    //     'POLICY_UPDATED_BY',
    //     'POLICY_UPDATED_DATE',
    //     'POLICY_INSTALLMENT'
    // ];
    protected $guarded = ['POLICY_ID'];


    public function policyPremium()
    {
        return $this->hasMany(MPolicyPremium::class, 'POLICY_ID', 'POLICY_ID');
    }

    public function policyInstallment()
    {
        return $this->hasMany(PolicyInstallment::class, 'POLICY_ID', 'POLICY_ID');
    }

    public function insuranceType()
    {
        return $this->hasOne(RInsuranceType::class, 'INSURANCE_TYPE_ID', 'INSURANCE_TYPE_ID');
    }

    public function relation()
    {
        return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ID');
    }

    public function policyCoverage()
    {
        return $this->hasMany(MPolicyCoverage::class, 'POLICY_ID', 'POLICY_ID');
    }
}
