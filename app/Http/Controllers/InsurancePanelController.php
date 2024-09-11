<?php

namespace App\Http\Controllers;

use App\Models\Installment;
use App\Models\InsurancePanel;
use App\Models\MEndorsementPremium;
use App\Models\MInsurerCoverage;
use App\Models\MPolicyPremium;
use App\Models\Policy;
use App\Models\PolicyInstallment;
use App\Models\RInsuranceType;
use App\Models\UserLog;
// use Dotenv\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Psy\VersionUpdater\Installer;

// use Nette\Utils\Validators;

class InsurancePanelController extends Controller
{
    public function getInsurancPanelData ($dataPerPage = 10, $searchQuery = null) {

        $data = InsurancePanel::orderBy('IP_ID', 'desc')->whereNull('IP_IS_DELETED');
        
        if ($searchQuery) {
            if ($searchQuery->input('policy_id')) {
                $data->where('POLICY_ID', $searchQuery->policy_id);
            }
            if ($searchQuery->input('client_id')) {
                $data->where('INSURANCE_ID', $searchQuery->client_id);
            }
        }
        return $data->paginate($dataPerPage);

    }

    public function getCurrency(Request $request) {
        if ($request->endorsement_id) {
            // cari addtional premium ke endorsement
            $data = MEndorsementPremium::select('CURRENCY_ID')->where('ENDORSEMENT_ID', $request->endorsement_id)->groupBy('CURRENCY_ID')->get();
        } else {
            $data = MPolicyPremium::select('CURRENCY_ID')->where('POLICY_ID', $request->policy_id)->groupBy('CURRENCY_ID')->get();
        }
        return response()->json($data);
    }

    public function getPremium(Request $request) {
        if ($request->endorsement_id) {
            // cari addtional premium ke endorsement
            $data = MEndorsementPremium::where('ENDORSEMENT_ID', $request->endorsement_id)->get();
        } else {
            $data = MPolicyPremium::where('POLICY_ID', $request->policy_id)->get();
        }
        return response()->json($data);
    }

    public function getPremiumById(Request $request) {
        // dd($request->premium_type);

        if ($request->premium_type == "additional") {
            $data = MEndorsementPremium::find($request->policy_iniital_premium_id);
        } else {
            $data = MPolicyPremium::find($request->policy_iniital_premium_id);
        }
        
        // $data = MPolicyPremium::find($request->policy_iniital_premium_id);
        return response()->json($data);

    }

    public function getPremiumByCurrency(Request $request) {
        if ($request->premium_type == "additional") {
            $data = MEndorsementPremium::where('ENDORSEMENT_ID', $request->id)
            ->where('CURRENCY_ID', $request->currency_id)
            ->get();
        } else {
            $data = MPolicyPremium::where('POLICY_ID', $request->id)
            ->where('CURRENCY_ID', $request->currency_id)
            ->get();
        }
        //  config()->set('database.connections.mysql.strict', false);
        // DB::reconnect(); //important 

        // if ($request->premium_type == "additional") {
        //     $data = MEndorsementPremium::select('m_endorsement_premium.*')->where('ENDORSEMENT_ID', $request->id)->where('CURRENCY_ID', $request->currency_id)->groupBy('CURRENCY_ID')->get();
        // } else {
        //     $data = MPolicyPremium::select('sum(GROSS_PREMI) as GROSS_PREMI, sum(ADMIN_COST) as ADMIN_COST, sum(DISC_BROKER) as DISC_BROKER, sum(DISC_CONSULTATION) as DISC_CONSULTATION, sum(DISC_ADMIN) as DISC_ADMIN, sum(NETT_PREMI) as NETT_PREMI, sum(FEE_BASED_INCOME) as FEE_BASED_INCOME, sum(AGENT_COMMISION) as AGENT_COMMISION, sum(ACQUISITION_COST) as ACQUISITION_COST,')
        //     ->where('POLICY_ID', $request->id)
        //     ->where('CURRENCY_ID', $request->currency_id)
        //     ->groupBy('CURRENCY_ID')
        //     ->get();
        // }
        // //now changing back the strict ON
        // config()->set('database.connections.mysql.strict', true);
        // DB::reconnect();
        return response()->json($data);
    }

