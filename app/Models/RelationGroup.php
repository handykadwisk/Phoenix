<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelationGroup extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_GROUP_ID';

    protected $table = 't_relation_group';

    // public $with = ['rGroup'];
    protected $guarded = [
        'RELATION_GROUP_ID',
    ];

    public $timestamps = false;

    public function rGroup()
    {
        return $this->hasMany(Relation::class, 'RELATION_ORGANIZATION_GROUP');
    }
}
