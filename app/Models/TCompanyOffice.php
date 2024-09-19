<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TCompanyOffice extends Model
{
    use HasFactory;

    protected $primaryKey = 'COMPANY_OFFICE_ID';

    protected $table = 't_company_office';

    protected $guarded = [
        'COMPANY_OFFICE_ID',
    ];

    public $timestamps = false;

    public function toCompany(){
        return $this->hasOne(TCompany::class, 'COMPANY_ID' , 'COMPANY_ID');
    }
    public function parent()
    {
        return $this->belongsTo(TCompanyOffice::class, 'COMPANY_OFFICE_PARENT_ID');
    }

    public function mLocationType(){
        return $this->hasMany(MCompanyOfficeLocationType::class, 'COMPANY_OFFICE_ID');
    } 
}
