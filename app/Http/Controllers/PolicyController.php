<?php

namespace App\Http\Controllers;

use App\Models\InsurancePanel;
use App\Models\MPolicyPremium;
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

class PolicyController extends Controller
{

    public function checkPolicyNumber ($policyNumber) {
        $policy = Policy::where('POLICY_NUMBER', $policyNumber)->get();
        return $policy;
    }

    public function getPolicyData ($dataPerPage = 10, $searchQuery = null) {
        $data = Policy::orderBy('policy_inception_date', 'desc')
                     ->orderBy('policy_due_date', 'desc')
                   ->whereNull('POLICY_IS_DELETED');

        if ($searchQuery) {
            if ($searchQuery['policy_number']) {
                $data->where('POLICY_NUMBER', 'like', '%'.$searchQuery["policy_number"].'%');
            }
            if ($searchQuery['client_id']) {
                $data->where('RELATION_ID', $searchQuery["client_id"]);
            }
        }
        return $data->paginate($dataPerPage);
    }

    public function detailPolicy($policy_id=null){
        return Inertia::render('Policy/PolicyDetail', [
            'policy' => Policy::find($policy_id),
            'insurance' => DB::table('t_relation')
                ->leftJoin('m_relation_type', 't_relation.RELATION_ORGANIZATION_ID', '=', 'm_relation_type.RELATION_ORGANIZATION_ID')
                ->where('RELATION_TYPE_ID', '=', 1)
                ->get(),
            'listPolicyPremium' => MPolicyPremium::leftJoin('t_policy', 'm_policy_premium.POLICY_ID', '=', 't_policy.POLICY_ID')
                ->leftJoin('r_currency', 'm_policy_premium.CURRENCY_ID', '=', 'r_currency.CURRENCY_ID')
                ->where('t_policy.POLICY_ID', $policy_id)
                ->orderBy('m_policy_premium.POLICY_ID', 'desc')
                ->get(),
            'insurancePanels' => InsurancePanel::where('POLICY_ID', $policy_id)->get()
        ]);
    }

    public function index()
    {
        $policy = Policy::leftJoin('t_relation', 't_policy.RELATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')
        ->leftJoin('r_insurance_type', 't_policy.INSURANCE_TYPE_ID', '=', 'r_insurance_type.INSURANCE_TYPE_ID')
        ->orderBy('t_policy.POLICY_ID', 'desc')
        ->get();

        return Inertia::render('Policy/Index', [
            'policy' => $policy,
            'currency' => RCurrency::get(),
            'insuranceType' => RInsuranceType::where('INSURANCE_TYPE_STATUS', '=', 1)->get(),
            'clients' => DB::table('t_relation')
                ->leftJoin('m_relation_type', 't_relation.RELATION_ORGANIZATION_ID', '=', 'm_relation_type.RELATION_ORGANIZATION_ID')
                ->where('RELATION_TYPE_ID', '=', 1)
                ->get(),
            'insurance' => DB::table('t_relation')
                ->leftJoin('m_relation_type', 't_relation.RELATION_ORGANIZATION_ID', '=', 'm_relation_type.RELATION_ORGANIZATION_ID')
                ->where('RELATION_TYPE_ID', '=', 2)
                ->get()
        ]);
    }

    public function getPolicyDataForJSON(Request $request) {
        $data = $this->getPolicyData(10, $request);
        return response()->json($data);
    }

    public function store(Request $request) {

        $validateData = Validator::make(
            // Data
            $request->all(), [
            // Rule
            'policy_number'              => 'required|string',
            'relation_id'                => 'required|string',
            'insurance_type_id'            => 'required',
            'policy_status_id'            => 'required',
        ], [
            // Message
            'relation_id.required'          => 'Client Name is required.',
            'relation_id.required'          => 'Client Name is required.',
            'insurance_type_id.required'          => 'Insurance Type is required.',
            'policy_status_id.required'          => 'Policy Status is required.',
        ]);

        if (trim($request->policy_number)) {
            $cekPolicy = $this->checkPolicyNumber(trim($request->policy_number));
            if (sizeof($cekPolicy) > 0) {
                // tidak bisa save karna sudah ada number policy
                return new JsonResponse([
                    ['Policy Number '.$request->policy_number.' already exist']
                ], 422, [
                    'X-Inertia' => true
                ]);
            }
        }
        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }        
        
        // Create Policy
        $policy = Policy::insertGetId([
            'RELATION_ID'           => $request->relation_id,
            'POLICY_NUMBER'         => trim($request->policy_number),
            'INSURANCE_TYPE_ID'     => $request->insurance_type_id,
            'POLICY_THE_INSURED'    => $request->policy_the_insured,
            'POLICY_INCEPTION_DATE' => $request->policy_inception_date,
            'POLICY_DUE_DATE'       => $request->policy_due_date,
            'POLICY_STATUS_ID'      => $request->policy_status_id,
            'SELF_INSURED'          => $request->self_insured,
            'POLICY_CREATED_BY'      => Auth::user()->id
        ]);

        
        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Policy).",
                "module"      => "Policy",
                "id"          => $policy
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $policy
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_id($id) {
         
        $data = Policy::find($id);
        return response()->json($data);

    }

    public function getRelationById($id) {
        $data = Relation::find($id);
        return response()->json($data);
    }

    function getCurrencyOnPolicyCoverage($policy_id) {
        $query = DB::table('m_policy_coverage_detail as pcd')
            ->select('c.*')
            ->leftJoin('m_policy_coverage as pc', 'pcd.POLICY_COVERAGE_ID', '=', 'pc.POLICY_COVERAGE_ID')
            ->leftJoin('r_currency AS c', 'pcd.CURRENCY_ID', '=', 'c.CURRENCY_ID')
            ->where('pc.POLICY_ID', $policy_id)
            ->groupBy('pcd.CURRENCY_ID')
            ->get();
            return response()->json($query);
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

        
        if (trim($request->POLICY_NUMBER)) {
            $cekPolicy = $this->checkPolicyNumber(trim($request->POLICY_NUMBER));
            if (sizeof($cekPolicy) > 1) {
                // tidak bisa save karna sudah ada number policy
                return new JsonResponse([
                    ['Policy Number '.$request->POLICY_NUMBER.' already exist']
                ], 422, [
                    'X-Inertia' => true
                ]);
            }
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
            $request->id
        ], 200, [
            'X-Inertia' => true
        ]);

    }

    public function deactivate (Request $request) {

        $updatingData = Policy::where('POLICY_ID', $request->id)
                              ->update([
                                'POLICY_IS_DELETED'      => 1,
                                'POLICY_IS_DELETED_BY'   => Auth::user()->id,
                                'POLICY_IS_DELETED_DATE' => now()
                              ]);
        
        if ($updatingData) {

            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Deactivate policy.",
                    "module"      => "Policy",
                    "id"          => $request->id
                ]),
                'action_by'  => Auth::user()->email
            ]);
            
            return new JsonResponse([
                'status' => true
            ], 201, [
                'X-Inertia' => true
            ]);
        }

    }
}
