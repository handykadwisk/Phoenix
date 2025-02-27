<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MRelationPic extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_RELATION_PIC_ID';

    protected $table = 'm_relation_pic';

    public $timestamps = false;

    public $with = ['relation'];

    public $guarded = [
        'M_RELATION_PIC_ID'
    ];

    public function relation()
    {
        return $this->hasOne(Relation::class, 'RELATION_ORGANIZATION_ID', 'RELATION_ORGANIZATION_ID');
    }
}
