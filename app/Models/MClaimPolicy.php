<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MClaimPolicy extends Model
{
    //
    protected $table = 'm_claim_policy';
    protected $guarded = ['M_CLAIM_POLICY_ID'];
    protected $primaryKey = 'M_CLAIM_POLICY_ID';
    public $timestamps = false;

    protected $with = ['policy', 'cause_of_loss'];
    // protected $fillable = ['POLICY_ID', 'CLAIM_ID', 'NOTE', 'CAUSE_OF_LOSS_ID', 'NOTE_CAUSE_OF_LOSS'];

    public function policy()
    {
        return $this->hasMany(Policy::class, 'POLICY_ID', 'POLICY_ID');
    }

    public function cause_of_loss()
    {
        return $this->hasMany(CauseOfLoss::class, 'CAUSE_OF_LOSS_ID', 'CAUSE_OF_LOSS_ID');
    }
}