    public function getInsurancePanelByPremiumId($id) {
        
        $data = InsurancePanel::where('POLICY_INITIAL_PREMIUM_ID', $id)->get();
        // dd(response()->json($data));
        return response()->json($data);

    }

    public function policyInstallment($id) {
        
        $data = PolicyInstallment::where('POLICY_ID',$id)->get();
        // dd(response()->json($data));
        return response()->json($data);

    }

    public function getPolicyBeforeInsurancePanel()
    {
        $policyIds = InsurancePanel::select('POLICY_ID')->whereNotNull('POLICY_ID');
 
        $policies = Policy::whereNotIn('POLICY_ID', $policyIds)->get();
        return $policies;
    }

    public function index()
    {        
        $listInitialPremium = MPolicyPremium::leftJoin('t_policy', 'm_policy_premium.POLICY_ID', '=', 't_policy.POLICY_ID')
                ->leftJoin('r_currency', 'm_policy_premium.CURRENCY_ID', '=', 'r_currency.CURRENCY_ID')
                ->orderBy('m_policy_premium.POLICY_ID', 'desc')
                ->get();
        // dd($this->getPolicyBeforeInsurancePanel());
        return Inertia::render('InsurancePanel/Index', [
            'policies' => Policy::get(), //$this->getPolicyBeforeInsurancePanel(),
            'listInitialPremium' => $listInitialPremium,
            // 'currency' => RCurrency::get(),
            // 'insuranceType' => RInsuranceType::where('INSURANCE_TYPE_STATUS', '=', 1)->get(),
            'insurance' => DB::table('t_relation')
                ->leftJoin('m_relation_type', 't_relation.RELATION_ORGANIZATION_ID', '=', 'm_relation_type.RELATION_ORGANIZATION_ID')
                ->where('RELATION_TYPE_ID', '=', 1)
                ->get(),
            'insurancePanels' => InsurancePanel::get()
        ]);
    }

    public function getInsurancePanelJson(Request $request) {
        // dd($request->policy_number);
        $data = $this->getInsurancPanelData(10, $request);
        return response()->json($data);

    }

