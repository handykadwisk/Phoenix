<?php

namespace App\Http\Controllers;

use App\Models\MPolicyInitialPremium;
use App\Models\Policy;
use App\Models\RCurrency;
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
    public function getPolicyData ($dataPerPage = 10, $searchQuery = null) {
        // print_r('aaa');
        // if ($searchQuery) {
        //     print_r('aaa');
        // } else {
        //     print_r('xxx');
        // }
        // dd($searchQuery->input());
        $data = Policy::orderBy('policy_inception_date', 'desc')
                     ->orderBy('policy_due_date', 'desc');

        if ($searchQuery) {
            if ($searchQuery->input('policy_number')) {
                $data->where('policy_number', 'like', '%'.$searchQuery->policy_number.'%');
            }
            if ($searchQuery->input('policy_insurance_type_name')) {
                $data->where('policy_insurance_type_name', 'like', '%'.$searchQuery->policy_insurance_type_name.'%');
            }
            if ($searchQuery->input('policy_broker_name')) {
                $data->where('policy_broker_name', 'like', '%'.$searchQuery->policy_broker_name.'%');
            }
            if ($searchQuery->input('policy_inception_date')) {
                $data->where('policy_inception_date', $searchQuery->policy_inception_date);
            }
            if ($searchQuery->input('policy_due_date')) {
                $data->where('policy_due_date', $searchQuery->policy_due_date);
            }
            if ($searchQuery->input('policy_status_id')) {
                $data->where('policy_status_id', $searchQuery->policy_status_id);
            }
        }
// dd($data->paginate($dataPerPage));
        return $data->paginate($dataPerPage);

    }
    // public function getPolice($policy_id=null){
    //     $query = Policy::leftJoin('t_relation', 't_policy.RELATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')
    //     ->leftJoin('r_insurance_type', 't_policy.INSURANCE_TYPE_ID', '=', 'r_insurance_type.INSURANCE_TYPE_ID');
    //     if ($policy_id) {
    //         $query->where('t_policy.POLICY_ID', '=', $policy_id);
    //     }
    //     $result = $query->orderBy('t_policy.POLICY_ID', 'desc')->get();
    //     return $result;
    // }
    public function index()
    {
        // $policy = Policy::get();
        $policy = Policy::leftJoin('t_relation', 't_policy.RELATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')
        ->leftJoin('r_insurance_type', 't_policy.INSURANCE_TYPE_ID', '=', 'r_insurance_type.INSURANCE_TYPE_ID')
        ->orderBy('t_policy.POLICY_ID', 'desc')
        ->get();
        // dd($policy);

        // dd(RInsuranceType::where('INSURANCE_TYPE_STATUS', '=', 1)->get());

        return Inertia::render('Policy/Index', [
            'policy' => $policy,
            'currency' => RCurrency::get(),
            'insuranceType' => RInsuranceType::where('INSURANCE_TYPE_STATUS', '=', 1)->get(),
            'insurance' => DB::table('t_relation')
                ->leftJoin('m_relation_type', 't_relation.RELATION_ORGANIZATION_ID', '=', 'm_relation_type.RELATION_ORGANIZATION_ID')
                ->where('RELATION_TYPE_ID', '=', 1)
                ->get()
        ]);
    }

    public function getPolicyDataForJSON(Request $request) {

        // $collection = collect(Policy::get());

        // $data = $collection->sortBy([
        //     ['policy_inception_date', 'desc'],
        //     ['policy_due_date', 'desc']
        // ]);
        // return response()->json($data->values()->all());

        $data = $this->getPolicyData(10, $request);
        return response()->json($data);

    }

    public function store(Request $request) {

        // dd($request);
        
        // Create Policy
        $policy = Policy::insertGetId([
            'RELATION_ID'           => $request->relation_id,
            'POLICY_NUMBER'         => $request->policy_number,
            'INSURANCE_TYPE_ID'     => $request->insurance_type_id,
            'POLICY_THE_INSURED'    => $request->policy_the_insured,
            'POLICY_INCEPTION_DATE' => $request->policy_inception_date,
            'POLICY_DUE_DATE'       => $request->policy_due_date,
            'POLICY_STATUS_ID'      => $request->policy_status_id,
            'POLICY_INSURANCE_PANEL' => $request->policy_insurance_panel,
            'POLICY_SHARE'          => $request->policy_share,
            'POLICY_CREATED_BY'      => Auth::user()->id
        ]);

        // Create Initial Premium
        $initialPremiumData = [];
        foreach ($request->initialPremium as $req) {
            $initialPremiumData[] = [
                'POLICY_ID' => $policy,
                'CURRENCY_ID' => $req['currency_id'],
                'SUM_INSURED' => $req['sum_insured'],
                'RATE' => $req['rate'],
                'INITIAL_PREMIUM' => $req['initial_premium'],
                'INSTALLMENT' => $req['installment'],
                'CREATED_BY' => Auth::user()->id
            ];
        };
        MPolicyInitialPremium::insert($initialPremiumData);
        // $policy->policyInitialPremium()->saveMany($initialPremiumData);

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
            'New Policy added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_id($id) {
         
        $data = Policy::find($id);
        // $data = $this->getPolice($id);
        return response()->json($data);

    }

    public function edit(Request $request, MPolicyInitialPremium $insurancePanel) {

        $validateData = Validator::make($request->all(), [
            'RELATION_ID'           => 'required',
            'POLICY_NUMBER'         => 'required',
            'INSURANCE_TYPE_ID'     => 'required',
            'POLICY_THE_INSURED'    => 'required|string',
            'POLICY_INCEPTION_DATE' => 'required|date',
            'POLICY_DUE_DATE'       => 'required|date',
            'POLICY_INSURANCE_PANEL' => 'required|number',
            'POLICY_SHARE'          => 'required|number',
            'policy_initial_premium.*.CURRENCY_ID'        => 'required',
        ], [
            'required'                                        => ':attribute is required.',
            'policy_initial_premium.*.CURRENCY_ID.required'        => 'Currency in Initial Premium is required.',
            // 'insurance_panel.*.insurance_panel_share.required' => 'Share in Insurance Panel is required.',
        ]);
        
        $policy = Policy::where('policy_id', $request->id)
                        ->update([
                            'RELATION_ID'           => $request->RELATION_ID,
                            'POLICY_NUMBER'         => $request->POLICY_NUMBER,
                            'INSURANCE_TYPE_ID'     => $request->INSURANCE_TYPE_ID,
                            'POLICY_THE_INSURED'    => $request->POLICY_THE_INSURED,
                            'POLICY_INCEPTION_DATE' => $request->POLICY_INCEPTION_DATE,
                            'POLICY_DUE_DATE'       => $request->POLICY_DUE_DATE,
                            'POLICY_STATUS_ID'      => $request->POLICY_STATUS_ID,
                            'POLICY_INSURANCE_PANEL' => $request->POLICY_INSURANCE_PANEL,
                            'POLICY_SHARE'          => $request->POLICY_SHARE,
                            'POLICY_UPDATED_BY'      => Auth::user()->id,
                            'POLICY_UPDATED_DATE'   => now()
                        ]);
                        
        foreach ($request->policy_initial_premium as $req) {
            MPolicyInitialPremium::updateOrCreate(
                [
                    'POLICY_INITIAL_PREMIUM_ID'    => $req['POLICY_INITIAL_PREMIUM_ID']
                ],
                [
                    'POLICY_ID' => $req['POLICY_ID'],
                    'CURRENCY_ID' => $req['CURRENCY_ID'],
                    'SUM_INSURED' => $req['SUM_INSURED'],
                    'RATE' => $req['RATE'],
                    'INITIAL_PREMIUM' => $req['INITIAL_PREMIUM'],
                    'INSTALLMENT' => $req['INSTALLMENT'],
                    'UPDATED_BY' => Auth::user()->id,
                    'UPDATED_DATE' => now()
                ]
            );
        }
        
        if ($request->deletedInitialPremium) {
            foreach ($request->deletedInitialPremium as $del) {
                MPolicyInitialPremium::where('POLICY_INITIAL_PREMIUM_ID', $del['policy_initial_premium_id'])->delete();
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
            'Policy updated.'
        ], 200, [
            'X-Inertia' => true
        ]);

    }

    public function deactivate (Request $request) {

        // $validateData = Validator::make($request->all(), [
        //     'notes'    => 'required'
        // ], [
        //     'required' => ':attribute is required.'
        // ]);

        // if ($validateData->fails()) {
        //     return new JsonResponse([
        //         $validateData->errors()->all()
        //     ], 422, [
        //         'X-Inertia' => true
        //     ]);
        // }

        $updatingData = Policy::where('POLICY_ID', $request->id)
                              ->update([
                                'POLICY_STATUS_ID'       => 3
                                // 'policy_is_deleted'      => 1,
                                // 'policy_is_deleted_note' => $request->notes,
                                // 'policy_is_deleted_by'   => Auth::user()->name,
                                // 'policy_is_deleted_date' => now()
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
                'Policy deactivated.'
            ], 201, [
                'X-Inertia' => true
            ]);
        }

    }
}
