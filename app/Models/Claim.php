<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Claim extends Model
{
    //
    protected $table = 't_claim';
    protected $guarded = ['CLAIM_ID'];
    protected $primaryKey = 'CLAIM_ID';
    public $timestamps = false;

    protected $with = ['workbook', 'relation', 'policy', 'coverage', 'user'];

    // public function causeOfLoss()
    // {
    //     return $this->belongsTo(CauseOfLoss::class, 'CAUSE_OF_LOSS_ID', 'CAUSE_OF_LOSS_ID');
    // }

    public function workbook()
    {
        return $this->belongsTo(WorkBook::class, 'WORKBOOK_ID', 'WORKBOOK_ID');
    }

    public function relation()
    {
        return $this->belongsTo(Relation::class, 'RELATION_ID', 'RELATION_ORGANIZATION_ID');
    }

    public function policy()
    {
        return $this->hasMany(MClaimPolicy::class, 'CLAIM_ID', 'CLAIM_ID');
    }

    public function coverage()
    {
        return $this->hasMany(ClaimCoverage::class, 'CLAIM_ID', 'CLAIM_ID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'CLAIM_CREATED_BY', 'id')
            ->select('id', 'name');
    }
    
}
