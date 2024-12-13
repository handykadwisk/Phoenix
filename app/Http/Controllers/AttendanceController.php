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
        ->where('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE', '=' , date($request->date))
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

    public function getAttendanceSettingByIdForClockIn(Request $request){
        // dd($request);
        if (!$request->attendanceSettingId) {
            $data = TAttendanceSetting::get();
        } else {
            $data = TAttendanceSetting::where('ATTENDANCE_SETTING_ID', $request->attendanceSettingId)->get();
        }
        return response()->json($data);
    }

     public function getAttendanceType(Request $request){
        $data = TAttendanceSetting::where('ATTENDANCE_TYPE', $request->attendanceType)->where('COMPANY_ID', $request->companyId)->get();
        return response()->json($data);
    }

     public function getAttendaceById(Request $request){
        $data = TEmployeeAttendance::find($request->attendanceId);
        return response()->json($data);
    }
    
    public function getAttendanceForEmployeeAgGrid(Request $request)
    {
        // dd($request);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sortModel = $request->input('sort');

        // $query = DB::table('t_policy as p')->leftJoin('t_relation as r', 'p.RELATION_ID', '=', 'r.RELATION_ORGANIZATION_ID');
        $query = TEmployeeAttendance::where('EMPLOYEE_ID', Auth::user()->employee_id)->where('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE', '<>',date_format(now(),"Y-m-d"))->orderBy('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE', 'desc');
            // dd($query->toSql());
        // $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);        
        
        // if ($sortModel) {
        //     $sortModel = explode(';', $sortModel); 
        //     foreach ($sortModel as $sortItem) {
        //         list($colId, $sortDirection) = explode(',', $sortItem);
        //         $query->orderBy($colId, $sortDirection); 
        //     }
        // } else {
        //     $query->orderBy('POLICY_ID', 'DESC'); 
        // }

        // if ($request->newFilter != "") {
        //     foreach ($newSearch[0] as $keyId => $searchValue) {
        //         if ($keyId === 'DATE') {
        //             if ($searchValue != "") {
        //                 $query->where('REQUEST_DATE', '=', $searchValue);
        //             }                        
        //         // }elseif ($keyId === 'CLIENT_ID'){
        //         //     if ($searchValue != "") {
        //         //         $query->where('RELATION_ID', $searchValue);
        //         //     }
        //         }
        //     }
        // }

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        
        return $data;
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

    public function editCheckOut(Request $request) {
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
                "description" => "Edit Clock Out",
                "module"      => "Attendance",
                "id"          => $attendance
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            "msg" => "Edit Clock Out Succeed"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

}
