<?php

namespace App\Models;

use App\Models\Relation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MRelationType extends Model
{
    use HasFactory;

    protected $table = 'm_relation_type';

    public $timestamps = false;

    public $fillable = [
        'RELATION_ORGANIZATION_ID',
        'RELATION_TYPE_ID'
    ];

    public function relation()
    {
        return $this->hasMany(Relation::class, 'RELATION_ORGANIZATION_ID');
    }
}
