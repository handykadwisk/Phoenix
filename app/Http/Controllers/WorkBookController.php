<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\RCob;
use App\Models\RDuration;
use App\Models\RInsuranceType;
use App\Models\RMilestone;
use App\Models\UserLog;
use App\Models\WorkBook;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class WorkBookController extends Controller
{
    //
    public function index()
    {
        //get cob data
        $cob = RInsuranceType::all();

        //get duration data
        $duration = RDuration::all();

        return Inertia::render('WorkBook/WorkBook', [
            'cob' => $cob,
            'duration' => $duration,
            'milestones' => Milestone::all(),
            'workbook' => WorkBook::all()
        ]);
    }

    public function getWorkBookData(Request $request)
    {
        // dd($request);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = WorkBook::query()->orderBy('CREATED_DATE', 'desc');
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newFilter = $request->input('newFilter', '');
        $newSearch = json_decode($request->newFilter, true);

        if ($sortModel) {
            $sortModel = explode(';', $sortModel);
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
                    if ($keyId === 'WORKBOOK_NAME') {
                        $query->where('WORKBOOK_NAME', 'LIKE', '%' . $searchValue . '%');
                    }
                }
            }
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        return $data;
    }

    public function getWorkbookJson(Request $request)
    {
        $workbook = $this->getWorkBookData($request);
        return response()->json($workbook);
    }

    //STORE
    public function store(Request $request)
    {


        $rules = [
            'workbook_name' => 'required|unique:r_workbook,WORKBOOK_NAME',
            'cob_id' => 'required|not_in:0',
        ];

        // Create validator instance
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            return new JsonResponse([
                $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        $workbook_id = DB::transaction(function () use ($request) {

            //cob
            $cob = RInsuranceType::where('INSURANCE_TYPE_ID', $request->cob_id)->first();
            $cobInitial = $cob->INSURANCE_TYPE_INITIAL;

            //generate unique code
            $prefix = 'WBC';
            $lastCode = WorkBook::select('WORKBOOK_CODE')->orderBy('WORKBOOK_ID', 'desc')->first();
            if ($lastCode) {
                $lastNumber = (int)substr($lastCode->WORKBOOK_CODE, -2);
                $newNumber = $lastNumber >= 99 ? '01' : str_pad($lastNumber + 1, 2, '0', STR_PAD_LEFT);
            } else {
                $newNumber = '01';
            }
            $newCode = $prefix . '.' . $cobInitial . '.' . now()->format('Ymd') . '.' . $newNumber;


            //create new workbook
            $newWorkbook = WorkBook::create([
                'WORKBOOK_NAME' => $request->workbook_name,
                'COB_ID' => $request->cob_id,
                'WORKBOOK_CODE' => $newCode,
                'WORKBOOK_DESCRIPTION' => $request->description,
                'CREATED_BY' => Auth::user()->id,
                'CREATED_DATE' => now()
            ]);
            $workbook_id = $newWorkbook->WORKBOOK_ID;

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Created (Workbook).",
                    "module"      => "Workbook Management",
                    "id"          => $newWorkbook->WORKBOOK_ID,
                ]),
                'action_by'  => Auth::user()->user_login
            ]);
            return $workbook_id;
        });

        // Return success response
        return new JsonResponse([
            'WorkBook Created Successfully',
            'workbook_id' => $workbook_id
        ], 200);
    }

    // UPDATE
    public function edit(Request $request, $id)
    {
        // Validasi input
        $rules = [
            'workbook_name' => 'required',
            'cob_id' => 'required',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return new JsonResponse([
                'errors' => $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        try {
            $workbook = WorkBook::where('WORKBOOK_ID', $id)->first();

            // Jika workbook tidak ditemukan, langsung return error
            if (!$workbook) {
                return new JsonResponse([
                    'Workbook not found.'
                ], 404);
            }

            DB::transaction(function () use ($request, $workbook) {
                // Cek apakah COB_ID berubah
                if ($workbook->COB_ID != $request->cob_id) {
                    $cob = RInsuranceType::where('INSURANCE_TYPE_ID', $request->cob_id)->first();

                    if (!$cob) {
                        throw new \Exception('Insurance type not found.');
                    }

                    $cobInitial = $cob->INSURANCE_TYPE_INITIAL;
                    $prefix = 'WBC';
                    $lastCode = WorkBook::select('WORKBOOK_CODE')->orderBy('WORKBOOK_ID', 'desc')->first();

                    if ($lastCode) {
                        $lastNumber = (int)substr($lastCode->WORKBOOK_CODE, -2);
                        $newNumber = $lastNumber >= 99 ? '01' : str_pad($lastNumber + 1, 2, '0', STR_PAD_LEFT);
                    } else {
                        $newNumber = '01';
                    }

                    $newCode = $prefix . '.' . $cobInitial . '.' . now()->format('Ymd') . '.' . $newNumber;

                    // Update WORKBOOK_CODE
                    $workbook->update([
                        'WORKBOOK_CODE' => $newCode,
                    ]);
                }

                // Update workbook data
                $workbook->update([
                    'WORKBOOK_NAME' => $request->workbook_name,
                    'COB_ID' => $request->cob_id,
                    'WORKBOOK_DESCRIPTION' => $request->description,
                    'UPDATED_BY' => Auth::user()->id,
                    'UPDATED_DATE' => now()
                ]);

                // Log perubahan
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Updated (Workbook).",
                        "module"      => "Workbook Management",
                        "id"          => $workbook->WORKBOOK_ID,
                    ]),
                    'action_by'  => Auth::user()->user_login
                ]);
            });

            return new JsonResponse([
                'WorkBook Updated Successfully',
                $workbook->WORKBOOK_ID
            ], 200);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => $e->getMessage()
            ], 500);
        }
    }


    //get id
    public function getWorkBookById($id)
    {
        $workbook = WorkBook::where('WORKBOOK_ID', $id)->first();
        return response()->json($workbook);
    }

    //copy workbook milestone
    public function copyWorkbookMilestone(Request $request, $id)
    {
        $workbook = WorkBook::where('WORKBOOK_ID', $request->workbook_id)->first();

        if (!$workbook) {
            return new JsonResponse([
                'Workbook not found.'
            ], 404);
        }

        $milestones = Milestone::where('WORKBOOK_ID', $request->workbook_id)
            ->whereNull('MILESTONE_PARENT_ID') // Hanya parent milestones
            ->with('children') // Sertakan relasi children
            ->where('MILESTONE_IS_DELETED', 0)
            ->get();

        if ($milestones->isEmpty()) {
            return new JsonResponse([
                'Milestones not found.'
            ], 404);
        }

        //insert milestone to new workbook
        $newMilestones = DB::transaction(function () use ($milestones, $id) {
            $newMilestones = [];

            foreach ($milestones as $milestone) {
                $newMilestone = $this->copyMilestone($milestone, $id);
                $newMilestones[] = $newMilestone;
            }

            return $newMilestones;
        });

        return new JsonResponse([
            'message' => 'Milestones copied successfully',
            'milestones' => $newMilestones
        ], 200);
    }

    private function copyMilestone($milestone, $workbookId, $parentId = null)
    {
        $newMilestone = Milestone::create([
            'WORKBOOK_ID' => $workbookId,
            'DURATION_TYPE_ID' => $milestone->DURATION_TYPE_ID,
            'MILESTONE_NAME' => $milestone->MILESTONE_NAME,
            'MILESTONE_DURATION_DESCRIPTION' => $milestone->MILESTONE_DURATION_DESCRIPTION,
            'MILESTONE_DURATION_MIN' => $milestone->MILESTONE_DURATION_MIN,
            'MILESTONE_DURATION_MAX' => $milestone->MILESTONE_DURATION_MAX,
            'MILESTONE_PARENT_ID' => $parentId,
            'CREATED_BY' => Auth::user()->id,
            'CREATED_DATE' => now(),
            'MILESTONE_SEQUENCE' => $milestone->MILESTONE_SEQUENCE
        ]);

        foreach ($milestone->children as $child) {
            $this->copyMilestone($child, $workbookId, $newMilestone->MILESTONE_ID);
        }

        return $newMilestone;
    }
}
