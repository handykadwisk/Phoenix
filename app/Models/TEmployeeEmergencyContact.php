<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TEmployeeEmergencyContact extends Model
{
    use HasFactory;

    protected $primaryKey = 'EMPLOYEE_EMERGENCY_CONTACT_ID';

    protected $table = 't_employee_emergency_contact';

    protected $with = ['EmploymentRelationship'];

    protected $guarded = [
        'EMPLOYEE_EMERGENCY_CONTACT_ID',
    ];

    public $timestamps = false;

    public function EmploymentRelationship(){
        return $this->hasOne(RPersonRelationship::class, 'PERSON_RELATIONSHIP_ID','EMPLOYEE_RELATIONSHIP_ID');
    }
}
