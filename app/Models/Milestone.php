<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Milestone extends Model
{
    //
    protected $table = 'r_milestone';

    protected $guarded = ['MILESTONE_ID'];

    protected $primaryKey = 'MILESTONE_ID';

    public $timestamps = false;

    protected $with = ['duration', 'children'];

    //define relationship with duration
    public function duration()
    {
        return $this->belongsTo(RDuration::class, 'DURATION_ID', 'DURATION_ID');
    }

    public function children()
    {
        return $this->hasMany(Milestone::class, 'MILESTONE_PARENT_ID', 'MILESTONE_ID')
            ->orderBy('MILESTONE_SEQUENCE', 'asc')
            ->where('MILESTONE_IS_DELETED', 0);
    }
    //parent
    public function parent()
    {
        return $this->belongsTo(Milestone::class, 'MILESTONE_PARENT_ID', 'MILESTONE_ID')
            ->orderBy('MILESTONE_SEQUENCE', 'asc')
            ->where('MILESTONE_IS_DELETED', 0);
    }
}
