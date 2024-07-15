<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPolicyCoverage extends Model
{
    use HasFactory;
    protected $primaryKey = 'POLICY_COVERAGE_ID';
    protected $table = 'm_policy_coverage';

    public $timestamps = false;
    // public $with = ['currency'];

    protected $guarded = ['POLICY_COVERAGE_ID'];

    // public function currency() {
    //     return $this->hasOne(RCurrency::class, 'CURRENCY_ID', 'CURRENCY_ID');
    // }
}
