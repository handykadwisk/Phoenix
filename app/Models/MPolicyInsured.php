<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPolicyInsured extends Model
{
    use HasFactory;
    protected $primaryKey = 'POLICY_INSURED_ID';
    protected $table = 'm_policy_insured';

    public $timestamps = false;
    public $with = ['policyInsuredDetail'];

    protected $guarded = ['POLICY_INSURED_ID'];

    public function policyInsuredDetail() {
        return $this->hasMany(MPolicyInsuredDetail::class, 'POLICY_INSURED_ID', 'POLICY_INSURED_ID');
    }
}
