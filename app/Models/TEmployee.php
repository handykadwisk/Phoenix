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

    public function taxStatus(){
        return $this->hasOne(RTaxStatus::class, 'TAX_STATUS_ID', 'TAX_STATUS_ID');
    }

    public function employeeEducation(){
        return $this->hasMany(TEmployeeEducation::class, 'EMPLOYEE_ID', 'EMPLOYEE_ID');
    }

    public function employeeCertificate(){
        return $this->hasMany(TEmployeeCertificate::class, 'EMPLOYEE_ID', 'EMPLOYEE_ID');
    }

    public function MEmployeeDocument(){
        return $this->hasMany(MEmployeeDocument::class, 'EMPLOYEE_ID', 'EMPLOYEE_ID');
    }

    public function mAddressEmployee(){
        return $this->hasMany(MAddressEmployee::class, 'EMPLOYEE_ID', 'EMPLOYEE_ID');
    }

    public function TEmployeeBank(){
        return $this->hasMany(TEmployeeBankAccount::class, 'EMPLOYEE_ID', 'EMPLOYEE_ID');
    }

    public function Document(){
        return $this->hasOne(Document::class, 'DOCUMENT_ID', 'EMPLOYEE_IMAGE_ID');
    }

    public function office(){
        return $this->hasOne(TCompanyOffice::class, 'COMPANY_OFFICE_ID', 'OFFICE_ID');
    }

    public function structure(){
        return $this->hasOne(TCompanyStructure::class, 'COMPANY_STRUCTURE_ID', 'STRUCTURE_ID');
    }

    public function division(){
        return $this->hasOne(TCompanyDivision::class, 'COMPANY_DIVISION_ID', 'DIVISION_ID');
    }
}
