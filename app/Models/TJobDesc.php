<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TJobDesc extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_JOBDESC_ID';

    protected $table = 't_job_desc';

    protected $guarded = [
        'RELATION_JOBDESC_ID',
    ];

    public $timestamps = false;

    public function toRelation(){
        return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID' , 'RELATION_ORGANIZATION_ID');
    }

    public function parent()
    {
        return $this->belongsTo(TJobDesc::class, 'RELATION_JOBDESC_PARENT_ID');
    }
}
