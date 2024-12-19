<?php

namespace App\Http\Controllers;

use App\Models\TAdditionalAllowance;
use App\Models\TAttendanceSetting;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdditionalAllowanceController extends Controller
{
    public function index()
    {
        return Inertia::render('AdditionalAllowance/Index', []);
    }

    public function store(Request $request)
    {
        // dd($request);
        DB::transaction(function () use ($request) {
            // Simpan ke Tabel t_medical
            $lembur = TAdditionalAllowance::create([
                'ADDITIONAL_ALLOWANCE_NAME'           => $request->ADDITIONAL_ALLOWANCE_NAME,
                'ADDITIONAL_ALLOWANCE_AMOUNT'         => $request->ADDITIONAL_ALLOWANCE_AMOUNT,
                'ADDITIONAL_ALLOWANCE_UANG_MAKAN'     => $request->ADDITIONAL_ALLOWANCE_UANG_MAKAN,
                'ADDITIONAL_ALLOWANCE_CREATED_BY'     => Auth::user()->id,
                'ADDITIONAL_ALLOWANCE_CREATED_DATE'   => now(),
                'ADDITIONAL_ALLOWANCE_NOTE'           => $request->ADDITIONAL_ALLOWANCE_NOTE
            ]);

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Additional Allowance",
                    "module"      => "Additional Allowance",
                    "id"          => $lembur->ADDITIONAL_ALLOWANCE_ID
                ]),
                'action_by'  => Auth::user()->user_login
            ]);
        }); 
        
        return new JsonResponse([
            "msg" => "Added Additional Allowance"
        ], 201, [
            'X-Inertia' => true
        ]);
       
    }

    public function getAdditionalAllowanceAgGrid(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sortModel = $request->input('sort');

        $query = DB::table('t_additional_allowance');
            
        
        // if ($sortModel) {
        //     $sortModel = explode(';', $sortModel); 
        //     foreach ($sortModel as $sortItem) {
        //         list($colId, $sortDirection) = explode(',', $sortItem);
        //         $query->orderBy($colId, $sortDirection); 
        //     }
        // } else {
        //     $query->orderBy('POLICY_ID', 'DESC'); 
        // }

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        
        return $data;
    }

    function getAdditionalAllowanceById($id= null) {
        $data = TAdditionalAllowance::find($id);
        return response()->json($data);
    }

     public function editAdditionalAllowance(Request $request)
    {
        // dd($request);
        DB::transaction(function () use ($request) {     

            $id = $request->ADDITIONAL_ALLOWANCE_ID;

            $lembur = TAdditionalAllowance::where('ADDITIONAL_ALLOWANCE_ID', $id)
                ->update([
                'ADDITIONAL_ALLOWANCE_NAME'           => $request->ADDITIONAL_ALLOWANCE_NAME,
                'ADDITIONAL_ALLOWANCE_AMOUNT'         => $request->ADDITIONAL_ALLOWANCE_AMOUNT,
                'ADDITIONAL_ALLOWANCE_UANG_MAKAN'     => $request->ADDITIONAL_ALLOWANCE_UANG_MAKAN,
                'ADDITIONAL_ALLOWANCE_UPDATED_BY'     => Auth::user()->id,
                'ADDITIONAL_ALLOWANCE_UPDATED_DATE'   => now(),
                'ADDITIONAL_ALLOWANCE_NOTE'           => $request->ADDITIONAL_ALLOWANCE_NOTE
            ]);

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Edit Additional Allowance.",
                    "module"      => "Additional Allowance",
                    "id"          => $id
                ]),
                'action_by'  => Auth::user()->user_login
            ]);
        }); 
        
        return new JsonResponse([
            "msg" => "Success Updated Additional Allowance"
        ], 201, [
            'X-Inertia' => true
        ]);
       
    }

    function deleteAdditionalAllowance(Request $request) {
        $status = false;
        $status = DB::transaction(function () use ($request) {
            $data = $request->data;
            TAdditionalAllowance::where('ADDITIONAL_ALLOWANCE_ID', $data['ADDITIONAL_ALLOWANCE_ID'])->delete();
            return true;
        });

        return new JsonResponse([
            'status' => $status,
            "msg" => "Success Deleted Additional Allowance"
        ], 201, [
            'X-Inertia' => true
        ]);

    }
}
