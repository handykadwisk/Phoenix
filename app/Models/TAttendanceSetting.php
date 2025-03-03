<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TAttendanceSetting extends Model
{
    use HasFactory;
    protected $primaryKey = 'ATTENDANCE_SETTING_ID';

    protected $table = 't_attendance_setting';
    
    protected $with = ['company'];

    protected $guarded = [
        'ATTENDANCE_SETTING_ID',
    ];

    public $timestamps = false;

    public function company(){
        return $this->hasOne(TCompany::class, 'COMPANY_ID', 'COMPANY_ID');
    }
}
