<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TRelationAgent extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_AGENT_ID';

    protected $table = 't_relation_agent';

    protected $guarded = [
        'RELATION_AGENT_ID',
    ];

    public $timestamps = false;
}
