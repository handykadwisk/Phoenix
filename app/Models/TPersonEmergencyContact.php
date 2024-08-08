<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPersonEmergencyContact extends Model
{
    use HasFactory;

    protected $primaryKey = 'PERSON_EMERGENCY_CONTACT_ID';

    protected $table = 't_person_emergency_contact';

    protected $with = ['personRelationship'];

    protected $guarded = [
        'PERSON_EMERGENCY_CONTACT_ID',
    ];

    public $timestamps = false;

    public function personRelationship(){
        return $this->hasOne(RPersonRelationship::class, 'PERSON_RELATIONSHIP_ID','PERSON_RELATIONSHIP_ID');
    }
}
