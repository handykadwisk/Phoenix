<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TEmployeeFamilyMember extends Model
{
    use HasFactory;

    protected $primaryKey = 'EMPLOYEE_FAMILY_MEMBER_ID';

    protected $table = 't_employee_family_member';

    protected $with = ['EmploymentRelationship'];

    protected $guarded = [
        'EMPLOYEE_FAMILY_MEMBER_ID',
    ];

    public $timestamps = false;

    public function EmploymentRelationship(){
        return $this->hasOne(RPersonRelationship::class, 'PERSON_RELATIONSHIP_ID','EMPLOYEE_RELATIONSHIP_ID');
    }
}
