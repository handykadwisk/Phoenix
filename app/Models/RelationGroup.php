<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelationGroup extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_GROUP_ID';

    protected $table = 't_relation_group';

    public $with = ['rGroup'];

    protected $fillable = [
        'RELATION_GROUP_NAME',
        'RELATION_GROUP_DESCRIPTION',
        'RELATION_GROUP_CREATED_BY',
        'RELATION_GROUP_CREATED_DATE',
        'RELATION_GROUP_UPDATED_BY',
        'RELATION_GROUP_UPDATED_DATE',
        'RELATION_GROUP_PARENT',
        'RELATION_GROUP_ALIAS',
    ];

    public function rGroup()
    {
        return $this->hasMany(Relation::class, 'RELATION_ORGANIZATION_GROUP');
    }
}
