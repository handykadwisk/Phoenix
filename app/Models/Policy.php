<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    use HasFactory;

    protected $primaryKey = 'relation_id';

    protected $table = 't_relation';

    public $timestamps = false;

    protected $fillable = [
        'POLICY_ID',
        'RELATION_ID',
        'POLICY_NUMBER',
        'INSURANCE_TYPE_ID',
        'POLICY_THE_INSURED',
        'POLICY_INCEPTION_DATE',
        'POLICY_DUE_DATE',
        'POLICY_STATUS_ID',
        'POLICY_INSURANCE_PANEL',
        'POLICY_SHARE',
        'POLICY_CREATED_BY',
        'POLICY_CREATED_DATE',
        'POLICY_UPDATED_BY',
        'POLICY_UPDATED_DATE'
    ];
    
}
