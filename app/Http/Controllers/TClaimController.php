<?php

namespace App\Http\Controllers;

use App\Models\TClaim;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TClaimController extends Controller
{
    //
    public function store(Request $request)
    {
        //validation
        $validator = Validator::make($request->all(), [
            'workbook_id' => 'required',
            'milestone_id' => 'required',
            'relation_id' => 'required',
            'policy_id' => 'required',
            'cause_of_loss_id' => 'required',
            'claim_number' => 'required',
            'claim_date' => 'required',
            'claim_amount' => 'required',
            'claim_status' => 'required',
            'claim_description' => 'required',
            'claim_note' => 'required',
            'claim_file' => 'required',
        ], [
            'workbook_id.required' => 'Workbook is required',
            'milestone_id.required' => 'Milestone is required',
            'relation_id.required' => 'Relation is required',
            'policy_id.required' => 'Policy is required',
            'cause_of_loss_id.required' => 'Cause of loss is required',
            'claim_number.required' => 'Claim number is required',
            'claim_date.required' => 'Claim date is required',
            'claim_amount.required' => 'Claim amount is required',
            'claim_status.required' => 'Claim status is required',
            'claim_description.required' => 'Claim description is required',
            'claim_note.required' => 'Claim note is required',
            'claim_file.required' => 'Claim file is required',
        ]);
        if ($validator->fails()) {
            return new JsonResponse([
                $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }
    }
}
