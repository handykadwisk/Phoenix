<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MRelationAka extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_AKA_ID';

    protected $table = 'm_relation_aka';

    public $timestamps = false;

    public $guarded = [
        'RELATION_AKA_ID'
    ];
}