    public function insertManyInsurer(Request $request) {
        
        foreach ($request->input() as $req => $value) {
            $insurancePanel = InsurancePanel::insertGetId([
                'POLICY_ID'         => $value['POLICY_ID'], // Belum ada isi
                'INSURANCE_ID'       => $value['INSURANCE_ID'],
                'IP_POLICY_SHARE'   => $value['IP_POLICY_SHARE'],
                'IP_POLICY_LEADER'  => $value['IP_POLICY_LEADER'],
                'POLICY_COST'       => $value['POLICY_COST'],
                'IP_CURRENCY_ID'    => $value['IP_CURRENCY_ID'],
                'IP_CREATED_BY'     => Auth::user()->id
            ]);

            foreach ($value['premium'] as $key => $cover) {
                $insurerCoverage = MInsurerCoverage::insertGetId([
                    'IP_ID'             =>  $insurancePanel,
                    'INTEREST_INSURED_ID'  => $cover['INTEREST_INSURED_ID'], // Belum ada isi
                    'REMARKS'  => $cover['REMARKS'],
                    'BROKERAGE_FEE_PERCENTAGE'  => $cover['BROKERAGE_FEE_PERCENTAGE'],
                    'BROKERAGE_FEE'  => $cover['BROKERAGE_FEE'],
                    'BROKERAGE_FEE_VAT' => $cover['BROKERAGE_FEE_VAT'],
                    'BROKERAGE_FEE_PPN' => $cover['BROKERAGE_FEE_PPN'],
                    'BROKERAGE_FEE_PPH' => $cover['BROKERAGE_FEE_PPH'],
                    'BROKERAGE_FEE_NETT_AMOUNT' => $cover['BROKERAGE_FEE_NETT_AMOUNT'],
                    // 'CONSULTANCY_FEE'  => $cover['CONSULTANCY_FEE'],
                    'COVERAGE_NAME'  => $cover['COVERAGE_NAME'],
                    'CURRENCY_ID'  => $cover['CURRENCY_ID'],
                    // 'DISC_ADMIN'  => $cover['DISC_ADMIN'],
                    // 'DISC_BROKER'  => $cover['DISC_BROKER'],
                    'ENGINEERING_FEE_PERCENTAGE'  => $cover['ENGINEERING_FEE_PERCENTAGE'],
                    'ENGINEERING_FEE'  => $cover['ENGINEERING_FEE'],
                    'ENGINEERING_FEE_VAT' => $cover['ENGINEERING_FEE_VAT'],
                    'ENGINEERING_FEE_PPN' => $cover['ENGINEERING_FEE_PPN'],
                    'ENGINEERING_FEE_PPH' => $cover['ENGINEERING_FEE_PPH'],
                    'ENGINEERING_FEE_NETT_AMOUNT' => $cover['ENGINEERING_FEE_NETT_AMOUNT'],
                    'CONSULTANCY_FEE'  => $cover['CONSULTANCY_FEE'],
                    'CONSULTANCY_FEE_VAT' => $cover['CONSULTANCY_FEE_VAT'],
                    'CONSULTANCY_FEE_PPN' => $cover['CONSULTANCY_FEE_PPN'],
                    'CONSULTANCY_FEE_PPH' => $cover['CONSULTANCY_FEE_PPH'],
                    'CONSULTANCY_FEE_NETT_AMOUNT' => $cover['CONSULTANCY_FEE_NETT_AMOUNT'],
                    'GROSS_PREMI'  => $cover['GROSS_PREMI'],
                    'NETT_PREMI'  => $cover['NETT_PREMI'],
                    'POLICY_COVERAGE_ID'  => $cover['POLICY_COVERAGE_ID']
                ]);
            }
        }

        
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Add Insurer.",
                "module"      => "Add Insurer",
                "id"          => $request->id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            "msg" => "Success Add Insurer",
            "id" => $request->id
        ], 200, [
            'X-Inertia' => true
        ]);

    }

    public function editManyInsurer(Request $request) {
        // dd($request->input());
        foreach ($request->input() as $req => $value) {
            $insurer = InsurancePanel::where('IP_ID', $value['IP_ID'])
                        ->update([
                            'POLICY_ID'         => $value['POLICY_ID'], 
                            'INSURANCE_ID'      => $value['INSURANCE_ID'],
                            'IP_POLICY_SHARE'   => $value['IP_POLICY_SHARE'],
                            'IP_POLICY_LEADER'  => $value['IP_POLICY_LEADER'],
                            'POLICY_COST'       => $value['POLICY_COST'],
                            'IP_CURRENCY_ID'    => $value['IP_CURRENCY_ID'],
                            'IP_UPDATED_BY'     => Auth::user()->id,
                            'IP_UPDATED_DATE'   => now()
                        ]);
            foreach ($value['premium'] as $key => $cover) {
                $insurerCoverage = MInsurerCoverage::where('INSURER_COVERAGE_ID', $cover['INSURER_COVERAGE_ID'])
                        ->update([

                            // 'ACQUISITION_COST'  => $cover['ACQUISITION_COST'], 
                            // 'ADMIN_COST'  => $cover['ADMIN_COST'],
                            // 'AGENT_COMMISION'  => $cover['AGENT_COMMISION'],
                            'INTEREST_INSURED_ID'  => $cover['INTEREST_INSURED_ID'], // Belum ada isi
                            'REMARKS'  => $cover['REMARKS'],
                            'BROKERAGE_FEE_PERCENTAGE'  => $cover['BROKERAGE_FEE_PERCENTAGE'],
                            'BROKERAGE_FEE'  => $cover['BROKERAGE_FEE'],
                            'BROKERAGE_FEE_VAT' => $cover['BROKERAGE_FEE_VAT'],
                            'BROKERAGE_FEE_PPN' => $cover['BROKERAGE_FEE_PPN'],
                            'BROKERAGE_FEE_PPH' => $cover['BROKERAGE_FEE_PPH'],
                            'BROKERAGE_FEE_NETT_AMOUNT' => $cover['BROKERAGE_FEE_NETT_AMOUNT'],
                            // 'CONSULTANCY_FEE'  => $cover['CONSULTANCY_FEE'],
                            'COVERAGE_NAME'  => $cover['COVERAGE_NAME'],
                            'CURRENCY_ID'  => $cover['CURRENCY_ID'],
                            // 'DISC_ADMIN'  => $cover['DISC_ADMIN'],
                            // 'DISC_BROKER'  => $cover['DISC_BROKER'],
                            // 'DISC_CONSULTATION'  => $cover['DISC_CONSULTATION'],
                            'ENGINEERING_FEE_PERCENTAGE'  => $cover['ENGINEERING_FEE_PERCENTAGE'],
                            'ENGINEERING_FEE'  => $cover['ENGINEERING_FEE'],
                            'ENGINEERING_FEE_VAT' => $cover['ENGINEERING_FEE_VAT'],
                            'ENGINEERING_FEE_PPN' => $cover['ENGINEERING_FEE_PPN'],
                            'ENGINEERING_FEE_PPH' => $cover['ENGINEERING_FEE_PPH'],
                            'ENGINEERING_FEE_NETT_AMOUNT' => $cover['ENGINEERING_FEE_NETT_AMOUNT'],
                            'CONSULTANCY_FEE'  => $cover['CONSULTANCY_FEE'],
                            'CONSULTANCY_FEE_VAT' => $cover['CONSULTANCY_FEE_VAT'],
                            'CONSULTANCY_FEE_PPN' => $cover['CONSULTANCY_FEE_PPN'],
                            'CONSULTANCY_FEE_PPH' => $cover['CONSULTANCY_FEE_PPH'],
                            'CONSULTANCY_FEE_NETT_AMOUNT' => $cover['CONSULTANCY_FEE_NETT_AMOUNT'],
                            // 'FEE_BASED_INCOME'  => $cover['FEE_BASED_INCOME'],
                            'GROSS_PREMI'  => $cover['GROSS_PREMI'],
                            'NETT_PREMI'  => $cover['NETT_PREMI'],
                            'POLICY_COVERAGE_ID'  => $cover['POLICY_COVERAGE_ID']
                        ]);
            }
        }

        
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Edit Insurer.",
                "module"      => "Edit Insurer",
                "id"          => $request->id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            "msg" => "Success Edit Insurer",
            "id" => $request->id
        ], 200, [
            'X-Inertia' => true
        ]);

    }

    public function store(Request $request) {

        // dd($request);        
        // Create Policy
        $insurancePanel = InsurancePanel::insertGetId([

            // 'IP_ID',
            'POLICY_ID'                     => $request->policy_id,
            'ENDORSEMENT_ID'                => $request->endorsement_id,
            'POLICY_INITIAL_PREMIUM_ID'     => $request->policy_initial_premium_id, // Belum ada isi
            'IP_PREMIUM_TYPE'               => $request->ip_premium_type,
            'INSURANCE_ID'                  => $request->insurance_id,
            'IP_POLICY_LEADER'              => $request->ip_policy_leader, // Belum ada isi
            'IP_CURRENCY_ID'                => $request->ip_currency_id, // Belum ada isi
            'ENGINEERING_FEE'               => $request->engineering_fee,
            'IP_POLICY_INITIAL_PREMIUM'     => $request->ip_policy_initial_premium ? $request->ip_policy_initial_premium : 0,
            'IP_POLICY_SHARE'               => $request->ip_policy_share,
            'IP_DISC_INSURANCE'             => 0,//$request->ip_disc_insurance,
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
                'IP_ID'        => $insurancePanel,
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
            // 'Insurance Panel Success Added.'
            $insurancePanel
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_id($id) {
        
        $data = InsurancePanel::find($id);
        return response()->json($data);

    }

    public function getInsurancPanelByPolicyId($policy_id) {
        $data = InsurancePanel::where('POLICY_ID', $policy_id)->get();
        return response()->json($data);        
    }

    public function edit(Request $request) {

        // print_r($request);
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
                            'ENDORSEMENT_ID'                => $request->ENDORSEMENT_ID,
                            'POLICY_INITIAL_PREMIUM_ID'     => $request->POLICY_INITIAL_PREMIUM_ID, // Belum ada isi
                            'IP_PREMIUM_TYPE'               => $request->IP_PREMIUM_TYPE,
                            'INSURANCE_ID'                  => $request->INSURANCE_ID,
                            'IP_POLICY_LEADER'              => $request->IP_POLICY_LEADER, // Belum ada isi
                            'IP_CURRENCY_ID'                => $request->IP_CURRENCY_ID, // Belum ada isi
                            'ENGINEERING_FEE'               => $request->ENGINEERING_FEE,
                            'IP_POLICY_INITIAL_PREMIUM'     => $request->IP_POLICY_INITIAL_PREMIUM,
                            'IP_POLICY_SHARE'               => $request->IP_POLICY_SHARE,
                            'IP_DISC_INSURANCE'             => 0, //$request->IP_DISC_INSURANCE,
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

        // $checkInstallment = Installment::find($request['INSTALLMENT_ID']);
                        
        foreach ($request->installment as $req) {
            
            // jika bukan baris baru, maka update
            if ($req['INSTALLMENT_ID']) {
                Installment::where('INSTALLMENT_ID', $req['INSTALLMENT_ID'])
                ->update([
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
                ]);                
            } else {
                // jika baris baru, maka insert
                Installment::create([
                    'IP_ID'                     => $request->id,
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
                ]);
            }
            
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

    public function deactivate (Request $request) {

        // dd($request);
        $updatingData = InsurancePanel::where('IP_ID', $request->id)
                              ->update([
                                'IP_IS_DELETED'      => 1,
                                'IP_IS_DELETED_BY'   => Auth::user()->id,
                                'IP_IS_DELETED_DATE' => now()
                              ]);
        
        if ($updatingData) {

            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Deactivate Insurer.",
                    "module"      => "Insurer",
                    "id"          => $request->id
                ]),
                'action_by'  => Auth::user()->email
            ]);
            
            return new JsonResponse([
                // 'Endorsement deactivated.'
                'status' => true
            ], 201, [
                'X-Inertia' => true
            ]);
        }

    }

    public function destroy($ip_id) {

        // cek CN atau DN
        $cekCnDn = true;
        if ($cekCnDn) {
            //  jika sudah ada DN atau CN, maka gabisa hapus
            $msg = "Failed deleted Insurer because existing DN or CN";
            $status = false;
        } else {
            // jika belum ada DN atau CN, maka insurer bisa dihapus
            InsurancePanel::where('IP_ID', $ip_id)->delete();
            Installment::where('IP_ID', $ip_id)->delete();            
            $msg= "Successfull deleted Insurer";
            $status = true;
        }        
        
        return new JsonResponse([
            'status' => $status,
            'msg'   => $msg
        ], 201, [
            'X-Inertia' => true
        ]);

    }

}
