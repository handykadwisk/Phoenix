<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Relation extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_ORGANIZATION_ID';

    protected $table = 't_relation';

    public $with = ['mTagging','mRelationType','mRelationAka', 'children'];

    protected $guarded = [
        'RELATION_ORGANIZATION_ID',
    ];

    public $timestamps = false;

    public function mTagging(){
        return $this->hasMany(MTag::class, 'RELATION_ORGANIZATION_ID');
    }

    public function mRelationType()
    {
        return $this->hasMany(MRelationType::class, 'RELATION_ORGANIZATION_ID');
    }

    public function mRelationAka(){
        return $this->hasMany(MRelationAka::class, 'RELATION_ORGANIZATION_ID');
    }

    public function children() {
        return $this->hasMany(Relation::class, 'RELATION_ORGANIZATION_PARENT_ID');
    }

    public function groupRelation(){
        return $this->hasMany(RelationGroup::class, 'RELATION_GROUP_ID', 'RELATION_ORGANIZATION_GROUP');
    }

    public function PreSalutation(){
        return $this->hasOne(Salutation::class, 'salutation_id', 'PRE_SALUTATION');
    }

    public function PostSalutation(){
        return $this->hasOne(Salutation::class, 'salutation_id', 'POST_SALUTATION');
    }

    public function MRelationAgent(){
        return $this->hasOne(MRelationAgent::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }

    public function MRelationBaa(){
        return $this->hasOne(MRelationBaa::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }
}
