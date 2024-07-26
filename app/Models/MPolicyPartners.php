<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPolicyPartners extends Model
{
    use HasFactory;
    protected $primaryKey = 'POLICY_PARTNER_ID';
    protected $table = 'm_policy_partner';

    public $timestamps = false;
    // public $with = ['policyCoverageDetail'];

    protected $guarded = ['POLICY_PARTNER_ID'];

    // public function policyCoverageDetail() {
    //     return $this->hasMany(MPolicyCoverageDetail::class, 'POLICY_COVERAGE_ID', 'POLICY_COVERAGE_ID');
    // }
}
