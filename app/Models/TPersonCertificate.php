<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPersonCertificate extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_CERTIFICATE_ID';

    protected $table = 't_person_certificate';

    protected $with = ['CertificateQualification'];

    protected $guarded = [
        'PERSON_CERTIFICATE_ID',
    ];

    public $timestamps = false;

    public function CertificateQualification(){
        return $this->hasOne(RCertificateQualification::class, 'CERTIFICATE_QUALIFICATION_ID', 'CERTIFICATE_QUALIFICATION_ID');
    }
}
