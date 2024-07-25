<?php

namespace App\Http\Controllers;

use App\Models\MPolicyInsured;
use App\Models\MPolicyInsuredDetail;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PolicyInsuredController extends Controller
{
    public function index()
    {
       
    }


    public function store(Request $request) {
        // dd($request);
        foreach ($request->input() as $key => $value) {
            $insured = MPolicyInsured::insertGetId([
                'POLICY_ID'             => $value['POLICY_ID'],
                'POLICY_INSURED_NAME'  => trim($value['POLICY_INSURED_NAME']),
            ]);
            
            foreach ($value['policy_insured_detail'] as $details => $detail) {
                
                $detail = MPolicyInsuredDetail::insertGetId([
                    'POLICY_INSURED_ID' => $insured,
                    'CURRENCY_ID' => $detail['CURRENCY_ID'],
                    'POLICY_COVERAGE_ID' => $detail['POLICY_COVERAGE_ID'],
                    'CONSULTANCY_FEE' => $detail['CONSULTANCY_FEE'],
                    'PREMIUM_AMOUNT' => $detail['PREMIUM_AMOUNT'],
                    'DISC_BF_PERCENTAGE' => $detail['DISC_BF_PERCENTAGE'],
                    'DISC_BF_AMOUNT' => $detail['DISC_BF_AMOUNT'],
                    'DISC_ADMIN_PERCENTAGE' => $detail['DISC_ADMIN_PERCENTAGE'],
                    'DISC_ADMIN_AMOUNT' => $detail['DISC_ADMIN_AMOUNT'],
                    'DISC_EF_PERCENTAGE' => $detail['DISC_EF_PERCENTAGE'],
                    'DISC_EF_AMOUNT' => $detail['DISC_EF_AMOUNT'],
                    'PREMIUM_TO_INSURED' => $detail['PREMIUM_TO_INSURED'],
                ]);
            }
        }
        
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Add Coverage.",
                "module"      => "Add Coverage",
                // "id"          => $request->id
            ]),
            'action_by'  => Auth::user()->email
        ]);
        
        return new JsonResponse([
            'Success Registered Coverage.'
            // $policy
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getDataInsured($id) {       
        $data = MPolicyInsured::where('POLICY_ID', $id)->get();
        // dd($data);
        return response()->json($data);
    }

     public function getInsuredById($id) {         
        $data = MPolicyInsured::find($id);
        return response()->json($data);
    }

    public function editInsured(Request $request) {
        // dd($request['POLICY_COVERAGE_NAME']);

        $insured = MPolicyInsured::where('POLICY_INSURED_ID', $request['POLICY_INSURED_ID'])
            ->update([
                'POLICY_INSURED_NAME'  => trim($request['POLICY_INSURED_NAME'])
            ]);

        foreach ($request['policy_insured_detail'] as $key => $detail) {
            
            if ($detail['POLICY_INSURED_DETAIL_ID']) {
                // jika ada POLICY_INSURED_DETAIL_ID maka update
                $coverageDetail = MPolicyInsuredDetail::where('POLICY_INSURED_DETAIL_ID', $detail['POLICY_INSURED_DETAIL_ID'])
                    ->update([
                        'CURRENCY_ID' => $detail['CURRENCY_ID'],
                        'POLICY_COVERAGE_ID' => $detail['POLICY_COVERAGE_ID'],
                        'CONSULTANCY_FEE' => $detail['CONSULTANCY_FEE'],
                        'PREMIUM_AMOUNT' => $detail['PREMIUM_AMOUNT'],
                        'DISC_BF_PERCENTAGE' => $detail['DISC_BF_PERCENTAGE'],
                        'DISC_BF_AMOUNT' => $detail['DISC_BF_AMOUNT'],
                        'DISC_ADMIN_PERCENTAGE' => $detail['DISC_ADMIN_PERCENTAGE'],
                        'DISC_ADMIN_AMOUNT' => $detail['DISC_ADMIN_AMOUNT'],
                        'DISC_EF_PERCENTAGE' => $detail['DISC_EF_PERCENTAGE'],
                        'DISC_EF_AMOUNT' => $detail['DISC_EF_AMOUNT'],
                        'PREMIUM_TO_INSURED' => $detail['PREMIUM_TO_INSURED'],
                    ]);
            } else {
                // jika Tidak ada POLICY_INSURED_DETAIL_ID maka Insert
                $coverageDetail = MPolicyInsuredDetail::insertGetId([
                    'POLICY_INSURED_ID' => $detail['POLICY_INSURED_ID'],
                    'CURRENCY_ID' => $detail['CURRENCY_ID'],
                    'POLICY_COVERAGE_ID' => $detail['POLICY_COVERAGE_ID'],
                    'CONSULTANCY_FEE' => $detail['CONSULTANCY_FEE'],
                    'PREMIUM_AMOUNT' => $detail['PREMIUM_AMOUNT'],
                    'DISC_BF_PERCENTAGE' => $detail['DISC_BF_PERCENTAGE'],
                    'DISC_BF_AMOUNT' => $detail['DISC_BF_AMOUNT'],
                    'DISC_ADMIN_PERCENTAGE' => $detail['DISC_ADMIN_PERCENTAGE'],
                    'DISC_ADMIN_AMOUNT' => $detail['DISC_ADMIN_AMOUNT'],
                    'DISC_EF_PERCENTAGE' => $detail['DISC_EF_PERCENTAGE'],
                    'DISC_EF_AMOUNT' => $detail['DISC_EF_AMOUNT'],
                    'PREMIUM_TO_INSURED' => $detail['PREMIUM_TO_INSURED'],
                ]);
            }
        }

        if ($request['deletedCoverageDetail']) {
            foreach ($request['deletedCoverageDetail'] as $del) {
                MPolicyInsuredDetail::where('POLICY_COVERAGE_DETAIL_ID', $del['POLICY_COVERAGE_DETAIL_ID'])->delete();
            }
        }

        return new JsonResponse([
            'Update Succeed'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

}
