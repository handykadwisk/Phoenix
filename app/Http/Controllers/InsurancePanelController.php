<?php

namespace App\Http\Controllers;

use App\Models\Installment;
use App\Models\InsurancePanel;
use App\Models\MPolicyInitialPremium;
use App\Models\Policy;
use App\Models\RInsuranceType;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InsurancePanelController extends Controller
{
    public function getInsurancPanelData ($dataPerPage = 10, $searchQuery = null) {
        
        $data = InsurancePanel::orderBy('IP_ID', 'desc');

        if ($searchQuery) {
            // if ($searchQuery->input('policy_number')) {
            //     $data->where('policy_number', 'like', '%'.$searchQuery->policy_number.'%');
            // }
            // if ($searchQuery->input('policy_insurance_type_name')) {
            //     $data->where('policy_insurance_type_name', 'like', '%'.$searchQuery->policy_insurance_type_name.'%');
            // }
            // if ($searchQuery->input('policy_broker_name')) {
            //     $data->where('policy_broker_name', 'like', '%'.$searchQuery->policy_broker_name.'%');
            // }
            // if ($searchQuery->input('policy_inception_date')) {
            //     $data->where('policy_inception_date', $searchQuery->policy_inception_date);
            // }
            // if ($searchQuery->input('policy_due_date')) {
            //     $data->where('policy_due_date', $searchQuery->policy_due_date);
            // }
            // if ($searchQuery->input('policy_status_id')) {
            //     $data->where('policy_status_id', $searchQuery->policy_status_id);
            // }
        }
        // dd($data->paginate($dataPerPage));
        return $data->paginate($dataPerPage);

    }
    
    public function initialPremium($id=null) {
        $query = MPolicyInitialPremium::leftJoin('t_policy', 'm_policy_initial_premium.POLICY_ID', '=', 't_policy.POLICY_ID')
        ->leftJoin('r_currency', 'm_policy_initial_premium.CURRENCY_ID', '=', 'r_currency.CURRENCY_ID');
        if ($id) {
            $query->where('m_policy_initial_premium.policy_initial_premium_id', '=', $id);
        }
        return $query->orderBy('m_policy_initial_premium.POLICY_ID', 'desc')
        ->get();
    }


    public function index()
    {        
        // dd($policyIinitialPremium->toArray());
        return Inertia::render('InsurancePanel/Index', [
            'listInitialPremium' => $this->initialPremium(),
            // 'currency' => RCurrency::get(),
            // 'insuranceType' => RInsuranceType::where('INSURANCE_TYPE_STATUS', '=', 1)->get(),
            'insurance' => DB::table('t_relation')
                ->leftJoin('m_relation_type', 't_relation.RELATION_ORGANIZATION_ID', '=', 'm_relation_type.RELATION_ORGANIZATION_ID')
                ->where('RELATION_TYPE_ID', '=', 1)
                ->get()
        ]);
    }

    public function getInsurancePanelJson(Request $request) {
// dd('xxx');
        $data = $this->getInsurancPanelData(10, $request);
        return response()->json($data);

    }

    public function store(Request $request) {

        dd($request);
        
        // Create Policy
        $insurancePanel = InsurancePanel::insertGetId([

            // 'IP_ID',
            'POLICY_ID'                     => $request->policy_id,
            'POLICY_INITIAL_PREMIUM_ID'     => $request->policy_initial_premium_id, // Belum ada isi
            'IP_PREMIUM_TYPE'               => $request->ip_premium_type,
            'INSURANCE_ID'                  => $request->insurance_id,
            'IP_POLICY_LEADER'              => $request->ip_policy_leader, // Belum ada isi
            'IP_CURRENCY_ID'                => $request->ip_currency_id, // Belum ada isi
            'IP_TERM'                       => $request->ip_term,
            'IP_POLICY_INITIAL_PREMIUM'     => $request->ip_policy_initial_premium,
            'IP_POLICY_SHARE'               => $request->ip_policy_share,
            'IP_DISC_INSURANCE'             => $request->ip_disc_insurance,
            'IP_PIP_AFTER_DISC'             => $request->ip_pip_after_disc,
            'IP_POLICY_BF'                  => $request->ip_policy_bf,
            'IP_BF_AMOUNT'                  => $request->ip_bf_amount,
            'IP_VAT'                        => $request->ip_vat,
            'IP_PPH_23'                     => $request->ip_pph_23,
            'IP_NET_BF'                     => $request->ip_net_bf,
            'IP_PAYMENT_METHOD'             => $request->ip_payment_method, // Belum ada isi
            'IP_VAT_AMOUNT'                 => $request->ip_vat_amount, // Belum ada isi
            'IP_CREATED_BY'                 => Auth::user()->id

        ]);

        // Create Initial Premium
        $installmentData = [];
        foreach ($request->installment as $req) {
            $installmentData[] = [

                // 'INSTALLMENT_ID',
                'INSURANCE_PANEL_ID'        => $insurancePanel,
                'INSTALLMENT_TERM'          => $req['installment_term'], // Belum ada isi
                'INSTALLMENT_PERCENTAGE'    => $req['installment_percentage'],
                'INSTALLMENT_DUE_DATE'      => $req['installment_due_date'],
                'INSTALLMENT_AR'            => $req['installment_ar'],
                'INSTALLMENT_AP'            => $req['installment_ap'],
                'INSTALLMENT_GROSS_BF'      => $req['installment_gross_bf'],
                'INSTALLMENT_VAT'           => $req['installment_vat'],
                'INSTALLMENT_PPH_23'        => $req['installment_pph_23'],
                'INSTALLMENT_NET_BF'        => $req['installment_net_bf'],
                'INSTALLMENT_ADMIN_COST'    => $req['installment_admin_cost'],
                'INSTALLMENT_POLICY_COST'   => $req['installment_policy_cost']
            ];
        };
        Installment::insert($installmentData);
        // $policy->policyInitialPremium()->saveMany($initialPremiumData);

         // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Insurance Panel).",
                "module"      => "Insurance Panel",
                "id"          => $insurancePanel
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            'Insurance Panel Success Added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_id($id) {
        
        $data = InsurancePanel::find($id);
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

}
