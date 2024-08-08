<?php

namespace App\Http\Controllers;

use App\Models\InsurancePanel;
use App\Models\MPolicyInsured;
use App\Models\MPolicyInsuredDetail;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
                'ADMIN_COST'             => $value['POLICY_ADMIN_COST'],
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
                    // 'DISC_ADMIN_PERCENTAGE' => $detail['DISC_ADMIN_PERCENTAGE'],
                    // 'DISC_ADMIN_AMOUNT' => $detail['DISC_ADMIN_AMOUNT'],
                    'DISC_EF_PERCENTAGE' => $detail['DISC_EF_PERCENTAGE'],
                    'DISC_EF_AMOUNT' => $detail['DISC_EF_AMOUNT'],
                    'PREMIUM_TO_INSURED' => $detail['PREMIUM_TO_INSURED'],

                    // TAMBAHAN FIELD
                    'INTEREST_INSURED_ID' => $detail['INTEREST_INSURED_ID'],
                    'REMARKS' => $detail['REMARKS'],
                    'BF_FULL_AMOUNT' => $detail['BF_FULL_AMOUNT'],
                    'BF_NETT_AMOUNT' => $detail['BF_NETT_AMOUNT'],
                    'EF_FULL_AMOUNT' => $detail['EF_FULL_AMOUNT'],
                    'EF_NETT_AMOUNT' => $detail['EF_NETT_AMOUNT'],
                    'DISC_CF_PERCENTAGE' => $detail['DISC_CF_PERCENTAGE'],
                    'DISC_CF_AMOUNT' => $detail['DISC_CF_AMOUNT'],
                    'CF_NETT_AMOUNT' => $detail['CF_NETT_AMOUNT'],
                    'INCOME_NETT_AMOUNT' => $detail['INCOME_NETT_AMOUNT'],
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
        // dd($request);

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

        if ($request['deletedInsuredDetail']) {
            foreach ($request['deletedInsuredDetail'] as $del) {
                MPolicyInsuredDetail::where('POLICY_INSURED_DETAIL_ID', $del['POLICY_INSURED_DETAIL_ID'])->delete();
            }
        }

        return new JsonResponse([
            'Update Succeed'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getInsurerNettPremi(Request $request) {
        $query = DB::table('t_insurance_panel as ip')
                    ->select(DB::raw('ip.IP_ID, ip.POLICY_ID, ipc.INTEREST_INSURED_ID, ipc.REMARKS, ipc.POLICY_COVERAGE_ID, ipc.CURRENCY_ID, SUM(ipc.NETT_PREMI) AS INSURER_NETT_PREMIUM, SUM(ipc.BROKERAGE_FEE) AS BROKERAGE_FEE, SUM(ipc.ENGINEERING_FEE) AS ENGINEERING_FEE, SUM(ipc.CONSULTANCY_FEE) AS CONSULTANCY_FEE'))
                     ->leftJoin('m_insurer_coverage AS ipc', 'ip.IP_ID', '=', 'ipc.IP_ID')
            ->where('POLICY_ID', $request->input('policy_id'))
            ->groupBy('ipc.CURRENCY_ID', 'ipc.POLICY_COVERAGE_ID')
                     ->get();

        return response()->json($query);

    }

    public function getSummaryInsured(Request $request) {
        $query = DB::table('m_policy_insured as pii')
                    ->select(DB::raw('pii.POLICY_ID, pii.POLICY_INSURED_ID, pid.INTEREST_INSURED_ID, SUM(pid.BF_NETT_AMOUNT) AS BF_NETT_AMOUNT, SUM(pid.EF_NETT_AMOUNT) AS EF_NETT_AMOUNT, SUM(pid.CF_NETT_AMOUNT) AS CF_NETT_AMOUNT'))
                    ->leftJoin('m_policy_insured_detail AS pid', 'pii.POLICY_INSURED_ID', '=', 'pid.POLICY_INSURED_ID')
                    ->where('POLICY_ID', $request->input('policy_id'))
            // ->groupBy('ipc.CURRENCY_ID', 'ipc.POLICY_COVERAGE_ID')
                    ->get();

        return response()->json($query);

    }


}
