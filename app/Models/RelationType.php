<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelationType extends Model
{
    use HasFactory;

    protected $primaryKey = 'relation_type_id';

    protected $table = 'r_relation_type';

    public $timestamps = false;
}
