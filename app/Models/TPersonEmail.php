<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPersonEmail extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_EMAIL_ID';

    protected $table = 't_person_email';

    protected $guarded = [
        'PERSON_EMAIL_ID',
    ];

    public $timestamps = false;
}
