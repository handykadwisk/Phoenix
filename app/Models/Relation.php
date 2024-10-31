<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Relation extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_ORGANIZATION_ID';

    protected $table = 't_relation';

    public $with = ['mTagging', 'mRelationType', 'mRelationAka', 'children', 'MBankRelation'];

    protected $guarded = [
        'RELATION_ORGANIZATION_ID',
    ];

    public $timestamps = false;

    public function mTagging()
    {
        return $this->hasMany(MTag::class, 'RELATION_ORGANIZATION_ID');
    }

    public function mRelationType()
    {
        return $this->hasMany(MRelationType::class, 'RELATION_ORGANIZATION_ID');
    }

    public function mRelationAka()
    {
        return $this->hasMany(MRelationAka::class, 'RELATION_ORGANIZATION_ID');
    }

    public function children()
    {
        return $this->hasMany(Relation::class, 'RELATION_ORGANIZATION_PARENT_ID');
    }

    public function groupRelation()
    {
        return $this->hasOne(RelationGroup::class, 'RELATION_GROUP_ID', 'RELATION_ORGANIZATION_GROUP');
    }

    public function PreSalutation()
    {
        return $this->hasOne(Salutation::class, 'salutation_id', 'PRE_SALUTATION');
    }

    public function PostSalutation()
    {
        return $this->hasOne(Salutation::class, 'salutation_id', 'POST_SALUTATION');
    }

    public function MRelationAgent()
    {
        return $this->hasOne(MRelationAgent::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }

    public function MRelationBaa()
    {
        return $this->hasOne(MRelationBaa::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }

    public function MRelationFbi()
    {
        return $this->hasOne(MRelationFBIPKS::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }

    public function TPerson()
    {
        return $this->hasOne(TPerson::class, 'INDIVIDU_RELATION_ID', 'RELATION_ORGANIZATION_ID');
    }

    public function MBankRelation()
    {
        return $this->hasMany(MBankAccountRelation::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }

    public function pksNumber()
    {
        return $this->hasMany(MPksRelation::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }

    public function mRelationPic()
    {
        return $this->hasMany(MRelationPic::class, 'PERSON_ID', 'RELATION_ORGANIZATION_ID');
    }
}
