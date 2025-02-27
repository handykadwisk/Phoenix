<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPersonEducation extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_EDUCATION_ID';

    protected $table = 't_person_education';

    protected $with = ['EducationDegree'];

    protected $guarded = [
        'PERSON_EDUCATION_ID',
    ];

    public $timestamps = false;

    public function EducationDegree(){
        return $this->hasOne(REducationDegree::class, 'EDUCATION_DEGREE_ID', 'EDUCATION_DEGREE_ID');
    }

}
