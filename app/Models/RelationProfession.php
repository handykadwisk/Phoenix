<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelationProfession extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_PROFESSION_ID';

    protected $table = 'r_profession';

    protected $fillable = [
        'RELATION_PROFESSION_NAME',
        'RELATION_PROFESSION_DESC',
    ];

    public $timestamps = false;
}
