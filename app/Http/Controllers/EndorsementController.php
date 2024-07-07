<?php

namespace App\Http\Controllers;

use App\Models\Endorsement;
use App\Models\MEndorsementInstallment;
use App\Models\MEndorsementPremium;
use App\Models\Policy;
use App\Models\RCurrency;
use App\Models\REndorsementType;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class EndorsementController extends Controller
{
    public function checkEndorsementNumber ($endorsementNumber) {
        $endorsement = Endorsement::where('ENDORSEMENT_NUMBER', $endorsementNumber)->get();
        return $endorsement;
    }
    
    public function index()
    {       
        return Inertia::render('Endorsement/Index', [
            'listPolicy' => Policy::get(),
            'currency' => RCurrency::get(),
            'endorsementTypes' => REndorsementType::get(),
        ]);
    }

    public function store(Request $request) {     

         $validateData = Validator::make(
            // Data
            $request->all(), [
            // Rule
            'policy_id'              => 'required',
            'endorsement_number'     => 'required|string',
            'endorsement_type_id'    => 'required|string',
            'endorsement_status'     => 'required',
        ], [
            // Message
            'endorsement_type_id.required'  => 'Endorsement Type is required.',
            'endorsement_status.required'   => 'Endorsement Status is required.',
            'policy_id.required'            => 'Number Policy is required.',
        ]);

        $totalRateInstallment = collect($request->endorsementInstallment)->sum('endorsement_installment_rate');
        if ($totalRateInstallment != 100) {
            return new JsonResponse([
                ['Rate Installment must equal to 100 %.']
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        if (trim($request->endorsement_number)) {
            $cekEndorsement = $this->checkEndorsementNumber(trim($request->endorsement_number));
            if (sizeof($cekEndorsement) > 0) {
                // tidak bisa save karna sudah ada number policy
                return new JsonResponse([
                    ['Endorsement Number '.$request->endorsement_number.' already exist']
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

        // Create Endorsement
        $endorsement = Endorsement::insertGetId([
            'POLICY_ID'                     => $request->policy_id,
            'ENDORSEMENT_NUMBER'            => trim($request->endorsement_number),
            'ENDORSEMENT_STATUS'            => $request->endorsement_status,
            'ENDORSEMENT_EFFECTIVE_DATE'    => $request->endorsement_effective_date,
            'SELF_INSURED'                  => $request->self_insured,
            'ENDORSEMENT_TYPE_ID'           => $request->endorsement_type_id,
            'ENDORSEMENT_NOTE'              => $request->endorsement_note,
            'ENDORSEMENT_CREATED_BY'        => Auth::user()->id
        ]);

        if ($request->endorsementPremium) {
             // Create Additional Premium
            $endorsementPremiumData = [];
            foreach ($request->endorsementPremium as $req) {
                $endorsementPremiumData[] = [
                    'ENDORSEMENT_ID'        => $endorsement,
                    'CURRENCY_ID'           => $req['currency_id'],
                    // 'SUM_INSURED'           => $req['sum_insured'],
                    // 'RATE'                  => $req['rate'],
                    // 'ADDITIONAL_PREMIUM'    => $req['additional_premium'],
                    'COVERAGE_NAME' => $req['coverage_name'],
                    'GROSS_PREMI' => $req['gross_premi'],
                    'ADMIN_COST' => $req['admin_cost'],
                    'DISC_BROKER' => $req['disc_broker'],
                    'DISC_CONSULTATION' => $req['disc_consultation'],
                    'DISC_ADMIN' => $req['disc_admin'],
                    'NETT_PREMI' => $req['nett_premi'],
                    'FEE_BASED_INCOME' => $req['fee_based_income'],
                    'AGENT_COMMISION' => $req['agent_commision'],
                    'ACQUISITION_COST' => $req['acquisition_cost'],
                    'CREATED_BY'            => Auth::user()->id
                ];
            };
            MEndorsementPremium::insert($endorsementPremiumData);
        }

        if ($request->endorsementInstallment) {
            // Create Endorsement Installment
            $endorsementInstallmentData = [];
            foreach ($request->endorsementInstallment as $req) {
                $endorsementInstallmentData[] = [
                    'ENDORSEMENT_ID' => $endorsement,
                    'ENDORSEMENT_INSTALLMENT_TERM' => $req['endorsement_installment_term'],
                    'ENDORSEMENT_INSTALLMENT_RATE' => $req['endorsement_installment_rate'],
                    'ENDORSEMENT_INSTALLMENT_DUE_DATE' => $req['endorsement_installment_due_date']
                ];
            };
            MEndorsementInstallment::insert($endorsementInstallmentData);
        }
        

         // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Endorsement).",
                "module"      => "Endorsement",
                "id"          => $endorsement
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            // 'New Endorsement added.'
            $endorsement
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function edit(Request $request) {

         $validateData = Validator::make(
            // Data
            $request->all(), [
            // Rule
            'POLICY_ID'              => 'required',
            'ENDORSEMENT_NUMBER'     => 'required|string',
            'ENDORSEMENT_TYPE_ID'    => 'required',
            'ENDORSEMENT_STATUS'     => 'required',
        ], [
            // Message
            'ENDORSEMENT_TYPE_ID.required'  => 'Endorsement Type is required.',
            'ENDORSEMENT_STATUS.required'   => 'Endorsement Status is required.',
            'POLICY_ID.required'            => 'Number Policy is required.',
        ]);

        $totalRateInstallment = collect($request->endorsement_installment)->sum('ENDORSEMENT_INSTALLMENT_RATE');
        if ($totalRateInstallment != 100) {
            return new JsonResponse([
                ['Rate Installment must equal to 100 %.']
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        // if (trim($request->ENDORSEMENT_NUMBER)) {
        //     $cekEndorsement = $this->checkEndorsementNumber(trim($request->ENDORSEMENT_NUMBER));
        //     if (sizeof($cekEndorsement) > 0) {
        //         // tidak bisa save karna sudah ada number policy
        //         return new JsonResponse([
        //             ['Endorsement Number '.$request->ENDORSEMENT_NUMBER.' already exist']
        //         ], 422, [
        //             'X-Inertia' => true
        //         ]);
        //     }
        // }
        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        $endorsement = Endorsement::where('ENDORSEMENT_ID', $request->id)
                        ->update([
                            'POLICY_ID'                  => $request->POLICY_ID,
                            'ENDORSEMENT_NUMBER'         => trim($request->ENDORSEMENT_NUMBER),
                            'SELF_INSURED'               => $request->SELF_INSURED,
                            'ENDORSEMENT_STATUS'         => $request->ENDORSEMENT_STATUS,
                            'ENDORSEMENT_EFFECTIVE_DATE' => $request->ENDORSEMENT_EFFECTIVE_DATE,
                            'ENDORSEMENT_TYPE_ID'        => $request->ENDORSEMENT_TYPE_ID,
                            'ENDORSEMENT_NOTE'           => $request->ENDORSEMENT_NOTE,
                            'ENDORSEMENT_UPDATE_BY'      => Auth::user()->id,
                            'ENDORSEMENT_UPDATE_DATE'    => now()
                        ]);
                        
        foreach ($request->endorsement_premium as $req) {
            
            MEndorsementPremium::updateOrCreate(
                [
                    'ENDORSEMENT_PREMIUM_ID'    => $req['ENDORSEMENT_PREMIUM_ID']
                ],
                [
                    'ENDORSEMENT_ID' => $req['ENDORSEMENT_ID'],
                    'CURRENCY_ID' => $req['CURRENCY_ID'],
                    // 'SUM_INSURED' => $req['SUM_INSURED'],
                    // 'RATE' => $req['RATE'],
                    // 'ADDITIONAL_PREMIUM' => $req['ADDITIONAL_PREMIUM'],
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
        
        if ($request->deletedEndorsementPremium) {
            foreach ($request->deletedEndorsementPremium as $del) {
                MEndorsementPremium::where('ENDORSEMENT_PREMIUM_ID', $del['ENDORSEMENT_PREMIUM_ID'])->delete();
            }
        }

        foreach ($request->endorsement_installment as $req2) {
            MEndorsementInstallment::updateOrCreate(
                [
                    'ENDORSEMENT_INSTALLMENT_ID'    => $req2['ENDORSEMENT_INSTALLMENT_ID']
                ],
                [
                    'ENDORSEMENT_ID' => $req2['ENDORSEMENT_ID'],
                    'ENDORSEMENT_INSTALLMENT_TERM' => $req2['ENDORSEMENT_INSTALLMENT_TERM'],
                    'ENDORSEMENT_INSTALLMENT_RATE' => $req2['ENDORSEMENT_INSTALLMENT_RATE'],
                    'ENDORSEMENT_INSTALLMENT_DUE_DATE' => $req2['ENDORSEMENT_INSTALLMENT_DUE_DATE']
                ]
            );
        }
        
        if ($request->deletedInstallment) {
            foreach ($request->deletedInstallment as $del2) {
                MEndorsementInstallment::where('ENDORSEMENT_INSTALLMENT_ID', $del2['ENDORSEMENT_INSTALLMENT_ID'])->delete();
            }
        }

        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Edit Endorsement.",
                "module"      => "Endorsement",
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

     public function deactivate (Request $request) {

        // dd($request);
        $updatingData = Endorsement::where('ENDORSEMENT_ID', $request->id)
                              ->update([
                                'ENDORSEMENT_IS_DELETED'      => 1,
                                'ENDORSEMENT_IS_DELETED_BY'   => Auth::user()->id,
                                'ENDORSEMENT_IS_DELETED_DATE' => now()
                              ]);
        
        if ($updatingData) {

            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Deactivate Endorsement.",
                    "module"      => "Endorsement",
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

    public function getEndorsementData ($dataPerPage = 10, $searchQuery = null) {
        // dd($searchQuery);
        $data = Endorsement::orderBy('ENDORSEMENT_EFFECTIVE_DATE', 'desc')
                   ->whereNull('ENDORSEMENT_IS_DELETED');

        if ($searchQuery) {
            if ($searchQuery['policy_id']) {
                $data->where('POLICY_ID', $searchQuery["policy_id"]);
            }
            
            if ($searchQuery['endorsement_number']) {
                $data->where('ENDORSEMENT_NUMBER', 'like', '%'.$searchQuery["endorsement_number"].'%');
            }
        }

        return $data->paginate($dataPerPage);

    }

    public function getEndorsementDataForJSON(Request $request) 
    {
        $data = $this->getEndorsementData(10, $request);
        return response()->json($data);
    }

    public function get_id($id) 
    {         
        $data = Endorsement::find($id);
        return response()->json($data);
    }

    public function getEndorsementByPolicyId($policy_id) {
        $data = Endorsement::where('POLICY_ID', $policy_id)->get();
        return response()->json($data);        
    }

     public function endorsementInstallment($id) {
        
        $data = MEndorsementInstallment::where('ENDORSEMENT_ID',$id)->get();
        // dd(response()->json($data));
        return response()->json($data);

    }

}
