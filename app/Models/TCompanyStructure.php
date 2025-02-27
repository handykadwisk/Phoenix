<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TCompanyStructure extends Model
{
    use HasFactory;

    protected $primaryKey = 'COMPANY_STRUCTURE_ID';

    protected $table = 't_company_structure';

    protected $guarded = [
        'COMPANY_STRUCTURE_ID',
    ];

    public $timestamps = false;

    public function toCompany(){
        return $this->hasOne(TCompany::class, 'COMPANY_ID' , 'COMPANY_ID');
    }

    public function grade(){
        return $this->hasOne(RGrade::class, 'GRADE_ID' , 'COMPANY_GRADE_ID');
    }

    public function parent()
    {
        return $this->belongsTo(TCompanyStructure::class, 'COMPANY_STRUCTURE_PARENT_ID');
    }
}
