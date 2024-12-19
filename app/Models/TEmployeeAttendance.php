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

    protected $with = ['employee', 'attendanceSetting'];


    public function employee(){
        return $this->hasOne(TEmployee::class, 'EMPLOYEE_ID', 'EMPLOYEE_ID');
    }

    public function attendanceSetting(){
        return $this->hasOne(TAttendanceSetting::class, 'ATTENDANCE_SETTING_ID', 'ATTENDANCE_SETTING_ID');
    }
}
