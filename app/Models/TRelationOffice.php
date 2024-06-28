<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TRelationOffice extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_OFFICE_ID';

    protected $table = 't_relation_office';

    protected $guarded = [
        'RELATION_OFFICE_ID',
    ];

    public $timestamps = false;

    public function toRelation(){
        return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID' , 'RELATION_ORGANIZATION_ID');
    }
    public function parent()
    {
        return $this->belongsTo(TRelationOffice::class, 'RELATION_OFFICE_PARENT_ID');
    }

    public function mLocationType(){
        return $this->hasMany(MRelationOfficeLocationType::class, 'RELATION_OFFICE_ID');
    } 
}
