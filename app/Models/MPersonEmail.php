<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPersonEmail extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_PERSON_EMAIL_ID';

    protected $table = 'm_person_email';

    public $with = ['TPersonEmail'];

    protected $guarded = [
        'M_PERSON_EMAIL_ID',
    ];

    public $timestamps = false;

    public function TPersonEmail()
    {
        return $this->hasOne(TPersonEmail::class, 'PERSON_EMAIL_ID', 'PERSON_EMAIL_ID');
    }
}
