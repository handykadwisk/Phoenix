<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPolicyCoverage extends Model
{
    use HasFactory;
    protected $primaryKey = 'POLICY_COVERAGE_ID';
    protected $table = 'm_policy_coverage';
    protected $guarded = ['POLICY_COVERAGE_ID'];
    public $timestamps = false;

    public $with = ['policyCoverageDetail'];


    public function policyCoverageDetail()
    {
        return $this->hasMany(MPolicyCoverageDetail::class, 'POLICY_COVERAGE_ID', 'POLICY_COVERAGE_ID');
    }
}
