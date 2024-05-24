<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Relation extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_ORGANIZATION_ID';

    protected $table = 't_relation';

    public $with = ['mRelationType', 'children'];

    protected $fillable = [
        'RELATION_ORGANIZATION_NAME',
        'RELATION_ORGANIZATION_PARENT_ID',
        'RELATION_ORGANIZATION_ABBREVIATION',
        'RELATION_ORGANIZATION_AKA',
        'RELATION_ORGANIZATION_GROUP',
        'RELATION_ORGANIZATION_CREATED_BY',
        'RELATION_ORGANIZATION_CREATED_DATE',
        'RELATION_ORGANIZATION_UPDATED_BY',
        'RELATION_ORGANIZATION_UPDATED_DATE',
        'RELATION_ORGANIZATION_DESCRIPTION',
        'RELATION_ORGANIZATION_ALIAS',
        'RELATION_ORGANIZATION_EMAIL',
        'RELATION_ORGANIZATION_MAPPING',
        'HR_MANAGED_BY_APP',
        'RELATION_ORGANIZATION_LOGO_ID',
        'RELATION_ORGANIZATION_SIGNATURE_NAME',
        'RELATION_ORGANIZATION_SIGNATURE_TITLE',
        'RELATION_ORGANIZATION_BANK_ACCOUNT_NUMBER',
        'RELATION_ORGANIZATION_BANK_ACCOUNT_NAME',
        'RELATION_PROFESSION_ID',
        'RELATION_LOB_ID',
        'salutation_id',
        'relation_status_id',
        'is_deleted'
    ];

    public $timestamps = false;

    public function mRelationType()
    {
        return $this->hasMany(MRelationType::class, 'RELATION_ORGANIZATION_ID');
    }

    public function children() {
        return $this->hasMany(Relation::class, 'RELATION_ORGANIZATION_PARENT_ID');
    }
}
