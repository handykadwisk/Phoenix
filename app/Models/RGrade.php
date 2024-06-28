<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RGrade extends Model
{
    use HasFactory;

    protected $primaryKey = 'GRADE_ID';

    protected $table = 'r_grade';

    protected $guarded = [
        'GRADE_ID',
    ];

    public $timestamps = false;
}
