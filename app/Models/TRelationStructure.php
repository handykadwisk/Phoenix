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
}
