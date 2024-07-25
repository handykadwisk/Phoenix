<?php

namespace App\Http\Controllers;

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
                    'NAME' => $detail1['NAME'],
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
                    'NAME' => $detail2['NAME'],
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
                    'NAME' => $detail3['NAME'],
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
        print_r($arrData);
        // for ($i=0; $i < sizeof($data); $i++) { 
        //     print_r($data[0]);
        // }
        // foreach ($data as $key => $value) {
        //     // print_r($value);
        //     foreach ($value as $xx => $yy) {
        //         print_r($yy);
        //     }
        // }
        // foreach ($request as $key => $value) {
        //     print_r($key);
        //     print_r($value);
            
        //     // foreach ($value['income_detail'] as $details => $detail) {
        //     //     $tmpArr = [
        //     //         'INCOME_TYPE' => $detail['INCOME_TYPE'],
        //     //         'POLICY_ID' => $detail['POLICY_ID'],
        //     //         'NAME' => $detail['NAME'],
        //     //         'BROKERAGE_FEE_PERCENTAGE' => $detail['BROKERAGE_FEE_PERCENTAGE'],
        //     //         'BROKERAGE_FEE_AMOUNT' => $detail['BROKERAGE_FEE_AMOUNT'],
        //     //         'ENGINEERING_FEE_PERCENTAGE' => $detail['ENGINEERING_FEE_PERCENTAGE'],
        //     //         'ENGINEERING_FEE_AMOUNT' => $detail['ENGINEERING_FEE_AMOUNT'],
        //     //         'ADMIN_COST' => $detail['ADMIN_COST'],
        //     //         'CONSULTANCY_FEE_PERCENTAGE' => $detail['CONSULTANCY_FEE_PERCENTAGE'],
        //     //         'CONSULTANCY_FEE_AMOUNT' => $detail['CONSULTANCY_FEE_AMOUNT'],
        //     //     ];
        //     //     array_push($arrData, $tmpArr);
        //     // }
        // }
        // dd($arrData);
        // foreach ($request->input() as $key => $value) {
        //     $insured = MPolicyInsured::insertGetId([
        //         'POLICY_ID'             => $value['POLICY_ID'],
        //         'POLICY_INSURED_NAME'  => trim($value['POLICY_INSURED_NAME']),
        //     ]);
            
        //     foreach ($value['policy_insured_detail'] as $details => $detail) {
                
        //         $detail = MPolicyInsuredDetail::insertGetId([
        //             'POLICY_INSURED_ID' => $insured,
        //             'CURRENCY_ID' => $detail['CURRENCY_ID'],
        //             'POLICY_COVERAGE_ID' => $detail['POLICY_COVERAGE_ID'],
        //             'CONSULTANCY_FEE' => $detail['CONSULTANCY_FEE'],
        //             'PREMIUM_AMOUNT' => $detail['PREMIUM_AMOUNT'],
        //             'DISC_BF_PERCENTAGE' => $detail['DISC_BF_PERCENTAGE'],
        //             'DISC_BF_AMOUNT' => $detail['DISC_BF_AMOUNT'],
        //             'DISC_ADMIN_PERCENTAGE' => $detail['DISC_ADMIN_PERCENTAGE'],
        //             'DISC_ADMIN_AMOUNT' => $detail['DISC_ADMIN_AMOUNT'],
        //             'DISC_EF_PERCENTAGE' => $detail['DISC_EF_PERCENTAGE'],
        //             'DISC_EF_AMOUNT' => $detail['DISC_EF_AMOUNT'],
        //             'PREMIUM_TO_INSURED' => $detail['PREMIUM_TO_INSURED'],
        //         ]);
        //     }
        // }
        
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
            'Success Registered Coverage.'
            // $policy
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    
}
