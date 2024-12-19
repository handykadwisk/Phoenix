<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MMedicalDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'MEDICAL_DETAIL_ID';

    protected $table = 'm_medical_detail';

    protected $guarded = [
        'MEDICAL_DETAIL_ID',
    ];

    public $timestamps = false;

    // protected $with = ['division'];
}
