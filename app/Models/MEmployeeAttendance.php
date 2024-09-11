<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MEmployeeAttendance extends Model
{
    use HasFactory;
    protected $primaryKey = 'EMPLOYEE_ATTENDANCE_ID';

    protected $table = 'm_employee_attendance';

    protected $guarded = [
        'EMPLOYEE_ATTENDANCE_ID',
    ];

    public $timestamps = false;
}
