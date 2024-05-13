<?php

namespace App\Http\Controllers;

use App\Models\Policy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PolicyController extends Controller
{
    public function index()
    {
        $policy = Policy::get();

        return Inertia::render('Policy/Index', [
            'policy' => $policy
        ]);
    }

    public function store(Request $request) {
        
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
            'POLICY_SHARE'          => $request->policy_share
        ]);
    }
}
