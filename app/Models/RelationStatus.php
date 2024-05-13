<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RelationStatus extends Model
{
    use HasFactory;

    protected $primaryKey = 'relation_status_id';

    protected $table = 'r_relation_status';

    protected $fillable = [
        'relation_status_name',
    ];

    public $timestamps = false;
}
