<?php

namespace App\Http\Controllers;

use App\Models\MLemburDetail;
use App\Models\TAttendanceSetting;
use App\Models\TCompanyDivision;
use App\Models\TEmployee;
use App\Models\TEmployeeAttendance;
use App\Models\TLembur;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LemburController extends Controller
{
    public function index()
    {
        $listYear = DB::table('t_lembur')
                ->selectRaw('YEAR(TANGGAL_PERIODE_2) as YEAR')
                ->groupBy(DB::raw('YEAR(TANGGAL_PERIODE_2)'))->get();
        $listEmployee = DB::table('t_employee AS e')
                ->leftJoin('t_company_structure AS s', 'e.STRUCTURE_ID', '=', 's.COMPANY_STRUCTURE_ID')
                ->leftJoin('r_grade AS g', 's.COMPANY_GRADE_ID', '=', 'g.GRADE_ID')
                ->where('e.EMPLOYEE_IS_DELETED', '=', '0')
                ->where('s.COMPANY_GRADE_ID', '=', '9')
                ->orderBy('e.EMPLOYEE_FIRST_NAME', 'asc')
                ->get();
        return Inertia::render('Lembur/Index', [
            'selectYear'            => $listYear,
            'listEmployee'          => $listEmployee,
            'kodeLembur'            => DB::table('r_kode_lembur')->get(),
            'additionalAllowance'   => DB::table('t_additional_allowance')->get(),
            'shiftFromAttendanceSetting'   => TAttendanceSetting::where('ATTENDANCE_TYPE', 1)->get(),
            // 'shift'                 => DB::table('r_shift')->get()
        ]);
    }

    public function getRequestLemburAgGrid(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sortModel = $request->input('sort');

        $query = DB::table('t_lembur AS l')
                ->select(DB::raw('l.*, sum(ld.LEMBUR_UANG_MAKAN) AS LEMBUR_UANG_MAKAN'))
                ->leftJoin('m_lembur_detail AS ld', 'l.LEMBUR_ID', '=', 'ld.LEMBUR_ID')
                ->groupBy('l.EMPLOYEE_ID');
            
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

        if ($request->newFilter != "") {
            foreach ($newSearch[0] as $keyId => $searchValue) {
                if ($keyId === 'YEAR') {
                    if ($searchValue != "") {
                        $query->where(DB::raw('year(l.TANGGAL_PERIODE_2)'), '=', $searchValue);
                    }                        
                }elseif ($keyId === 'MONTH'){
                    if ($searchValue != "") {
                        $query->where(DB::raw('month(l.TANGGAL_PERIODE_2)'), '=', $searchValue);
                    }
                }
            }
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        
        return $data;
    }

    public function store(Request $request)
    {
        // dd($request);
        DB::transaction(function () use ($request) {
            // Simpan ke Tabel t_medical
            $lembur = TLembur::create([
                'EMPLOYEE_ID'       => $request->EMPLOYEE_ID,
                'COMPANY_ID'        => $request->COMPANY_ID,
                'TANGGAL'           => $request->TANGGAL,
                'TANGGAL_PERIODE'   => $request->TANGGAL_PERIODE,
                'TANGGAL_PERIODE_2' => $request->TANGGAL_PERIODE_2,
                'PERIODE_PENGGAJIAN' => $request->PERIODE_PENGGAJIAN,
                'DESCRIPTION'       => $request->DESCRIPTION,
                'CREATED_DATE'      => now(),
                'CREATED_BY'        => Auth::user()->id
            ]);

            if ($request->detail) {
                foreach ($request->detail as $key => $value) {
                    MLemburDetail::create([
                        'LEMBUR_ID'                 => $lembur->LEMBUR_ID,
                        'ADDITIONAL_ALLOWANCE_ID'   => $value['ADDITIONAL_ALLOWANCE_ID'],
                        'LEMBUR_DATE'               => $value['LEMBUR_DATE'],
                        'KODE_LEMBUR'               => $value['KODE_LEMBUR'],
                        'LEMBUR_IN'                 => $value['LEMBUR_IN'],
                        'LEMBUR_OUT'                => $value['LEMBUR_OUT'],
                        'JUMLAH_JAM_LEMBUR'         => $value['JUMLAH_JAM_LEMBUR'],
                        'TOTAL_UANG_LEMBUR'         => $value['TOTAL_UANG_LEMBUR'],
                        'SHIFT_ID'                  => $value['SHIFT_ID'],
                        'UANG_MAKAN'                => $value['UANG_MAKAN'],
                        'LEMBUR_UANG_MAKAN'         => $value['LEMBUR_UANG_MAKAN'],
                    ]);
                }
            }

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Register Lembur.",
                    "module"      => "Lembur",
                    "id"          => $lembur->LEMBUR_ID
                ]),
                'action_by'  => Auth::user()->user_login
            ]);
        }); 
        
        return new JsonResponse([
            "msg" => "Register Lembur"
        ], 201, [
            'X-Inertia' => true
        ]);
       
    }

    function getPersonAttendanceByDateAndPersonId($date, $employee_id) {
        $query = TEmployeeAttendance::where('EMPLOYEE_ID', $employee_id)
                    ->where('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE', $date)->first();
        return $query;
        
    }

    public function setDetailLembur(Request $request)
    {
        $data = $request->data;
        $start = date_create($data['TANGGAL_PERIODE']);
        $end = date_create($data['TANGGAL_PERIODE_2']);
        
        $daysBetween = date_diff($start, $end);

        $arr = [];
        for ($i = 0; $i <= $daysBetween->format("%a"); $i++) {
            $date = date('Y-m-d', strtotime(date_format($start,"Y-m-d")));
            date_format($start->modify('+1 day'), "Y-m-d");

            $check_in = "";
            $check_out = "";
            $shift_id = "";
            $attendanceByPerson = $this->getPersonAttendanceByDateAndPersonId($date, $data['EMPLOYEE_ID']);
            
            if ($attendanceByPerson) {
                $check_in = substr($attendanceByPerson['EMPLOYEE_ATTENDANCE_CHECK_IN_TIME'],0,5);
                $check_out = substr($attendanceByPerson['EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME'],0,5);
                $shift_id = $attendanceByPerson['ATTENDANCE_SETTING_ID'];
            }

            array_push($arr, [
                "LEMBUR_DETAIL_ID" => "",
                "LEMBUR_ID" => "",
                "ADDITIONAL_ALLOWANCE_ID" => "",
                "LEMBUR_DATE" => $date,
                "KODE_LEMBUR" => "",
                "LEMBUR_IN" => $check_in,
                "LEMBUR_OUT" => $check_out,
                "JUMLAH_JAM_LEMBUR" => 0,
                "TOTAL_UANG_LEMBUR" => 0,
                "SHIFT_ID" => $shift_id,
                "UANG_MAKAN" => 0,
                "LEMBUR_UANG_MAKAN" => 0,
            ]);
        }

        // print_r($arr);
        return response()->json($arr);
    }

    function getLemburById($id= null) {
        $data = TLembur::find($id);
        return response()->json($data);
    }

     public function editLembur(Request $request)
    {
        // dd($request);

        // $validateData = Validator::make(
        //     // Data
        //     $request->all(), [
        //     'policy_number'              => 'required|string',
        //     'policy_status_id'            => 'required',
        // ], [
        //     // Message
        //     'relation_id.required'          => 'Client Name is required.',
        //     'relation_id.required'          => 'Client Name is required.',
        //     'insurance_type_id.required'          => 'Insurance Type is required.',
        //     'policy_status_id.required'          => 'Policy Status is required.',
        // ]);

        // if ($validateData->fails()) {
        //     return new JsonResponse([
        //         $validateData->errors()->all()
        //     ], 422, [
        //         'X-Inertia' => true
        //     ]);
        // }


        DB::transaction(function () use ($request) {     

            $lemburId = $request->LEMBUR_ID;

            $lembur = TLembur::where('LEMBUR_ID', $lemburId)
                ->update([
                'TANGGAL_PERIODE'   => $request->TANGGAL_PERIODE,
                'TANGGAL_PERIODE_2' => $request->TANGGAL_PERIODE_2,
                'PERIODE_PENGGAJIAN' => $request->PERIODE_PENGGAJIAN,
                'UPDATED_DATE'      => now(),
                'UPDATED_BY'        => Auth::user()->id
            ]);

            if ($request->detail) {
                MLemburDetail::where('LEMBUR_ID', $lemburId)->delete();
                foreach ($request->detail as $key => $value) {
                    $additionalAllowanceId = array_key_exists("ADDITIONAL_ALLOWANCE_ID", $value) ? $value['ADDITIONAL_ALLOWANCE_ID'] : null;
                    $kodeLembur = array_key_exists("KODE_LEMBUR", $value) ? $value['KODE_LEMBUR'] : null;
                    $shiftId = array_key_exists("SHIFT_ID", $value) ? $value['SHIFT_ID'] : null;
                    $lemburIn = array_key_exists("LEMBUR_IN", $value) ? $value['LEMBUR_IN'] : null;
                    $lemburOut = array_key_exists("LEMBUR_OUT", $value) ? $value['LEMBUR_OUT'] : null;
                    MLemburDetail::create([
                        'LEMBUR_ID'                 => $lemburId,
                        'ADDITIONAL_ALLOWANCE_ID'   => $additionalAllowanceId,
                        'LEMBUR_DATE'               => $value['LEMBUR_DATE'],
                        'KODE_LEMBUR'               => $kodeLembur,
                        'LEMBUR_IN'                 => $lemburIn,
                        'LEMBUR_OUT'                => $lemburOut,
                        'JUMLAH_JAM_LEMBUR'         => $value['JUMLAH_JAM_LEMBUR'],
                        'TOTAL_UANG_LEMBUR'         => $value['TOTAL_UANG_LEMBUR'],
                        'SHIFT_ID'                  => $shiftId,
                        'UANG_MAKAN'                => $value['UANG_MAKAN'],
                        'LEMBUR_UANG_MAKAN'         => $value['LEMBUR_UANG_MAKAN'],
                    ]);
                }
            }

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Edit Lembur.",
                    "module"      => "Lembur",
                    "id"          => $lemburId
                ]),
                'action_by'  => Auth::user()->user_login
            ]);
        }); 
        
        return new JsonResponse([
            "msg" => "Success Edit Lembur"
        ], 201, [
            'X-Inertia' => true
        ]);
       
    }

    function deleteLembur(Request $request) {
        // dd($request->data);
        $status = false;
        $status = DB::transaction(function () use ($request) {
            $data = $request->data;
            TLembur::where('LEMBUR_ID', $data['LEMBUR_ID'])->delete();
            MLemburDetail::where('LEMBUR_ID', $data['LEMBUR_ID'])->delete();
            return true;
        });
        // dd($status);

        return new JsonResponse([
            'status' => $status,
            "msg" => "Success Deleted Lembur"
        ], 201, [
            'X-Inertia' => true
        ]);

    }
}
