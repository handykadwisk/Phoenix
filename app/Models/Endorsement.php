<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Endorsement extends Model
{
    use HasFactory;
    protected $primaryKey = 'ENDORSEMENT_ID';

    protected $table = 't_endorsement';

    public $timestamps = false;
    public $with = ['endorsementPremium', 'endorsementInstallment', 'endorsementType', 'policy'];

    protected $guarded = ['ENDORSEMENT_ID'];

    public function endorsementPremium() {
        return $this->hasMany(MEndorsementPremium::class, 'ENDORSEMENT_ID', 'ENDORSEMENT_ID');
    }

    public function endorsementInstallment() {
        return $this->hasMany(MEndorsementInstallment::class, 'ENDORSEMENT_ID', 'ENDORSEMENT_ID');
    }

    public function endorsementType() {
        return $this->hasOne(REndorsementType::class, 'ENDORSEMENT_TYPE_ID', 'ENDORSEMENT_TYPE_ID');
    }
    
    public function policy() {
        return $this->hasOne(Policy::class, 'POLICY_ID', 'POLICY_ID');
    }
}
