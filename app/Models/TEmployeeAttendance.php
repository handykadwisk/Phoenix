<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TEmployeeAttendance extends Model
{
    use HasFactory;
    protected $primaryKey = 'EMPLOYEE_ATTENDANCE_ID';

    protected $table = 't_employee_attendance';

    protected $guarded = [
        'EMPLOYEE_ATTENDANCE_ID',
    ];

    public $timestamps = false;
}
