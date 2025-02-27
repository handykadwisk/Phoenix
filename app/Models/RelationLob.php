<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelationLob extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_LOB_ID';

    protected $table = 'r_relation_lob';

    protected $fillable = [
        'RELATION_LOB_NAME',
        'RELATION_LOB_DESC',
    ];

    public $timestamps = false;
}
