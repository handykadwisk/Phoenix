<?php

namespace App\Http\Controllers;

use App\Models\Policy;
use App\Models\PolicyInstallment;
use App\Models\RCurrency;
use App\Models\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DebitNoteController extends Controller
{
    public function index()
    {        
        // $listInitialPremium = MPolicyPremium::leftJoin('t_policy', 'm_policy_initial_premium.POLICY_ID', '=', 't_policy.POLICY_ID')
        //         ->leftJoin('r_currency', 'm_policy_initial_premium.CURRENCY_ID', '=', 'r_currency.CURRENCY_ID')
        //         ->orderBy('m_policy_initial_premium.POLICY_ID', 'desc')
        //         ->get();
        // dd($policyIinitialPremium->toArray());
        return Inertia::render('DebitNote/Index', [
            
            'policies' => Policy::get(),
            'currency' => RCurrency::get(),
            'clients' => $this->getRelationByRelationType(1),
            'agents' => $this->getRelationByRelationType(3)
        ]);
    }

    public function getRelationByRelationType($id) {
        $data = DB::table('t_relation')
                ->leftJoin('m_relation_type', 't_relation.RELATION_ORGANIZATION_ID', '=', 'm_relation_type.RELATION_ORGANIZATION_ID')
                ->where('RELATION_TYPE_ID', $id)
                ->get();
        return $data;       
    }

     public function policyInstallment($id) {
        
        $data = PolicyInstallment::where('POLICY_ID',$id)->get();
        // dd(response()->json($data));
        return response()->json($data);

    }
}
