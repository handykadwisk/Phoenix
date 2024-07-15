<?php

namespace App\Http\Controllers;

use App\Models\InsurancePanel;
use App\Models\MPolicyCoverage;
use App\Models\MPolicyPremium;
// use App\Models\MPolicyPremium;
use App\Models\Policy;
use App\Models\PolicyInstallment;
use App\Models\RCurrency;
use App\Models\Relation;
use App\Models\RInsuranceType;
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
        // dd($request->POLICY_ID);

        $validateData = Validator::make(
            // Data
            $request->all(), [
            // Rule
            'POLICY_COVERAGE_NAME'              => 'required|string',
        ], [
            // Message
            'POLICY_COVERAGE_NAME.required'          => 'Coverage Name is required.',
        ]);
        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }        
        
        // Create Policy Coverage
        $policy = MPolicyCoverage::insertGetId([
            'POLICY_ID'             => $request->POLICY_ID,
            'POLICY_COVERAGE_NAME'  => trim($request->POLICY_COVERAGE_NAME),
        ]);
        
        return new JsonResponse([
            // 'New Policy added.'
            $policy
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function editManyCoverage(Request $request) {

        foreach ($request->input() as $key => $value) {
            $insurerCoverage = MPolicyCoverage::where('POLICY_COVERAGE_ID', $value['POLICY_COVERAGE_ID'])
                    ->update([
                        'POLICY_COVERAGE_NAME'  => trim($value['POLICY_COVERAGE_NAME'])
                    ]);
        }

        return new JsonResponse([
            'Update Succeed'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_by_policy_id($id) {
         
        $data = MPolicyCoverage::where('POLICY_ID', $id)->get();
        // dd($data);
        // $data = $this->getPolice($id);
        return response()->json($data);

    }

    // public function edit(Request $request, MPolicyPremium $insurancePanel) {
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
                            // 'POLICY_INSURANCE_PANEL' => $request->POLICY_INSURANCE_PANEL,
                            // 'POLICY_SHARE'          => $policy_share,
                            // 'POLICY_INSTALLMENT'          => $request->POLICY_INSTALLMENT,
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
