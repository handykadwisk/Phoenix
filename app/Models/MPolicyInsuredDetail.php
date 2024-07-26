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
    // public $with = ['coverage'];

    protected $guarded = ['POLICY_INSURED_DETAIL_ID'];

    // public function coverage() {
    //     return $this->hasOne(MPolicyCoverage::class, 'COVERAGE_ID', 'COVERAGE_ID');
    // }
}
