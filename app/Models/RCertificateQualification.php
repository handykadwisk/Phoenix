<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RCertificateQualification extends Model
{
    use HasFactory;

    protected $primaryKey = 'CERTIFICATE_QUALIFICATION_ID';

    protected $table = 'r_certificate_qualification';

    protected $guarded = [
        'CERTIFICATE_QUALIFICATION_ID',
    ];

    public $timestamps = false;
}
