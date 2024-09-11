<?php

namespace App\Http\Controllers;

use App\Models\InsurancePanel;
use App\Models\MPolicyCoverage;
use App\Models\MPolicyCoverageDetail;
use App\Models\MPolicyPremium;
use App\Models\Policy;
use App\Models\PolicyInstallment;
use App\Models\RCurrency;
use App\Models\Relation;
use App\Models\RInsuranceType;
use App\Models\RInterestInsured;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PolicyCoverageController extends Controller
{

    public function index()
    {
       
    }

    public function store(Request $request) {

        foreach ($request->input() as $key => $value) {
            $coverage = MPolicyCoverage::insertGetId([
                'POLICY_ID'             => $value['POLICY_ID'],
                'POLICY_COVERAGE_NAME'  => trim($value['POLICY_COVERAGE_NAME']),
            ]);
            
            foreach ($value['policy_coverage_detail'] as $details => $detail) {                
                $detail = MPolicyCoverageDetail::insertGetId([
                    'POLICY_COVERAGE_ID' => $coverage,
                    'INTEREST_INSURED_ID' => $detail['INTEREST_INSURED_ID'],
                    'REMARKS' => $detail['REMARKS'],
                    'CURRENCY_ID' => $detail['CURRENCY_ID'],
                    'SUM_INSURED' => $detail['SUM_INSURED'],
                    'RATE' => $detail['RATE'],
                    'GROSS_PREMIUM' => $detail['GROSS_PREMIUM'],
                    'LOST_LIMIT_PERCENTAGE' => $detail['LOST_LIMIT_PERCENTAGE'],
                    'LOST_LIMIT_AMOUNT' => $detail['LOST_LIMIT_AMOUNT'],
                    'LOST_LIMIT_SCALE' => $detail['LOST_LIMIT_SCALE'],
                    'DEPOSIT_PREMIUM_PERCENTAGE' => $detail['DEPOSIT_PREMIUM_PERCENTAGE'],
                    'DEPOSIT_PREMIUM_AMOUNT' => $detail['DEPOSIT_PREMIUM_AMOUNT'],
                    'INSURANCE_DISC_PERCENTAGE' => $detail['INSURANCE_DISC_PERCENTAGE'],
                    'INSURANCE_DISC_AMOUNT' => $detail['INSURANCE_DISC_AMOUNT'],
                    'PREMIUM' => $detail['PREMIUM'],
                ]);
            }
        }
        
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Add Coverage.",
                "module"      => "Add Coverage",
            ]),
            'action_by'  => Auth::user()->email
        ]);
        
        return new JsonResponse([
            "msg" => "Success Registered Coverage.",
            "id" => $request->id
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function editCoverage(Request $request) {

        $insurerCoverage = MPolicyCoverage::where('POLICY_COVERAGE_ID', $request['POLICY_COVERAGE_ID'])
            ->update([
                'POLICY_COVERAGE_NAME'  => trim($request['POLICY_COVERAGE_NAME'])
            ]);

        foreach ($request['policy_coverage_detail'] as $key => $detail) {
            
            if ($detail['POLICY_COVERAGE_DETAIL_ID']) {
                // jika ada POLICY_COVERAGE_DETAIL_ID maka update
                $coverageDetail = MPolicyCoverageDetail::where('POLICY_COVERAGE_DETAIL_ID', $detail['POLICY_COVERAGE_DETAIL_ID'])
                    ->update([
                        'INTEREST_INSURED_ID' => $detail['INTEREST_INSURED_ID'],
                        'REMARKS' => $detail['REMARKS'],
                        'CURRENCY_ID' => $detail['CURRENCY_ID'],
                        'SUM_INSURED' => $detail['SUM_INSURED'],
                        'RATE' => $detail['RATE'],
                        'GROSS_PREMIUM' => $detail['GROSS_PREMIUM'],
                        'LOST_LIMIT_PERCENTAGE' => $detail['LOST_LIMIT_PERCENTAGE'],
                        'LOST_LIMIT_AMOUNT' => $detail['LOST_LIMIT_AMOUNT'],
                        'LOST_LIMIT_SCALE' => $detail['LOST_LIMIT_SCALE'],
                        'DEPOSIT_PREMIUM_PERCENTAGE' => $detail['DEPOSIT_PREMIUM_PERCENTAGE'],
                        'DEPOSIT_PREMIUM_AMOUNT' => $detail['DEPOSIT_PREMIUM_AMOUNT'],
                        'INSURANCE_DISC_PERCENTAGE' => $detail['INSURANCE_DISC_PERCENTAGE'],
                        'INSURANCE_DISC_AMOUNT' => $detail['INSURANCE_DISC_AMOUNT'],
                        'PREMIUM' => $detail['PREMIUM'],
                    ]);
            } else {
                // jika Tidak ada POLICY_COVERAGE_DETAIL_ID maka Insert
                $coverageDetail = MPolicyCoverageDetail::insertGetId([
                    'POLICY_COVERAGE_ID' => $detail['POLICY_COVERAGE_ID'],
                    'INTEREST_INSURED_ID' => $detail['INTEREST_INSURED_ID'],
                    'REMARKS' => $detail['REMARKS'],
                    'CURRENCY_ID' => $detail['CURRENCY_ID'],
                    'SUM_INSURED' => $detail['SUM_INSURED'],
                    'RATE' => $detail['RATE'],
                    'GROSS_PREMIUM' => $detail['GROSS_PREMIUM'],
                    'LOST_LIMIT_PERCENTAGE' => $detail['LOST_LIMIT_PERCENTAGE'],
                    'LOST_LIMIT_AMOUNT' => $detail['LOST_LIMIT_AMOUNT'],
                    'LOST_LIMIT_SCALE' => $detail['LOST_LIMIT_SCALE'],
                    'DEPOSIT_PREMIUM_PERCENTAGE' => $detail['DEPOSIT_PREMIUM_PERCENTAGE'],
                    'DEPOSIT_PREMIUM_AMOUNT' => $detail['DEPOSIT_PREMIUM_AMOUNT'],
                    'INSURANCE_DISC_PERCENTAGE' => $detail['INSURANCE_DISC_PERCENTAGE'],
                    'INSURANCE_DISC_AMOUNT' => $detail['INSURANCE_DISC_AMOUNT'],
                    'PREMIUM' => $detail['PREMIUM'],
                ]);
            }
        }

        if ($request['deletedCoverageDetail']) {
            foreach ($request['deletedCoverageDetail'] as $del) {
                MPolicyCoverageDetail::where('POLICY_COVERAGE_DETAIL_ID', $del['POLICY_COVERAGE_DETAIL_ID'])->delete();
            }
        }

        return new JsonResponse([
            "msg" => "Success Edit Coverage.",
            "id" => $request->id
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_by_policy_id($id) {
        
        $data = MPolicyCoverage::leftJoin('m_policy_coverage_detail', 'm_policy_coverage.POLICY_COVERAGE_ID', '=', 'm_policy_coverage_detail.POLICY_COVERAGE_ID')
                ->where('m_policy_coverage.POLICY_ID', $id)
                ->orderBy('m_policy_coverage.POLICY_COVERAGE_NAME', 'ASC')
                ->get();

        return response()->json($data);

    }

    public function getInterestInsured() {
        $data = RInterestInsured::get();
        return response()->json($data);
    }

     public function getCoverageGroupingByPolicyId($id) {
        
        $data = MPolicyCoverage::leftJoin('m_policy_coverage_detail', 'm_policy_coverage.POLICY_COVERAGE_ID', '=', 'm_policy_coverage_detail.POLICY_COVERAGE_ID')
                ->select('m_policy_coverage.*')
                ->where('m_policy_coverage.POLICY_ID', $id)
                ->orderBy('m_policy_coverage.POLICY_COVERAGE_NAME', 'ASC')
                ->groupBy('m_policy_coverage.POLICY_COVERAGE_ID')
                ->get();

        return response()->json($data);

    }

    public function getDataCoverage($id) {
       
        $data = MPolicyCoverage::where('POLICY_ID', $id)->orderBy('POLICY_COVERAGE_NAME', 'ASC')->get();
        return response()->json($data);

    }

     public function getCoverageById($id) {
         
        $data = MPolicyCoverage::find($id);
        return response()->json($data);

    }

    public function edit(Request $request) {
       
        $validateData = Validator::make(
            // Data
            $request->all(), [
            // Rule
            'POLICY_NUMBER'              => 'required',
            'RELATION_ID'                => 'required',
            'INSURANCE_TYPE_ID'            => 'required',
            'POLICY_STATUS_ID'            => 'required',
        ], [
            // Message
            'POLICY_NUMBER.required'          => 'Policy Number is required.',
            'RELATION_ID.required'          => 'Client Name is required.',
            'INSURANCE_TYPE_ID.required'          => 'Insurance Type is required.',
            'POLICY_STATUS_ID.required'          => 'Policy Status is required.',
        ]);

        $totalRateInstallment = collect($request->policy_installment)->sum('POLICY_INSTALLMENT_PERCENTAGE');
        if ($totalRateInstallment != 100) {
            return new JsonResponse([
                ['Rate Installment must equal to 100 %.']
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        
        $policy = Policy::where('policy_id', $request->id)
                        ->update([
                            'RELATION_ID'           => $request->RELATION_ID,
                            'POLICY_NUMBER'         => trim($request->POLICY_NUMBER),
                            'INSURANCE_TYPE_ID'     => $request->INSURANCE_TYPE_ID,
                            'POLICY_THE_INSURED'    => $request->POLICY_THE_INSURED,
                            'POLICY_INCEPTION_DATE' => $request->POLICY_INCEPTION_DATE,
                            'POLICY_DUE_DATE'       => $request->POLICY_DUE_DATE,
                            'POLICY_STATUS_ID'      => $request->POLICY_STATUS_ID,
                            'SELF_INSURED'          => $request->SELF_INSURED,
                            'POLICY_UPDATED_BY'      => Auth::user()->id,
                            'POLICY_UPDATED_DATE'   => now()
                        ]);
                        
        foreach ($request->policy_premium as $req) {
            
            MPolicyPremium::updateOrCreate(
                [
                    'POLICY_INITIAL_PREMIUM_ID'    => $req['POLICY_INITIAL_PREMIUM_ID']
                ],
                [
                    'POLICY_ID' => $req['POLICY_ID'],
                    'CURRENCY_ID' => $req['CURRENCY_ID'],
                    'COVERAGE_NAME' => $req['COVERAGE_NAME'],
                    'GROSS_PREMI' => $req['GROSS_PREMI'],
                    'ADMIN_COST' => $req['ADMIN_COST'],
                    'DISC_BROKER' => $req['DISC_BROKER'],
                    'DISC_CONSULTATION' => $req['DISC_CONSULTATION'],
                    'DISC_ADMIN' => $req['DISC_ADMIN'],
                    'NETT_PREMI' => $req['NETT_PREMI'],
                    'FEE_BASED_INCOME' => $req['FEE_BASED_INCOME'],
                    'AGENT_COMMISION' => $req['AGENT_COMMISION'],
                    'ACQUISITION_COST' => $req['ACQUISITION_COST'],
                    'UPDATED_BY' => Auth::user()->id,
                    'UPDATED_DATE' => now()
                ]
            );
        }
        
        if ($request->deletedPolicyPremium) {
            foreach ($request->deletedPolicyPremium as $del) {
                MPolicyPremium::where('POLICY_INITIAL_PREMIUM_ID', $del['policy_initial_premium_id'])->delete();
            }
        }

        foreach ($request->policy_installment as $req2) {
            PolicyInstallment::updateOrCreate(
                [
                    'POLICY_INSTALLMENT_ID'    => $req2['POLICY_INSTALLMENT_ID']
                ],
                [
                    'POLICY_ID' => $req2['POLICY_ID'],
                    'POLICY_INSTALLMENT_TERM' => $req2['POLICY_INSTALLMENT_TERM'],
                    'POLICY_INSTALLMENT_PERCENTAGE' => $req2['POLICY_INSTALLMENT_PERCENTAGE'],
                    'INSTALLMENT_DUE_DATE' => $req2['INSTALLMENT_DUE_DATE']
                ]
            );
        }
        
        if ($request->deletedInstallment) {
            foreach ($request->deletedInstallment as $del2) {
                PolicyInstallment::where('POLICY_INSTALLMENT_ID', $del2['POLICY_INSTALLMENT_ID'])->delete();
            }
        }

        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Edit policy.",
                "module"      => "Policy",
                "id"          => $request->id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            // 'Policy updated.'
            $request->id
        ], 200, [
            'X-Inertia' => true
        ]);

    }
}
