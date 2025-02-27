<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RPersonRelationship extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_RELATIONSHIP_ID';

    protected $table = 'r_person_relationship';

    protected $guarded = [
        'PERSON_RELATIONSHIP_ID',
    ];

    public $timestamps = false;
}
