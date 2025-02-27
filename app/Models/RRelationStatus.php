<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RRelationStatus extends Model
{
    use HasFactory;

    protected $primaryKey = 'relation_status_id';

    protected $table = 'r_relation_status';

    protected $guarded = [
        'relation_status_id',
    ];

    public $timestamps = false;
}
