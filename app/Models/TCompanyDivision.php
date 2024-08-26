<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TCompanyDivision extends Model
{
    use HasFactory;

    protected $primaryKey = 'COMPANY_DIVISION_ID';

    protected $table = 't_company_division';

    protected $guarded = [
        'COMPANY_DIVISION_ID',
    ];

    public $timestamps = false;

    public function toCompany(){
        return $this->hasOne(TCompany::class, 'COMPANY_ID' , 'COMPANY_ID');
    }

    public function parent()
    {
        return $this->belongsTo(TCompanyDivision::class, 'COMPANY_DIVISION_PARENT_ID');
    }
}
