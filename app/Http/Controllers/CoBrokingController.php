<?php

namespace App\Http\Controllers;

use App\Models\MPolicyCoBroking;
use App\Models\Policy;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CoBrokingController extends Controller
{
    public function mappingCoBroking(Request $request) {
        // dd($request);
        $data = [];        
        $coBroking = MPolicyCoBroking::where('POLICY_ID', $request->policy_id)->get();
        if (!$coBroking->isEmpty()) {
            foreach ($coBroking as $key => $value) {
                $tmpData = [
                    'CO_BROKING_ID' => $value["CO_BROKING_ID"],
                    'POLICY_ID' => $value["POLICY_ID"],
                    'RELATION_ID' => $value["RELATION_ID"],
                    'CO_BROKING_PERCENTAGE' => $value["CO_BROKING_PERCENTAGE"],
                    'CO_BROKING_IS_LEADER' => $value["CO_BROKING_IS_LEADER"],
                ];
                array_push($data, $tmpData);
            }
        } else {
            $tmpData = [
                'CO_BROKING_ID' => null,
                'POLICY_ID' => $request->policy_id,
                'RELATION_ID' => 1, //Default Fresnel
                'CO_BROKING_PERCENTAGE' => null,
                'CO_BROKING_IS_LEADER' => 0,
            ];
            array_push($data, $tmpData);
        }
        return response()->json($data);
    }

    public function getCoBrokingByCoBrokingId($co_broking_id){
        $coBroking = MPolicyCoBroking::where('CO_BROKING_ID', $co_broking_id)->first();
        return $coBroking; 
    }

    public function getCoBrokingByPolicyId($policy_id){
        $coBroking = getCoBrokingByPolicyId($policy_id);
        return response()->json($coBroking);
    }

    public function store(Request $request)
    {        
        // dd($request);
        $arr = DB::transaction(function () use ($request) {
            $dataCoBroking = $request[0]['dataCoBroking'];
            $deletedCoBroking = array_key_exists("1", $request->input()) ? $request[1]["deletedCoBroking"] : null;
            $arrCoBrokingId = [];
            $arrLogData = [];
            foreach ($dataCoBroking as $key => $value) {
                $data = [
                    'POLICY_ID' => $value["POLICY_ID"],
                    'RELATION_ID' => $value["RELATION_ID"],
                    'CO_BROKING_PERCENTAGE' => $value["CO_BROKING_PERCENTAGE"],
                    'CO_BROKING_IS_LEADER' => $value["CO_BROKING_IS_LEADER"]
                ];
                if (array_key_exists('CO_BROKING_ID', $value) && $value['CO_BROKING_ID'] != "") {
                    $coBroking = $this->getCoBrokingByCoBrokingId($value['CO_BROKING_ID']);
                    MPolicyCoBroking::where('CO_BROKING_ID', $value['CO_BROKING_ID'])->update($data);
                    $id = $value['CO_BROKING_ID'];
                } else {
                    $id = MPolicyCoBroking::insertGetId($data);
                }

                array_push($arrCoBrokingId, $id);
                array_push($arrLogData, $data);
            }
            
            // Deleted Co Broking By Id
            if ($deletedCoBroking) {
                foreach ($deletedCoBroking as $dels => $del) {
                    MPolicyCoBroking::where('CO_BROKING_ID', $del['CO_BROKING_ID'])->delete();
                }
            }
            return [$arrCoBrokingId, $arrLogData];
        });
      
        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->user_login,
            'action'     => json_encode([
                "description" => "Created/Update (Co Broking). Data: ". json_encode($arr[1]),
                "module"      => "Policy (Co Broking)",
                "id"          => $arr[0]
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            "msg" => "Success Updated Co Broking"
        ], 201, [
            'X-Inertia' => true
        ]);
    }


    public function updatePolicyCoBroking(Request $request)
    {        
        // dd($request);
        DB::transaction(function () use ($request) {
        // Update tabel t_policy
            $updateCoBroking = Policy::where('POLICY_ID', $request->input('policyId'))
                            ->update(['CO_BROKING' => $request->input('coBroking')]);

            if ($updateCoBroking) {
                if (!$request->input('coBroking')) {
                    // jika false maka update Delete data di MPolicyCoBroking berdasarkan POLICY_ID
                    MPolicyCoBroking::where('POLICY_ID', $request->input('policyId'))->delete();
                }
            }
        });
        return response()->json([
            "Success Updated Co Broking"
        ]);

    }
}
