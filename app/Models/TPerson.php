<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPerson extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_ID';

    protected $table = 't_person';

    protected $guarded = [
        'PERSON_ID',
    ];

    public $timestamps = false;

    public function ContactEmergency(){
        return $this->hasMany(TPersonEmergencyContact::class, 'PERSON_ID');
    }
}
