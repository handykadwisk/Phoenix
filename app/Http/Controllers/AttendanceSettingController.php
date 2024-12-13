<?php

namespace App\Http\Controllers;

use App\Models\MEmployeeAttendance;
use App\Models\TAttendanceSetting;
use App\Models\TCompany;
use App\Models\TEmployee;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AttendanceSettingController extends Controller
{
   public function index()
    {   
        $arrTime = [];
        for($hours=0; $hours<24; $hours++){ // the interval for hours is '1'
            for($mins=0; $mins<60; $mins+=30){ // the interval for mins is '30'
                array_push($arrTime,
                            [
                                'id' => str_pad($hours,2,'0',STR_PAD_LEFT). ':' .str_pad($mins,2,'0',STR_PAD_LEFT),
                                'name' => str_pad($hours,2,'0',STR_PAD_LEFT). ':' .str_pad($mins,2,'0',STR_PAD_LEFT)
                            ]
                );
            }
        }
        return Inertia::render('Company/AttendanceSetting/Index', [            
            'companies' => TCompany::get(),
            'employees' => TEmployee::get(),
            'arrTime' => $arrTime
        ]);
        // untuk memanggil controller lain
        //  $object = new CoBrokingController();
        // $xx = $object->getCoBrokingByPolicyId(10);
        // dd($xx);
    }

     public function store(Request $request)
    {        
        DB::transaction(function () use ($request) {
            // Created Attendance Setting
            $attendanceSetting = TAttendanceSetting::insertGetId([
                'COMPANY_ID' => $request->COMPANY_ID ,
                'ATTENDANCE_NAME' => $request->ATTENDANCE_NAME ,
                'ATTENDANCE_EFFECTIVE_FROM' => $request->ATTENDANCE_EFFECTIVE_FROM ,
                'ATTENDANCE_EFFECTIVE_LAST' => $request->ATTENDANCE_EFFECTIVE_LAST ,
                'ATTENDANCE_TYPE' => $request->ATTENDANCE_TYPE ,
                'ATTENDANCE_WORKING_HOURS' => $request->ATTENDANCE_WORKING_HOURS ,
                'ATTENDANCE_CHECK_IN_TIME' => $request->ATTENDANCE_CHECK_IN_TIME ,
                'ATTENDANCE_CHECK_OUT_TIME' => $request->ATTENDANCE_CHECK_OUT_TIME ,
                'ATTENDANCE_BREAK_HOURS' => $request->ATTENDANCE_BREAK_HOURS ,
                'ATTENDANCE_BREAK_START_TIME' => $request->ATTENDANCE_BREAK_START_TIME ,
                'ATTENDANCE_BREAK_END_TIME' => $request->ATTENDANCE_BREAK_END_TIME ,
                'ATTENDANCE_LATE_COMPENSATION' => $request->ATTENDANCE_LATE_COMPENSATION ,
                'ATTENDANCE_EARLY_COMPENSATION' => $request->ATTENDANCE_EARLY_COMPENSATION ,
                'ATTENDANCE_DISTANCE_THRESHOLD' => $request->ATTENDANCE_DISTANCE_THRESHOLD ,
                'ATTENDANCE_LATITUDE_OFFICE' => $request->ATTENDANCE_LATITUDE_OFFICE ,
                'ATTENDANCE_LONGITUDE_OFFICE' => $request->ATTENDANCE_LONGITUDE_OFFICE ,
                'ATTENDANCE_CREATED_DATE' => now() ,
                'ATTENDANCE_CREATED_BY' => Auth::user()->id ,
                'ATTENDANCE_STATUS' => 0 ,
            ]);

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Created (Attendance Setting).",
                    "module"      => "Attendance Setting",
                    "id"          => $attendanceSetting
                ]),
                'action_by'  => Auth::user()->id
            ]);
        });

        return new JsonResponse([
            // $attendanceSetting
            "msg" => "Register Attendance Setting Succeed"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getAttendanceSetting(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sortModel = $request->input('sort');

        $query = $coveragePremium = DB::table('t_attendance_setting AS ats')
            ->leftJoin('t_company AS c', 'ats.COMPANY_ID', '=', 'c.COMPANY_ID')
            ->select(DB::raw('IF(ats.ATTENDANCE_TYPE = 0, "Fixed", "Shift") AS ATTENDANCE_TYPE_NAME'), 'c.COMPANY_NAME', 'ats.*');
            
        $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);        
        
        if ($sortModel) {
            $sortModel = explode(';', $sortModel); 
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection); 
            }
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        
        return $data;
    }

    public function getAttendanceSettingById(Request $request){
        $dataCompany = TAttendanceSetting::where('ATTENDANCE_SETTING_ID', $request->attendanceSettingId)->first();

        return response()->json($dataCompany);
    }

    public function getMEmployeeAttendanceByPersonId($employee_id){
        $employeeAttendance = MEmployeeAttendance::where('EMPLOYEE_ID', $employee_id)->first();
        return $employeeAttendance; // response()->json($employeeAttendance);
    }

    public function mappingEmployeeToSettingAttendance(Request $request) {
        // dd($request);
        $data = [];
        
        $employee = TEmployee::where('COMPANY_ID', $request->idCompany)->where('EMPLOYEE_IS_DELETED', '<>', '1')->get();
        foreach ($employee as $key => $value) {
            // echo $value['EMPLOYEE_ID'];
            $mEmployeeAttendance = $this->getMEmployeeAttendanceByPersonId($value['EMPLOYEE_ID']);
            if ($mEmployeeAttendance) {
                $tmpData = [
                    'M_EMPLOYEE_ATTENDANCE_ID' => $mEmployeeAttendance["M_EMPLOYEE_ATTENDANCE_ID"],
                    'ATTENDANCE_TYPE' => $mEmployeeAttendance["ATTENDANCE_TYPE"],
                    'ATTENDANCE_SETTING_ID' => $mEmployeeAttendance["ATTENDANCE_SETTING_ID"] ? $mEmployeeAttendance["ATTENDANCE_SETTING_ID"]: "",
                    'EMPLOYEE_ID' => $mEmployeeAttendance["EMPLOYEE_ID"],
                ];
            } else {
                $tmpData = [
                    'M_EMPLOYEE_ATTENDANCE_ID' => "",
                    'ATTENDANCE_TYPE' => "",
                    'ATTENDANCE_SETTING_ID' => "",
                    'EMPLOYEE_ID' => $value["EMPLOYEE_ID"],
                ];
            }
            // print_r($tmpData);
            array_push($data, $tmpData);
        }
        // dd($data);
        return response()->json($data);
    }

    public function editAttendanceSetting(Request $request){
        DB::transaction(function () use ($request) {
            TAttendanceSetting::where('ATTENDANCE_SETTING_ID', $request->ATTENDANCE_SETTING_ID)->update([
                'COMPANY_ID' => $request->COMPANY_ID ,
                'ATTENDANCE_NAME' => $request->ATTENDANCE_NAME ,
                'ATTENDANCE_EFFECTIVE_FROM' => $request->ATTENDANCE_EFFECTIVE_FROM ,
                'ATTENDANCE_EFFECTIVE_LAST' => $request->ATTENDANCE_EFFECTIVE_LAST ,
                'ATTENDANCE_TYPE' => $request->ATTENDANCE_TYPE ,
                'ATTENDANCE_WORKING_HOURS' => $request->ATTENDANCE_WORKING_HOURS ,
                'ATTENDANCE_CHECK_IN_TIME' => $request->ATTENDANCE_CHECK_IN_TIME ,
                'ATTENDANCE_CHECK_OUT_TIME' => $request->ATTENDANCE_CHECK_OUT_TIME ,
                'ATTENDANCE_BREAK_HOURS' => $request->ATTENDANCE_BREAK_HOURS ,
                'ATTENDANCE_BREAK_START_TIME' => $request->ATTENDANCE_BREAK_START_TIME ,
                'ATTENDANCE_BREAK_END_TIME' => $request->ATTENDANCE_BREAK_END_TIME ,
                'ATTENDANCE_LATE_COMPENSATION' => $request->ATTENDANCE_LATE_COMPENSATION ,
                'ATTENDANCE_EARLY_COMPENSATION' => $request->ATTENDANCE_EARLY_COMPENSATION ,
                'ATTENDANCE_DISTANCE_THRESHOLD' => $request->ATTENDANCE_DISTANCE_THRESHOLD ,
                'ATTENDANCE_LATITUDE_OFFICE' => $request->ATTENDANCE_LATITUDE_OFFICE ,
                'ATTENDANCE_LONGITUDE_OFFICE' => $request->ATTENDANCE_LONGITUDE_OFFICE ,
                // 'ATTENDANCE_CREATED_DATE' => now() ,
                // 'ATTENDANCE_CREATED_BY' => Auth::user()->id ,
            ]);

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Edited (Attendance Setting).",
                    "module"      => "Attendance Setting",
                    "id"          => $request->ATTENDANCE_SETTING_ID
                ]),
                'action_by'  => Auth::user()->id
            ]);
        });

        return new JsonResponse([
            "id" => $request->ATTENDANCE_SETTING_ID,
            "msg" => "Edit Attendance Setting Succeed"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

     public function addPersonAttendance(Request $request)
    {        
        DB::transaction(function () use ($request) {
            // Jika Sudah ada, di employeeAttendance maka delete lalu insert
            // Jika belum ada, insert saja
            $arrMEmployeeAttendanceId = [];
            foreach ($request->input() as $key => $value) {
                $mEmployeeAttendance = $this->getMEmployeeAttendanceByPersonId($value['EMPLOYEE_ID']);
                if ($mEmployeeAttendance) {
                    MEmployeeAttendance::where('M_EMPLOYEE_ATTENDANCE_ID', $value['M_EMPLOYEE_ATTENDANCE_ID'])->delete();
                }

                $id = MEmployeeAttendance::insertGetId([
                    'ATTENDANCE_TYPE' => array_key_exists("ATTENDANCE_TYPE", $value) ? $value['ATTENDANCE_TYPE'] : null, //$value["ATTENDANCE_TYPE"],
                    'ATTENDANCE_SETTING_ID' => array_key_exists("ATTENDANCE_SETTING_ID", $value) ? $value['ATTENDANCE_SETTING_ID'] : null,//$value["ATTENDANCE_SETTING_ID"],
                    'EMPLOYEE_ID' => $value["EMPLOYEE_ID"],
                ]);
                array_push($arrMEmployeeAttendanceId, $id);
            }        
    
            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Set Person Attendance.",
                    "module"      => "Set Person Attendance",
                    "id"          => json_encode($arrMEmployeeAttendanceId)
                ]),
                'action_by'  => Auth::user()->id
            ]);
        });

        return new JsonResponse([
            "msg" => "Set Person Attendance Succeed"
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
