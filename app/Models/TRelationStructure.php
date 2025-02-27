<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TRelationStructure extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_STRUCTURE_ID';

    protected $table = 't_relation_structure';

    protected $guarded = [
        'RELATION_STRUCTURE_ID',
    ];

    public $timestamps = false;

    public function toRelation(){
        return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID' , 'RELATION_ORGANIZATION_ID');
    }

    public function grade(){
        return $this->hasOne(RGrade::class, 'GRADE_ID' , 'RELATION_GRADE_ID');
    }

    public function parent()
    {
        return $this->belongsTo(TRelationStructure::class, 'RELATION_STRUCTURE_PARENT_ID');
    }
}
