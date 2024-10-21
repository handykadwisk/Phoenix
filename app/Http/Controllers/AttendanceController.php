<?php

namespace App\Http\Controllers;

use App\Models\MEmployeeAttendance;
use App\Models\Relation;
use App\Models\ROffSiteReason;
use App\Models\TAttendanceSetting;
use App\Models\TEmployeeAttendance;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {        
        return Inertia::render('Attendance/Index', [
            
            // 'policies' => Policy::get(),
            // 'currency' => RCurrency::get(),
            // 'clients' => $this->getRelationByRelationType(1),
            // 'agents' => $this->getRelationByRelationType(3)
        ]);
    }

    public function saveClockIn(Request $request) {
        // dd($request);  
        $attendance = TEmployeeAttendance::insertGetId([
            "ATTENDANCE_SETTING_ID" => $request->ATTENDANCE_SETTING_ID,
            "EMPLOYEE_ID" => $request->EMPLOYEE_ID,
            "EMPLOYEE_ATTENDANCE_CHECK_IN_DATE" => $request->EMPLOYEE_ATTENDANCE_CHECK_IN_DATE,
            "EMPLOYEE_ATTENDANCE_CHECK_IN_TIME" => $request->EMPLOYEE_ATTENDANCE_CHECK_IN_TIME,
            "EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE" => $request->EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE,
            "EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME" => $request->EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME,
            "EMPLOYEE_ATTENDANCE_LOCATION_LATITUDE" => $request->EMPLOYEE_ATTENDANCE_LOCATION_LATITUDE,
            "EMPLOYEE_ATTENDANCE_LOCATION_LONGITUDE" => $request->EMPLOYEE_ATTENDANCE_LOCATION_LONGITUDE,
            "EMPLOYEE_ATTENDANCE_LOCATION_TYPE" => $request->EMPLOYEE_ATTENDANCE_LOCATION_TYPE,
            "EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN" => $request->EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN,
            "EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT" => $request->EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT,
            "EMPLOYEE_ATTENDANCE_LOCATION_SYSTEM_MESSAGE" => $request->EMPLOYEE_ATTENDANCE_LOCATION_SYSTEM_MESSAGE,
            "LOCATION_DISTANCE" => $request->LOCATION_DISTANCE,
            "OFF_SITE_REASON_ID" => $request->OFF_SITE_REASON_ID,
        ]);


        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Clock In",
                "module"      => "Attendance",
                "id"          => $attendance
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            "msg" => "Clock In Succeed"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getAttendanceByEmployeeIdAndDate(Request $request){
        // dd($request);
        $attendance = TEmployeeAttendance::where('EMPLOYEE_ID', $request->employeeId)
        ->where('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE', $request->date)
        ->first();
        return response()->json($attendance);
    }

    public function getMEmployeeAttendanceByEmployeeId(Request $request){
        // dd($request);
        $data = MEmployeeAttendance::where('EMPLOYEE_ID', $request->employeeId)
        ->first();
        return response()->json($data);
    }
    public function getAttendanceSettingById(Request $request){
        // dd($request);
        $data = TAttendanceSetting::where('ATTENDANCE_SETTING_ID', $request->id)
        ->first();
        return response()->json($data);
    }
    function getOffSiteReason() {
        $query = ROffSiteReason::get();
        return response()->json($query);
    }

     public function saveClockOut(Request $request) {
        // dd($request);  
        $attendance = TEmployeeAttendance::where('EMPLOYEE_ATTENDANCE_ID', $request->EMPLOYEE_ATTENDANCE_ID)
            ->update([
                "EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE" => $request->EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE,
                "EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME" => $request->EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME,
                "EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT" => $request->EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT,
            ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Clock Out",
                "module"      => "Attendance",
                "id"          => $attendance
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            "msg" => "Clock Out Succeed"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

}
