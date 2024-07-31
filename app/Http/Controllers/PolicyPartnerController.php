<?php

namespace App\Http\Controllers;

use App\Models\MPolicyPartners;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PolicyPartnerController extends Controller
{

    public function index()
    {
       
    }


    public function store(Request $request) {
        // dd($request);
        $data = $request->input();
        $data_fbi_pks = $data[0]['income_detail'];
        $data_agent_comm = $data[1]['income_detail'];
        $data_acquisition =$data[2]['income_detail'];
        // print_r($data_fbi_pks);
        $arrData = [];
        foreach ($data_fbi_pks as $details1 => $detail1) {
            // print_r($detail1);
            $tmpArr = [
                    'INCOME_TYPE' => $detail1['INCOME_TYPE'],
                    'POLICY_ID' => $detail1['POLICY_ID'],
                    'PARTNER_NAME' => $detail1['NAME'],
                    'BROKERAGE_FEE_PERCENTAGE' => $detail1['BROKERAGE_FEE_PERCENTAGE'],
                    'BROKERAGE_FEE_AMOUNT' => $detail1['BROKERAGE_FEE_AMOUNT'],
                    'ENGINEERING_FEE_PERCENTAGE' => $detail1['ENGINEERING_FEE_PERCENTAGE'],
                    'ENGINEERING_FEE_AMOUNT' => $detail1['ENGINEERING_FEE_AMOUNT'],
                    'ADMIN_COST' => $detail1['ADMIN_COST'],
                    'CONSULTANCY_FEE_PERCENTAGE' => $detail1['CONSULTANCY_FEE_PERCENTAGE'],
                    'CONSULTANCY_FEE_AMOUNT' => $detail1['CONSULTANCY_FEE_AMOUNT'],
                ];
                array_push($arrData, $tmpArr);
        }

        foreach ($data_agent_comm as $details2 => $detail2) {
            // print_r($detail2);
            $tmpArr2 = [
                    'INCOME_TYPE' => $detail2['INCOME_TYPE'],
                    'POLICY_ID' => $detail2['POLICY_ID'],
                    'PARTNER_NAME' => $detail2['NAME'],
                    'BROKERAGE_FEE_PERCENTAGE' => $detail2['BROKERAGE_FEE_PERCENTAGE'],
                    'BROKERAGE_FEE_AMOUNT' => $detail2['BROKERAGE_FEE_AMOUNT'],
                    'ENGINEERING_FEE_PERCENTAGE' => $detail2['ENGINEERING_FEE_PERCENTAGE'],
                    'ENGINEERING_FEE_AMOUNT' => $detail2['ENGINEERING_FEE_AMOUNT'],
                    'ADMIN_COST' => $detail2['ADMIN_COST'],
                    'CONSULTANCY_FEE_PERCENTAGE' => $detail2['CONSULTANCY_FEE_PERCENTAGE'],
                    'CONSULTANCY_FEE_AMOUNT' => $detail2['CONSULTANCY_FEE_AMOUNT'],
                ];
                array_push($arrData, $tmpArr2);
        }

        foreach ($data_acquisition as $details3 => $detail3) {
            // print_r($detail3);
            $tmpArr3 = [
                    'INCOME_TYPE' => $detail3['INCOME_TYPE'],
                    'POLICY_ID' => $detail3['POLICY_ID'],
                    'PARTNER_NAME' => $detail3['NAME'],
                    'BROKERAGE_FEE_PERCENTAGE' => $detail3['BROKERAGE_FEE_PERCENTAGE'],
                    'BROKERAGE_FEE_AMOUNT' => $detail3['BROKERAGE_FEE_AMOUNT'],
                    'ENGINEERING_FEE_PERCENTAGE' => $detail3['ENGINEERING_FEE_PERCENTAGE'],
                    'ENGINEERING_FEE_AMOUNT' => $detail3['ENGINEERING_FEE_AMOUNT'],
                    'ADMIN_COST' => $detail3['ADMIN_COST'],
                    'CONSULTANCY_FEE_PERCENTAGE' => $detail3['CONSULTANCY_FEE_PERCENTAGE'],
                    'CONSULTANCY_FEE_AMOUNT' => $detail3['CONSULTANCY_FEE_AMOUNT'],
                ];
                array_push($arrData, $tmpArr3);
        }
        // print_r($arrData);
        MPolicyPartners::insert($arrData);
        
        // UserLog::create([
        //     'created_by' => Auth::user()->id,
        //     'action'     => json_encode([
        //         "description" => "Add Coverage.",
        //         "module"      => "Add Coverage",
        //         // "id"          => $request->id
        //     ]),
        //     'action_by'  => Auth::user()->email
        // ]);
        
        return new JsonResponse([
            'Success Registered Partners.'
            // $policy
        ], 201, [
            'X-Inertia' => true
        ]);
    }

     public function getDataPartner($id) {       
        $query = MPolicyPartners::where('POLICY_ID', $id)->get();
        return response()->json($query);
    }

    public function editPartners(Request $request) {
        
        // dd($request);
        $data = $request->input();
        $data_fbi_pks = $data[0]['income_detail'];
        $data_agent_comm = $data[1]['income_detail'];
        $data_acquisition =$data[2]['income_detail'];
        // print_r($data_fbi_pks);
        $policy_id = "";
        $arrData = [];
        foreach ($data_fbi_pks as $details1 => $detail1) {
            // print_r($detail1);
            $tmpArr = [
                    'INCOME_TYPE' => $detail1['INCOME_TYPE'],
                    'POLICY_ID' => $detail1['POLICY_ID'],
                    'PARTNER_NAME' => $detail1['PARTNER_NAME'],
                    'BROKERAGE_FEE_PERCENTAGE' => $detail1['BROKERAGE_FEE_PERCENTAGE'],
                    'BROKERAGE_FEE_AMOUNT' => $detail1['BROKERAGE_FEE_AMOUNT'],
                    'ENGINEERING_FEE_PERCENTAGE' => $detail1['ENGINEERING_FEE_PERCENTAGE'],
                    'ENGINEERING_FEE_AMOUNT' => $detail1['ENGINEERING_FEE_AMOUNT'],
                    'ADMIN_COST' => $detail1['ADMIN_COST'],
                    'CONSULTANCY_FEE_PERCENTAGE' => $detail1['CONSULTANCY_FEE_PERCENTAGE'],
                    'CONSULTANCY_FEE_AMOUNT' => $detail1['CONSULTANCY_FEE_AMOUNT'],
                ];
                array_push($arrData, $tmpArr);
                $policy_id = $detail1['POLICY_ID'];
        }

        foreach ($data_agent_comm as $details2 => $detail2) {
            // print_r($detail2);
            $tmpArr2 = [
                    'INCOME_TYPE' => $detail2['INCOME_TYPE'],
                    'POLICY_ID' => $detail2['POLICY_ID'],
                    'PARTNER_NAME' => $detail2['PARTNER_NAME'],
                    'BROKERAGE_FEE_PERCENTAGE' => $detail2['BROKERAGE_FEE_PERCENTAGE'],
                    'BROKERAGE_FEE_AMOUNT' => $detail2['BROKERAGE_FEE_AMOUNT'],
                    'ENGINEERING_FEE_PERCENTAGE' => $detail2['ENGINEERING_FEE_PERCENTAGE'],
                    'ENGINEERING_FEE_AMOUNT' => $detail2['ENGINEERING_FEE_AMOUNT'],
                    'ADMIN_COST' => $detail2['ADMIN_COST'],
                    'CONSULTANCY_FEE_PERCENTAGE' => $detail2['CONSULTANCY_FEE_PERCENTAGE'],
                    'CONSULTANCY_FEE_AMOUNT' => $detail2['CONSULTANCY_FEE_AMOUNT'],
                ];
                array_push($arrData, $tmpArr2);
                $policy_id = $detail2['POLICY_ID'];
        }

        foreach ($data_acquisition as $details3 => $detail3) {
            // print_r($detail3);
            $tmpArr3 = [
                    'INCOME_TYPE' => $detail3['INCOME_TYPE'],
                    'POLICY_ID' => $detail3['POLICY_ID'],
                    'PARTNER_NAME' => $detail3['PARTNER_NAME'],
                    'BROKERAGE_FEE_PERCENTAGE' => $detail3['BROKERAGE_FEE_PERCENTAGE'],
                    'BROKERAGE_FEE_AMOUNT' => $detail3['BROKERAGE_FEE_AMOUNT'],
                    'ENGINEERING_FEE_PERCENTAGE' => $detail3['ENGINEERING_FEE_PERCENTAGE'],
                    'ENGINEERING_FEE_AMOUNT' => $detail3['ENGINEERING_FEE_AMOUNT'],
                    'ADMIN_COST' => $detail3['ADMIN_COST'],
                    'CONSULTANCY_FEE_PERCENTAGE' => $detail3['CONSULTANCY_FEE_PERCENTAGE'],
                    'CONSULTANCY_FEE_AMOUNT' => $detail3['CONSULTANCY_FEE_AMOUNT'],
                ];
                array_push($arrData, $tmpArr3);
                $policy_id = $detail3['POLICY_ID'];
        }
        // print_r($arrData);
        MPolicyPartners::where('POLICY_ID', $policy_id)->delete();
        MPolicyPartners::insert($arrData);
        // dd($data);
        return new JsonResponse([
            'Update Succeed'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    
}
