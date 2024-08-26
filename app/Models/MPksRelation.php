<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPksRelation extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_PKS_RELATION_ID';

    protected $table = 'm_pks_relation';

    public $timestamps = false;

    public $guarded = [
        'M_PKS_RELATION_ID'
    ];
}
