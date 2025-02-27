<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MEmployeeContact extends Model
{
    use HasFactory;

    protected $primaryKey = 'M_EMPLOYEE_CONTACT_ID';

    protected $table = 'm_employee_contact';

    public $timestamps = false;

    public $with = ['TEmployeeContact'];

    public $guarded = [
        'M_EMPLOYEE_CONTACT_ID'
    ];

    public function TEmployeeContact(){
        return $this->hasOne(TEmployeeContact::class, 'EMPLOYEE_CONTACT_ID', 'EMPLOYEE_CONTACT_ID');
    }

}
