<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TEmployeeCertificate extends Model
{
    use HasFactory;

    protected $primaryKey = 'EMPLOYEE_CERTIFICATE_ID';

    protected $table = 't_employee_certificate';

    protected $with = ['CertificateQualification'];

    protected $guarded = [
        'EMPLOYEE_CERTIFICATE_ID',
    ];

    public $timestamps = false;

    public function CertificateQualification(){
        return $this->hasOne(RCertificateQualification::class, 'CERTIFICATE_QUALIFICATION_ID', 'CERTIFICATE_QUALIFICATION_ID');
    }
}
