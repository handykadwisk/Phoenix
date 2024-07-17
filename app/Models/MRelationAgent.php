<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MRelationAgent extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_RELATION_AGENT_ID';

    protected $table = 'm_relation_agents';

    public $timestamps = false;

    public $guarded = [
        'M_RELATION_AGENT_ID'
    ];

    public function relation()
    {
        return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }
}
