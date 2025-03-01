<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClaimCoverage extends Model
{
    //
    protected $table = 't_claim_coverage';
    protected $guarded = ['CLAIM_COVERAGE_ID'];
    protected $primaryKey = 'CLAIM_COVERAGE_ID';
    public $timestamps = false;

    protected $with = ['coverage', 'insured'];

    public function coverage()
    {
        return $this->belongsTo(MPolicyCoverage::class, 'POLICY_COVERAGE_ID', 'POLICY_COVERAGE_ID');
    }

    public function insured()
    {
        return $this->hasMany(MClaimCoverageInsured::class, 'CLAIM_COVERAGE_ID', 'M_CLAIM_COVERAGE_ID');
    }
    
}
