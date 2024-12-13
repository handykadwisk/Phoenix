<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MLemburDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'LEMBUR_DETAIL_ID';

    protected $table = 'm_lembur_detail';

    protected $guarded = [
        'LEMBUR_DETAIL_ID',
    ];

    public $timestamps = false;

    // protected $with = ['division'];
}
