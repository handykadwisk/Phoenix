<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class REducationDegree extends Model
{
    use HasFactory;

    protected $primaryKey = 'EDUCATION_DEGREE_ID';

    protected $table = 'r_education_degree';

    protected $guarded = [
        'EDUCATION_DEGREE_ID',
    ];

    public $timestamps = false;
}
