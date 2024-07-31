<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPersonContact extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_PERSON_CONTACT_ID';

    protected $table = 'm_person_contact';

    public $with = ['TPersonContact'];

    public $timestamps = false;

    public $guarded = [
        'M_PERSON_CONTACT_ID'
    ];

    public function TPersonContact(){
        return $this->hasOne(TPersonContact::class, 'PERSON_CONTACT_ID', 'PERSON_CONTACT_ID');
    }
}
