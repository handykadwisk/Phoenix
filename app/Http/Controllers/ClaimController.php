<?php

namespace App\Http\Controllers;

use App\Models\CauseOfLoss;
use App\Models\Claim;
use App\Models\ClaimCoverage;
use App\Models\MClaimCoverageInsured;
use App\Models\MClaimPolicy;
use App\Models\Milestone;
use App\Models\Policy;
use App\Models\Relation;
use App\Models\TRelationAgent;
use App\Models\WorkBook;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ClaimController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Claim/Claim', [
            'workbook' => WorkBook::all(),
            'milestone' => Milestone::all(),
            'relation' => Relation::all(),
            'policy' => Policy::all(),
            'causeOfLoss' => CauseOfLoss::all(),


        ]);
    }


    public function getClaim(Request $request)
    {
        // dd($request);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = Claim::query()->orderBy('CLAIM_ID', 'desc');
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newFilter = $request->input('newFilter', '');
        $newSearch = json_decode($request->newFilter, true);


        if ($sortModel) {

            $sortModel = explode(';', $sortModel);
            dd($sortModel);
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection);
            }
        }

        if ($filterModel) {
            foreach ($filterModel as $colId => $filterValue) {
                $query->where($colId, 'LIKE', '%' . $filterValue . '%');
            }
        }
        if ($newFilter !== "") {
            foreach ($newSearch as $search) {
                foreach ($search as $keyId => $searchValue) {
                    // Pencarian berdasarkan nama menu
                    if ($keyId === 'RELATION_ID') {
                        $query->where('RELATION_ID', 'LIKE', '%' . $searchValue . '%');
                    }
                }
            }
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        return $data;
    }

    public function getClaimJson(Request $request)
    {
        $claim = $this->getClaim($request);
        return response()->json($claim);
    }

    public function store(Request $request)
    {


        //validation
        $validator = Validator::make($request->all(), [
            'client' => 'required',
            'workbook' => 'required',
            'potentialInsurancePolicy.*.potentialInsurancePolicy' => 'required',
            'potentialInsurancePolicy.*.causeOfLoss.*.causeOfLoss' => 'required',
            // 'potentialInsurancePolicy.*.coverage.*.coverage' => 'required',
            // 'potentialInsurancePolicy.*.coverage.*.ValueSubmitClaim' => 'required',
        ], [
            'client.required' => 'Client is required',
            'workbook.required' => 'Workbook is required',
            'potentialInsurancePolicy.*.potentialInsurancePolicy.required' => 'Potential insurance policy is required',
            'potentialInsurancePolicy.*.causeOfLoss.*.causeOfLoss.required' => 'Cause of loss is required',
            // 'potentialInsurancePolicy.*.coverage.*.coverage.required' => 'Coverage is required',
            // 'potentialInsurancePolicy.*.coverage.*.ValueSubmitClaim.required' => 'Value submit claim is required',
        ]);
        if ($validator->fails()) {
            return new JsonResponse([
                $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        $claim = DB::transaction(function () use ($request) {
            $claim = Claim::create([
                'RELATION_ID' => $request->client,
                'WORKBOOK_ID' => $request->workbook,
                'NOTE' => $request->note,
                'CLAIM_CREATED_AT' => now(),
                'CLAIM_CREATED_BY' => Auth::user()->id,
            ]);

            $CLAIM_ID = $claim->CLAIM_ID;

            //maping create potential insurance policy
            // dd($request->potentialInsurancePolicy);
            foreach ($request->potentialInsurancePolicy as $potentialInsurancePolicy) {
                foreach ($potentialInsurancePolicy['coverage'] as $coverage) {
                    $claimCoverage = ClaimCoverage::create([
                        'POLICY_COVERAGE_ID' => $coverage['coverage'],

                        // 'VALUE' => $coverage['ValueSubmitClaim'],
                        // 'NOTE_VALUE' => $coverage['noteValueSubmitClaim'],
                        'NOTE' => $coverage['note'],
                        'CLAIM_ID' => $CLAIM_ID,

                    ]);

                    // foreach interst insured
                    foreach ($coverage['interestInsured'] as $interestInsured) {
                        MClaimCoverageInsured::create([
                            'CLAIM_COVERAGE_ID' => $claimCoverage->CLAIM_COVERAGE_ID,
                            'NOTE' => $interestInsured['note'],
                            'VALUE_SUBMIT_COVERAGE' => $interestInsured['ValueSubmitClaim'],
                            'NOTE_VALUE_SUBMIT_COVERAGE' => $interestInsured['noteValueSubmitClaim'],
                            'POLICY_COVERAGE_DETAIL_ID' => $interestInsured['interestInsured'],
                        ]);
                    }
                }

                MClaimPolicy::create([
                    'CLAIM_ID' => $CLAIM_ID,
                    'POLICY_ID' => $potentialInsurancePolicy['potentialInsurancePolicy'],
                    'NOTE' => $potentialInsurancePolicy['note'],
                    'CAUSE_OF_LOSS_ID' => $potentialInsurancePolicy['causeOfLoss'][0]['causeOfLoss'],
                    'NOTE_CAUSE_OF_LOSS' => $potentialInsurancePolicy['causeOfLoss'][0]['note'],
                ]);
            }

            return $claim;
        });
        // Return success response
        return new JsonResponse([
            'Claim registered successfully',
            'Claim' => $claim
        ], 200);
    }

    public function getClaimById($id)
    {
        $claim = Claim::with('workbook', 'relation', 'policy')->find($id);
        return $claim;
    }

    public function storeInsuredValue(Request $request)
    {
        // dd($request);
        $res = DB::transaction(function () use ($request) {
            $claimCoverage = MClaimCoverageInsured::create([
                'CLAIM_COVERAGE_ID' => $request->CLAIM_COVERAGE_ID,
                'POLICY_COVERAGE_DETAIL_ID' => $request->POLICY_COVERAGE_DETAIL_ID,
                'VALUE_SUBMIT_COVERAGE' => $request->VALUE_SUBMIT_COVERAGE,
                'NOTE_VALUE_SUBMIT_COVERAGE' => $request->NOTE,
                'CREATED_BY' => Auth::user()->id,
                'CREATED_DATE' => now(),

            ]);
            return $claimCoverage;
        });
        return new JsonResponse([
            'Value insured updated successfully',
            'ClaimCoverage' => $res
        ], 200);
    }
}
