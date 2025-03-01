<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MClaimCoverageInsured extends Model
{
    //
    protected $table = 'm_claim_coverage_insured';
    protected $guarded = ['CLAIM_COVERAGE_INSURED_ID'];
    protected $primaryKey = 'CLAIM_COVERAGE_INSURED_ID';
    public $timestamps = false;

    protected $with = ['claimCoverage'];

    public function claimCoverage()
    {
        return $this->belongsTo(MPolicyCoverageDetail::class,  'POLICY_COVERAGE_DETAIL_ID');
    }
}
