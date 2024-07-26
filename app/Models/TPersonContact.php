<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPersonContact extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_CONTACT_ID';

    protected $table = 't_person_contact';

    protected $guarded = [
        'PERSON_CONTACT_ID',
    ];

    public $timestamps = false;
}
