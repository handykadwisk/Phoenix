<?php

namespace App\Http\Controllers;

use App\Models\MEmployeeAttendance;
use App\Models\Relation;
use App\Models\ROffSiteReason;
use App\Models\TAttendanceSetting;
use App\Models\TCompany;
use App\Models\TCompanyOffice;
use App\Models\TEmployee;
use App\Models\TEmployeeAttendance;
use App\Models\TimeOffMaster;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportAttendanceController extends Controller
{
    public function index()
    {        
        $listYear = DB::table('t_employee_attendance')
                ->selectRaw('YEAR(EMPLOYEE_ATTENDANCE_CHECK_IN_DATE) as YEAR')
                ->groupBy(DB::raw('YEAR(EMPLOYEE_ATTENDANCE_CHECK_IN_DATE)'))->get();
        return Inertia::render('ReportAttendance/Index', [
            'selectYear'    => $listYear,
            'companies'     => TCompany::get(),
        ]);
    }

    function getOfficeByCompanyId($id= null) {
        $data = TCompanyOffice::where('COMPANY_ID', $id)->get();
        return response()->json($data);
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
    
    public function getAttendanceAgGrid(Request $request)
    {
        // dd($request);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sortModel = $request->input('sort');

        // $query = TEmployeeAttendance::with('employee');
        $query = DB::table('t_employee_attendance as ea')
                ->select(DB::raw('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE, COUNT(ea.EMPLOYEE_ID) AS JUMLAH_ATTENDANCE'))
                ->leftJoin('t_employee AS e', 'ea.EMPLOYEE_ID', '=','e.EMPLOYEE_ID')
                ->groupBy('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE');
            
        $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);
        // dd($newSearch[0]);  

        $dataSearch = $newSearch[0];

        if ($dataSearch['YEAR'] == "" && $dataSearch['MONTH'] == "") {
            return null;
        } else {
            if ($dataSearch['COMPANY_ID']) {
                $query->where('COMPANY_ID', '=', $dataSearch['COMPANY_ID']);
            }
            
            if ($dataSearch['OFFICE_ID']) {
                $query->where('OFFICE_ID', '=', $dataSearch['OFFICE_ID']);
            }            
            $query->where(DB::raw('year(EMPLOYEE_ATTENDANCE_CHECK_IN_DATE)'), '=', $dataSearch['YEAR']);
            $query->where(DB::raw('month(EMPLOYEE_ATTENDANCE_CHECK_IN_DATE)'), '=', $dataSearch['MONTH']);
        }
        
        // if ($sortModel) {
        //     $sortModel = explode(';', $sortModel); 
        //     foreach ($sortModel as $sortItem) {
        //         list($colId, $sortDirection) = explode(',', $sortItem);
        //         $query->orderBy($colId, $sortDirection); 
        //     }
        // } else {
        //     $query->orderBy('POLICY_ID', 'DESC'); 
        // }
        // print_r($query->toSql());

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        
        return $data;
    }

    public function detailAttendanceReportAgGrid(Request $request)
    {
        // dd($request);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sortModel = $request->input('sort');

        // $query = TEmployeeAttendance::where('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE', $request->id)->with('employee', 'attendanceSetting');
            
        $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);
        // dd($newSearch[0]);  

        $dataSearch = $newSearch[0];
        if ($dataSearch['ON_TIME']) {
            // echo "ON_TIME";
           $query = TEmployeeAttendance::leftJoin('t_attendance_setting AS ats', 't_employee_attendance.ATTENDANCE_SETTING_ID', '=', 'ats.ATTENDANCE_SETTING_ID')
           ->where('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE', $request->id)
            ->whereRaw('TIME(ats.ATTENDANCE_CHECK_IN_TIME) <= ADDTIME(ats.ATTENDANCE_CHECK_IN_TIME, CONCAT( "00:", ats.ATTENDANCE_LATE_COMPENSATION ) )');
        //    ->where(DB::raw('TIME(ats.ATTENDANCE_CHECK_IN_TIME)'), '<=', 'ADDTIME( ats.ATTENDANCE_CHECK_IN_TIME, \'00:06\')');
        // $query = DB::table('t_employee_attendance AS ea')->select(DB::raw('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE, COUNT(ea.EMPLOYEE_ID) AS JUMLAH_ATTENDANCE'))->leftJoin('t_attendance_setting AS ats', 'ea.ATTENDANCE_SETTING_ID', '=', 'ats.ATTENDANCE_SETTING_ID')->where('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE', "'".$request->id."'")->where(DB::raw('TIME(ats.ATTENDANCE_CHECK_IN_TIME)'), '<=', 'ADDTIME( ats.ATTENDANCE_CHECK_IN_TIME, CONCAT(\'00:\', ats.ATTENDANCE_LATE_COMPENSATION ))');
        } elseif ($dataSearch['LATE_ARRIVAL']) {
            // echo "LATE_ARRIVAL";
            $query = TEmployeeAttendance::leftJoin('t_attendance_setting AS ats', 't_employee_attendance.ATTENDANCE_SETTING_ID', '=', 'ats.ATTENDANCE_SETTING_ID')
           ->where('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE', $request->id)
            ->whereRaw('TIME(ats.ATTENDANCE_CHECK_IN_TIME) >= ADDTIME(ats.ATTENDANCE_CHECK_IN_TIME, CONCAT( "00:", ats.ATTENDANCE_LATE_COMPENSATION ) )');
        } elseif ($dataSearch['ABSENT']) {
            // echo "ABSENT";
            $query = TEmployee::where('EMPLOYEE_IS_DELETED', '=', '0')
            ->whereRaw('EMPLOYEE_ID NOT IN ( (SELECT ea.EMPLOYEE_ID FROM t_employee_attendance AS ea WHERE ea.EMPLOYEE_ATTENDANCE_CHECK_IN_DATE = '.$request->id.') )');
        } elseif ($dataSearch['TIME_OFF']) {
            // echo "TIME_OFF";
            $query = TimeOffMaster::leftJoin('t_request_time_off AS rto', 't_request_time_off_master.REQUEST_TIME_OFF_MASTER_ID', '=', 'rto.REQUEST_TIME_OFF_MASTER_ID')
            ->where("rto.DATE_OF_LEAVE", $request->id)->with('employee');
        }
// print_r($query->get());
// dd($query->toSql());
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
