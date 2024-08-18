<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TEmployee extends Model
{
    use HasFactory;

    protected $primaryKey = 'EMPLOYEE_ID';

    protected $table = 't_employee';

    protected $guarded = [
        'EMPLOYEE_ID',
    ];

    public $timestamps = false;

    public function Company(){
        return $this->hasOne(TCompany::class, 'COMPANY_ID', 'COMPANY_ID');
    }

    public function MEmploymentContact(){
        return $this->hasMany(MEmployeeContact::class, 'EMPLOYEE_ID', 'EMPLOYEE_ID');
    }

    public function TEmploymentEmergency(){
        return $this->hasMany(TEmployeeEmergencyContact::class, 'EMPLOYEE_ID', 'EMPLOYEE_ID');
    }
}
