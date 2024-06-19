<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TRelationOffice extends Model
{
    use HasFactory;

    protected $primaryKey = 'RELATION_OFFICE_ID';

    protected $table = 't_relation_office';

    protected $guarded = [
        'RELATION_OFFICE_ID',
    ];

    public $timestamps = false;
}
