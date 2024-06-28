<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RRelationLocationType extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_LOCATION_TYPE_ID';

    protected $table = 'r_relation_location_type';

    protected $guarded = [
        'RELATION_LOCATION_TYPE_ID',
    ];

    public $timestamps = false;
}
