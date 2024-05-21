<?php

namespace App\Http\Controllers;

use App\Models\Installment;
use App\Models\InsurancePanel;
use App\Models\MPolicyInitialPremium;
use App\Models\Policy;
use App\Models\RInsuranceType;
use App\Models\UserLog;
// use Dotenv\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
// use Nette\Utils\Validators;

class InsurancePanelController extends Controller
{
    public function getInsurancPanelData ($dataPerPage = 10, $searchQuery = null) {
        
        // $data = InsurancePanel::orderBy('IP_ID', 'desc');
        $data = InsurancePanel::leftJoin('t_policy', 't_insurance_panel.POLICY_ID', '=', 't_policy.POLICY_ID')
        ->leftJoin('t_relation', 't_insurance_panel.INSURANCE_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')
        ->leftJoin('r_currency', 't_insurance_panel.IP_CURRENCY_ID', '=', 'r_currency.CURRENCY_ID')
        ->orderBy('IP_ID', 'desc');
        // dd($data->paginate(10));

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

        // dd($request);
        
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

    public function edit(Request $request, InsurancePanel $insurancePanel) {

        // dd($request);
        // $validateData = Validator::make($request->all(), [
        //     'POLICY_ID'                     =>  'required',
        //     // 'POLICY_INITIAL_PREMIUM_ID'     =>  'required', // Belum ada isi
        //     'IP_PREMIUM_TYPE'               =>  'required',
        //     'INSURANCE_ID'                  =>  'required',
        //     // 'IP_POLICY_LEADER'              =>  'required', // Belum ada isi
        //     // 'IP_CURRENCY_ID'                =>  'required', // Belum ada isi
        //     'IP_TERM'                       =>  'required',
        //     'IP_POLICY_INITIAL_PREMIUM'     =>  'required',
        //     'IP_POLICY_SHARE'               =>  'required',
        //     'IP_DISC_INSURANCE'             =>  'required',
        //     'IP_PIP_AFTER_DISC'             =>  'required',
        //     'IP_POLICY_BF'                  =>  'required',
        //     'IP_BF_AMOUNT'                  =>  'required',
        //     'IP_VAT'                        =>  'required',
        //     'IP_PPH_23'                     =>  'required',
        //     'IP_NET_BF'                     =>  'required',
        //     // 'IP_PAYMENT_METHOD'             =>  'required', // Belum ada isi
        //     // 'IP_VAT_AMOUNT'                 =>  'required', // Belum ada isi
        //     // 'IP_CREATED_BY'                 =>  'required',// Belum ada isi
            
        // ], [
        //     'required'                                        => ':attribute is required.',
        //     'installment.*.INSTALLMENT_TERM.required'        => 'Currency in Initial Premium is required.',
        //     // 'insurance_panel.*.insurance_panel_share.required' => 'Share in Insurance Panel is required.',
        // ]);
        
        $insurancePanel = InsurancePanel::where('IP_ID', $request->id)
                        ->update([
                            'POLICY_ID'                     => $request->POLICY_ID,
                            'POLICY_INITIAL_PREMIUM_ID'     => $request->POLICY_INITIAL_PREMIUM_ID, // Belum ada isi
                            'IP_PREMIUM_TYPE'               => $request->IP_PREMIUM_TYPE,
                            'INSURANCE_ID'                  => $request->INSURANCE_ID,
                            'IP_POLICY_LEADER'              => $request->IP_POLICY_LEADER, // Belum ada isi
                            'IP_CURRENCY_ID'                => $request->IP_CURRENCY_ID, // Belum ada isi
                            'IP_TERM'                       => $request->IP_TERM,
                            'IP_POLICY_INITIAL_PREMIUM'     => $request->IP_POLICY_INITIAL_PREMIUM,
                            'IP_POLICY_SHARE'               => $request->IP_POLICY_SHARE,
                            'IP_DISC_INSURANCE'             => $request->IP_DISC_INSURANCE,
                            'IP_PIP_AFTER_DISC'             => $request->IP_PIP_AFTER_DISC,
                            'IP_POLICY_BF'                  => $request->IP_POLICY_BF,
                            'IP_BF_AMOUNT'                  => $request->IP_BF_AMOUNT,
                            'IP_VAT'                        => $request->IP_VAT,
                            'IP_PPH_23'                     => $request->IP_PPH_23,
                            'IP_NET_BF'                     => $request->IP_NET_BF,
                            'IP_PAYMENT_METHOD'             => $request->IP_PAYMENT_METHOD, // Belum ada isi
                            'IP_VAT_AMOUNT'                 => $request->IP_VAT_AMOUNT, // Belum ada isi
                            'IP_UPDATED_BY'                 => Auth::user()->id,
                            'IP_UPDATED_DATE'               => now()
                        ]);
                        
        foreach ($request->installment as $req) {
            Installment::updateOrCreate(
                [
                    'INSTALLMENT_ID'    => $req['INSTALLMENT_ID']
                ],
                [
                    // 'INSURANCE_PANEL_ID'        => $insurancePanel,
                    'INSTALLMENT_TERM'          => $req['INSTALLMENT_TERM'], // Belum ada isi
                    'INSTALLMENT_PERCENTAGE'    => $req['INSTALLMENT_PERCENTAGE'],
                    'INSTALLMENT_DUE_DATE'      => $req['INSTALLMENT_DUE_DATE'],
                    'INSTALLMENT_AR'            => $req['INSTALLMENT_AR'],
                    'INSTALLMENT_AP'            => $req['INSTALLMENT_AP'],
                    'INSTALLMENT_GROSS_BF'      => $req['INSTALLMENT_GROSS_BF'],
                    'INSTALLMENT_VAT'           => $req['INSTALLMENT_VAT'],
                    'INSTALLMENT_PPH_23'        => $req['INSTALLMENT_PPH_23'],
                    'INSTALLMENT_NET_BF'        => $req['INSTALLMENT_NET_BF'],
                    'INSTALLMENT_ADMIN_COST'    => $req['INSTALLMENT_ADMIN_COST'],
                    'INSTALLMENT_POLICY_COST'   => $req['INSTALLMENT_POLICY_COST']
                ]
            );
        }
        
        if ($request->deleteInstallment) {
            foreach ($request->deleteInstallment as $del) {
                Installment::where('INSTALLMENT_ID', $del['INSTALLMENT_ID'])->delete();
            }
        }

        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Edit Insurance Panel.",
                "module"      => "Insurance Panel",
                "id"          => $request->id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            'Insurance Panel updated.'
        ], 200, [
            'X-Inertia' => true
        ]);

    }

}
