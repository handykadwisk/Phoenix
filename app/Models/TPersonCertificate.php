<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPersonCertificate extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_CERTIFICATE_ID';

    protected $table = 't_person_certificate';

    protected $guarded = [
        'PERSON_CERTIFICATE_ID',
    ];

    public $timestamps = false;
}
