<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TRelationDivision extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_DIVISION_ID';

    protected $table = 't_relation_division';

    protected $guarded = [
        'RELATION_DIVISION_ID',
    ];

    public $timestamps = false;
}
