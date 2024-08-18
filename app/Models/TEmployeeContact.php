<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TEmployeeContact extends Model
{
    use HasFactory;

    protected $primaryKey = 'EMPLOYEE_CONTACT_ID';

    protected $table = 't_employee_contact';

    protected $guarded = [
        'EMPLOYEE_CONTACT_ID',
    ];

    public $timestamps = false;
}
