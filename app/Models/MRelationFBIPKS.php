<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MRelationFBIPKS extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_RELATION_FBI_ID';

    protected $table = 'm_relation_fbi';

    public $timestamps = false;

    public $guarded = [
        'M_RELATION_FBI_ID'
    ];

    public function relation()
    {
        return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }
}
