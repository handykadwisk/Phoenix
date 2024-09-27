<?php

namespace App\Http\Controllers;

use App\Models\MPolicyCoBroking;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function store(Request $request)
    {        
        // dd($request->input());
        $arrCoBrokingId = [];
        foreach ($request->input() as $key => $value) {
            $data = [
                'POLICY_ID' => $value["POLICY_ID"],
                'RELATION_ID' => $value["RELATION_ID"],
                'CO_BROKING_PERCENTAGE' => $value["CO_BROKING_PERCENTAGE"],
                'CO_BROKING_IS_LEADER' => $value["CO_BROKING_IS_LEADER"]
            ];
            if (array_key_exists('CO_BROKING_ID', $value) && $value['CO_BROKING_ID'] != "") {
                echo "update";
                $coBroking = $this->getCoBrokingByCoBrokingId($value['CO_BROKING_ID']);
                MPolicyCoBroking::where('CO_BROKING_ID', $value['CO_BROKING_ID'])->update($data);
                $id = $value['CO_BROKING_ID'];
            } else {
                echo "insert";
                $id = MPolicyCoBroking::insertGetId($data);
            }
            // $coBroking = $this->getCoBrokingByCoBrokingId($value['CO_BROKING_ID']);
            // if ($coBroking) {
            //     MPolicyCoBroking::where('CO_BROKING_ID', $value['CO_BROKING_ID'])->update($data);
            //     $id = $value['CO_BROKING_ID'];
            //     // ->delete();
            // } else {
            //     $id = MPolicyCoBroking::insertGetId($data);
            // }

            array_push($arrCoBrokingId, $id);
        }  
      
        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created/Update (Co Broking).",
                "module"      => "Co Broking",
                "id"          => $arrCoBrokingId
            ]),
            'action_by'  => Auth::user()->id
        ]);

        return new JsonResponse([
            // $attendanceSetting
            "msg" => "Success Updated Co Broking"
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
