<?php

namespace App\Http\Controllers;

use App\Models\CashAdvancePurpose;
use App\Models\COA;
use App\Models\Expenses;
use App\Models\ExpensesDetail;
use App\Models\Document;
use App\Models\MExpensesDocument;
use App\Models\MExpensesProofOfDocument;
use App\Models\RCashAdvanceApproval;
use App\Models\RCashAdvanceMethod;
use App\Models\Relation;
use App\Models\RReimburseNotes;
use App\Models\TCompanyDivision;
use App\Models\TCompanyOffice;
use App\Models\TEmployee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

use function App\Helpers\replace_special_characters;
use function App\Helpers\user_log_create;

class ExpensesController extends Controller
{
    public function getExpensesData($request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = Expenses::query();
        $sortModel = $request->input('sort');
        $newSearch = json_decode($request->newFilter, true);

        if ($sortModel) {
            $sortModel = explode(';', $sortModel); 
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                
                $query->orderBy($colId, $sortDirection); 
            }
        }

        if ($request->newFilter !== "") {
            if ($newSearch[0]["flag"] !== "") {
                $query->where('EXPENSES_ID', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
            }

            foreach ($newSearch as $searchValue) {
                if ($searchValue['EXPENSES_NUMBER']) {
                    $query->where('EXPENSES_NUMBER', 'LIKE', '%' . $searchValue['EXPENSES_NUMBER'] . '%');
                }

                if ($searchValue['EXPENSES_VENDOR']) {
                    $query->whereHas('expenses_detail', 
                    function($query_detail) use ($searchValue)
                    {
                        $query_detail->whereHas('relation_organization', function($data) use ($searchValue)
                        {
                            $data->where('RELATION_ORGANIZATION_NAME', 'like', '%'. $searchValue['EXPENSES_VENDOR'] .'%');
                        });
                    });
                }

                if ($searchValue['EXPENSES_REQUESTED_BY']) {
                    $query->whereHas('employee',
                    function($data) use($searchValue)
                    {
                        $data->where('EMPLOYEE_FIRST_NAME', 'like', '%'. $searchValue['EXPENSES_REQUESTED_BY'] .'%');
                    });
                }

                if ($searchValue['EXPENSES_USED_BY']) {
                    $query->whereHas('employee_used_by',
                    function($data) use($searchValue)
                    {
                        $data->where('EMPLOYEE_FIRST_NAME', 'like', '%'. $searchValue['EXPENSES_USED_BY'] .'%');
                    });
                }

                if ($searchValue['EXPENSES_DIVISION']) {
                    $query->where('EXPENSES_DIVISION', $searchValue['EXPENSES_DIVISION']['value']);
                }

                if (
                    $searchValue['EXPENSES_START_DATE'] &&
                    $searchValue['EXPENSES_END_DATE']
                ) {
                    $query->whereBetween('EXPENSES_REQUESTED_DATE', [$searchValue['EXPENSES_START_DATE'], $searchValue['EXPENSES_END_DATE']]);
                }

                if ($searchValue['EXPENSES_COST_CENTER']) {
                    $query->where('EXPENSES_COST_CENTER', $searchValue['EXPENSES_COST_CENTER']['value']);
                }

                $approval_status = $searchValue["EXPENSES_APPROVAL_STATUS"];

                if ($approval_status === "request") {
                    $query->where('EXPENSES_FIRST_APPROVAL_STATUS', 1);
                } else if ($approval_status === "approve1") {
                    $query->where('EXPENSES_FIRST_APPROVAL_STATUS', 2)
                        ->where('EXPENSES_SECOND_APPROVAL_STATUS', null)
                        ->where('EXPENSES_THIRD_APPROVAL_STATUS', null);
                } else if ($approval_status === "approve2") {
                    $query->where('EXPENSES_SECOND_APPROVAL_STATUS', 2)
                        ->where('EXPENSES_THIRD_APPROVAL_STATUS', null);
                } else if ($approval_status === "approve3") {
                    $query->where('EXPENSES_THIRD_APPROVAL_STATUS', 2)
                        ->where('EXPENSES_SECOND_APPROVAL_STATUS', '!=', 6);
                } else if ($approval_status === "revision") {
                    $query->where('EXPENSES_FIRST_APPROVAL_STATUS', 3)
                        ->orWhere('EXPENSES_SECOND_APPROVAL_STATUS', 3)
                        ->orWhere('EXPENSES_THIRD_APPROVAL_STATUS', 3);
                } else if ($approval_status === "reject") {
                    $query->where('EXPENSES_FIRST_APPROVAL_STATUS', 4)
                        ->orWhere('EXPENSES_SECOND_APPROVAL_STATUS', 4)
                        ->orWhere('EXPENSES_THIRD_APPROVAL_STATUS', 4);
                } else if ($approval_status === "complited") {
                    $query->where('EXPENSES_SECOND_APPROVAL_STATUS', 6);
                }
            }
        }

        // dd($query->toSql());
        $query->orderBy('EXPENSES_ID', 'desc');

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    public function getExpenses(Request $request)
    {
        $data = $this->getExpensesData($request);
        return response()->json($data);
    }

    public function getExpensesById(string $id) 
    {
        $data = Expenses::findOrFail($id);
        return response()->json($data);
    }

    public function getCountExpensesRequestStatus()
    {
        $data = Expenses::where('EXPENSES_FIRST_APPROVAL_STATUS', 1)->count();

        return response()->json($data);
    }

    public function getCountExpensesApprove1Status()
    {
        $data = Expenses::where('EXPENSES_FIRST_APPROVAL_STATUS', 2)
                        ->where('EXPENSES_SECOND_APPROVAL_STATUS', null)
                        ->where('EXPENSES_THIRD_APPROVAL_STATUS', null)
                        ->count();

        return response()->json($data);
    }

    public function getCountExpensesApprove2Status()
    {
        $data = Expenses::where('EXPENSES_SECOND_APPROVAL_STATUS', 2)
                        ->where('EXPENSES_THIRD_APPROVAL_STATUS', null)
                        ->count();

        return response()->json($data);
    }

    public function getCountExpensesApprove3Status()
    {
        $data = Expenses::where('EXPENSES_THIRD_APPROVAL_STATUS', 2)
                        ->where('EXPENSES_SECOND_APPROVAL_STATUS', '!=', 6)
                        ->count();

        return response()->json($data);
    }

    public function getCountExpensesNeedRevisionStatus()
    {
        $data = Expenses::where('EXPENSES_FIRST_APPROVAL_STATUS', 3)
                            ->orWhere('EXPENSES_SECOND_APPROVAL_STATUS', 3)
                            ->orWhere('EXPENSES_THIRD_APPROVAL_STATUS', 3)
                            ->count();

        return response()->json($data);
    }

    public function getCountExpensesRejectStatus()
    {
        $data = Expenses::where('EXPENSES_FIRST_APPROVAL_STATUS', 4)
                            ->orWhere('EXPENSES_SECOND_APPROVAL_STATUS', 4)
                            ->orWhere('EXPENSES_THIRD_APPROVAL_STATUS', 4)
                            ->count();

        return response()->json($data);
    }

    public function getExpensesApproval()
    {
        $data = RCashAdvanceApproval::all();

        return response()->json($data);
    }

    public function getExpensesNotes()
    {
        $data = RReimburseNotes::all();

        return response()->json($data);
    }

    public function getExpensesMethod()
    {
        $data = RCashAdvanceMethod::all();

        return response()->json($data);
    }

    public function index() 
    {
        $data = [
            'purposes' => CashAdvancePurpose::all(),
            'relations' => Relation::all(),
            'coa' => COA::all(),
            'employees' => TEmployee::all(),
            'office' => TCompanyOffice::all(),
            'division' => TCompanyDivision::all()
        ];

        return Inertia::render('Expenses/Expenses', $data);
    }

    public function getExpensesNumber()
    {
        $data = 
            Expenses::where('OTHER_EXPENSES_FIRST_APPROVAL_STATUS', 1)
                        ->orderBy('OTHER_EXPENSES_ID', 'desc')
                        ->get();

        return response()->json($data);
    }

    public function generateExpensesNumber()
    {
        // Format kode
        $prefix = 'PV/EXP/';
        
        // Ambil tahun dan bulan saat ini
        $currentYear = date('Y');
        $currentMonth = date('n');

        // Cari kode terakhir dari tabel
        $lastCode = Expenses::orderBy('EXPENSES_CREATED_AT', 'desc')->first();

        // Inisialisasi nomor urut
        $nextNumber = 1;

        if ($lastCode) {
            // Mengambil tahun dan bulan dari kode terakhir
            $lastCodeYear = substr($lastCode->EXPENSES_NUMBER, 7, 4);
            $lastCodeMonth = substr($lastCode->EXPENSES_NUMBER, 12, strlen($currentMonth));

            // Jika bulan dan tahun sama, lanjutkan increment nomor
            if ($lastCodeYear == $currentYear && $lastCodeMonth == $currentMonth) {
                $lastSequenceNumber = (int) substr($lastCode->EXPENSES_NUMBER, -5);
                $nextNumber = $lastSequenceNumber + 1;
            }
        }

        // Format nomor urut dengan dengan menambahkan 0 di depan nomor urut
        $formattedNumber = str_pad($nextNumber, 5, '0', STR_PAD_LEFT);

        // Menggabungkan kode akhir
        $expensesNumber = $prefix . "$currentYear/$currentMonth/$formattedNumber";

        return $expensesNumber;
    }

    public function expenses_doc_reader($expenses_detail_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $expenses_detail_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
        $document_dirname = $document->DOCUMENT_DIRNAME;

        $filePath = "/storage" . "/". $document_dirname . "/" . $document_filename;

        $data = [
            'uri' => $filePath
        ];

        return Inertia::render('Expenses/ExpensesDocReader', $data);
    }

    public function expenses_proof_of_document_doc_reader($expenses_detail_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $expenses_detail_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
        $document_dirname = $document->DOCUMENT_DIRNAME;

        $filePath = "/storage" . "/". $document_dirname . "/" . $document_filename;

        $data = [
            'uri' => $filePath
        ];

        return Inertia::render('Expenses/ExpensesDocReader', $data);
    }

    public function download($expenses_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $expenses_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
        $document_dirname = $document->DOCUMENT_DIRNAME;

        $filePath = public_path('/storage' . '/'. $document_dirname . '/' . $document_filename);

        $headers = [
            'filename' => $document_filename
        ];

        if (file_exists($filePath)) {
            return response()->download($filePath, $document_filename, $headers);
        } else {
            abort(404, 'File not found');
        }
    }

    public function expenses_proof_of_document_download($expenses_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $expenses_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
        $document_dirname = $document->DOCUMENT_DIRNAME;

        $filePath = public_path('/storage' . '/'. $document_dirname . '/' . $document_filename);

        $headers = [
            'filename' => $document_filename
        ];

        if (file_exists($filePath)) {
            return response()->download($filePath, $document_filename, $headers);
        } else {
            abort(404, 'File not found');
        }
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), 
            [
                'expenses_cost_center' => 'required',
                'expenses_used_by' => 'required',
                'expenses_branch' => 'required',
                'expenses_first_approval_by' => 'required',
            ],
            [
                'expenses_cost_center.required' => 'The cost center field is required.',
                'expenses_used_by.required' => 'The used by field is required.',
                'expenses_branch.required' => 'The branch field is required.',
                'expenses_first_approval_by.required' => 'The request for approval field is required.',
            ]
        );

        if ($validator->fails()) {
            return new JsonResponse([
                $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        DB::transaction(function () use ($request) {
            $user = Auth::user();
            $user_id = $user->id;

            $expenses_number = $this->generateExpensesNumber();
            $expenses_used_by = $request->expenses_used_by['value'];
            $expenses_requested_by = $request->expenses_requested_by;
            $expenses_division = $request->expenses_division;
            $expenses_cost_center = $request->expenses_cost_center['value'];
            $expenses_branch = $request->expenses_branch['value'];
            $expenses_requested_date = now();
            $expenses_first_approval_by = $request->expenses_first_approval_by['value'];
            $expenses_first_approval_user = $request->expenses_first_approval_by['label'];
            $expenses_first_approval_status = 1;
            $expenses_request_note = $request->expenses_request_note;
            $expenses_total_amount = $request->expenses_total_amount;
            $expenses_created_at = now();
            $expenses_created_by = $user_id;

            // Insert Expenses
            $expenses = Expenses::create([
                'EXPENSES_NUMBER' => $expenses_number,
                'EXPENSES_USED_BY' => $expenses_used_by,
                'EXPENSES_REQUESTED_BY' => $expenses_requested_by,
                'EXPENSES_DIVISION' => $expenses_division,
                'EXPENSES_COST_CENTER' => $expenses_cost_center,
                'EXPENSES_BRANCH' => $expenses_branch,
                'EXPENSES_REQUESTED_DATE' => $expenses_requested_date,
                'EXPENSES_FIRST_APPROVAL_BY' => $expenses_first_approval_by,
                'EXPENSES_FIRST_APPROVAL_USER' => $expenses_first_approval_user,
                'EXPENSES_FIRST_APPROVAL_STATUS' => $expenses_first_approval_status,
                'EXPENSES_REQUEST_NOTE' => $expenses_request_note,
                'EXPENSES_TOTAL_AMOUNT' => $expenses_total_amount,
                'EXPENSES_CREATED_AT' => $expenses_created_at,
                'EXPENSES_CREATED_BY' => $expenses_created_by
            ])->EXPENSES_ID;

            // Created Log Expenses
            user_log_create("Created (Expenses).", "Expenses", $expenses);

            foreach ($request->expensesDetail as $ed) {
                $expenses_detail_due_date = $ed['expenses_detail_due_date'];
                $expenses_detail_type = $ed['expenses_detail_type'];
                $expenses_detail_currency = $ed['expenses_detail_currency'];
                $expenses_detail_amount_value = $ed['expenses_detail_amount_value'];
                $expenses_detail_relation_organization_id = $ed['expenses_detail_relation_organization_id']['value'];
                $expenses_detail_description = $ed['expenses_detail_description'];
                
                // Insert Expenses Detail
                $ExpensesDetail = ExpensesDetail::create([
                    'EXPENSES_ID' => $expenses,
                    'EXPENSES_DETAIL_DUE_DATE' => $expenses_detail_due_date,
                    'EXPENSES_DETAIL_TYPE' => $expenses_detail_type,
                    'EXPENSES_DETAIL_CURRENCY' => $expenses_detail_currency,
                    'EXPENSES_DETAIL_AMOUNT_VALUE' => $expenses_detail_amount_value,
                    'EXPENSES_DETAIL_RELATION_ORGANIZATION_ID' => $expenses_detail_relation_organization_id,
                    'EXPENSES_DETAIL_DESCRIPTION' => $expenses_detail_description
                ]);

                // Get data expenses detail id
                $expenses_detail_id = $ExpensesDetail->EXPENSES_DETAIL_ID;

                // Start process file upload
                $files = $request->file('expensesDetail');
                if (is_array($files) && !empty($files)) {
                    if (isset($ed['expenses_detail_document'])) {
                        foreach ($ed['expenses_detail_document'] as $file) {
                            $parentDir = ((floor(($expenses_detail_id) / 1000)) * 1000) . '/';
                            $CAId = $expenses_detail_id . '/';
                            $typeDir = '';
                            $uploadPath = 'documents/' . 'Expenses/'. $parentDir . $CAId . $typeDir;
        
                            $userId = $user->id;
        
                            $documentOriginalName =  replace_special_characters($file->getClientOriginalName());
                            $documentFileName =  $expenses_detail_id . '-' . replace_special_characters($file->getClientOriginalName());
                            $documentDirName =  $uploadPath;
                            $documentFileType = $file->getMimeType();
                            $documentFileSize = $file->getSize();
        
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $file, $expenses_detail_id . '-' . replace_special_characters($file->getClientOriginalName()));
        
                            $document = Document::create([
                                'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                                'DOCUMENT_FILENAME'               => $documentFileName,
                                'DOCUMENT_DIRNAME'                => $documentDirName,
                                'DOCUMENT_FILETYPE'               => $documentFileType,
                                'DOCUMENT_FILESIZE'               => $documentFileSize,
                                'DOCUMENT_CREATED_BY'             => $userId
                            ])->DOCUMENT_ID;
        
                            if($document){
                                Document::where('DOCUMENT_ID', $document)->update([
                                    'DOCUMENT_FILENAME'             => $document."-".$documentOriginalName,
                                ]);
                            }
        
                            if ($document) {
                                MExpensesDocument::create([
                                    'EXPENSES_DOCUMENT_EXPENSES_DETAIL_ID' => $expenses_detail_id,
                                    'EXPENSES_DOCUMENT_EXPENSES_DETAIL_DOCUMENT_ID' => $document,
                                    'EXPENSES_DOCUMENT_CREATED_AT' => now(),
                                    'EXPENSES_DOCUMENT_CREATED_BY' => $userId,
                                ]);
                            }
                        }
                        
                    }
                }
                // End process file upload

                // Created Log Expenses Detail
                user_log_create("Created (Expenses Detail).", "Expenses", $expenses_detail_id);
            }
        });

        return new JsonResponse([
            'New expenses has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function approve(Request $request)
    {
        DB::transaction(function () use ($request) {
            $expenses_id = $request->EXPENSES_ID;
            $expenses_type = $request->EXPENSES_TYPE;
            $expenses_total_amount = $request->EXPENSES_TOTAL_AMOUNT;
            $expenses_total_amount_approve = $request->EXPENSES_TOTAL_AMOUNT_APPROVE;
            $expenses_total_amount_different = $expenses_total_amount - $expenses_total_amount_approve;

            $updateData = [
                'EXPENSES_TYPE' => $expenses_type,
                'EXPENSES_TOTAL_AMOUNT' => $expenses_total_amount,
                'EXPENSES_TOTAL_AMOUNT_APPROVE' => $expenses_total_amount_approve,
                'EXPENSES_TOTAL_AMOUNT_DIFFERENT' => $expenses_total_amount_different,
            ];

            $userDivisionId = Auth::user()->employee->division->COMPANY_DIVISION_ID;

            // dd($userDivisionId);

            // Start logic condition revised
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->EXPENSES_FIRST_APPROVAL_STATUS == 3) {
                $updateData['EXPENSES_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['EXPENSES_FIRST_APPROVAL_STATUS'] = 3;
            }

            if ($userDivisionId === 132 && $request->EXPENSES_SECOND_APPROVAL_STATUS == 3) {
                $updateData['EXPENSES_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['EXPENSES_FIRST_APPROVAL_STATUS'] = 3;
                $updateData['EXPENSES_SECOND_APPROVAL_BY'] = null;
                $updateData['EXPENSES_SECOND_APPROVAL_USER'] = null;
                $updateData['EXPENSES_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['EXPENSES_SECOND_APPROVAL_STATUS'] = null;
            }

            if ($userDivisionId === 122 && $request->EXPENSES_THIRD_APPROVAL_STATUS == 3) {
                $updateData['EXPENSES_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['EXPENSES_FIRST_APPROVAL_STATUS'] = 3;
                $updateData['EXPENSES_SECOND_APPROVAL_BY'] = null;
                $updateData['EXPENSES_SECOND_APPROVAL_USER'] = null;
                $updateData['EXPENSES_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['EXPENSES_SECOND_APPROVAL_STATUS'] = null;
                $updateData['EXPENSES_THIRD_APPROVAL_BY'] = null;
                $updateData['EXPENSES_THIRD_APPROVAL_USER'] = null;
                $updateData['EXPENSES_THIRD_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['EXPENSES_THIRD_APPROVAL_STATUS'] = null;
            }
            // End logic condition revised
            
            // Start logic condition approve
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->EXPENSES_FIRST_APPROVAL_STATUS == 2) {
                $updateData['EXPENSES_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['EXPENSES_FIRST_APPROVAL_STATUS'] = $request->EXPENSES_FIRST_APPROVAL_STATUS;
            }

            if ($userDivisionId === 132 && $request->EXPENSES_SECOND_APPROVAL_STATUS == 2) {
                $updateData['EXPENSES_SECOND_APPROVAL_BY'] = $request->EXPENSES_SECOND_APPROVAL_BY;
                $updateData['EXPENSES_SECOND_APPROVAL_USER'] = $request->EXPENSES_SECOND_APPROVAL_USER;
                $updateData['EXPENSES_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['EXPENSES_SECOND_APPROVAL_STATUS'] = $request->EXPENSES_SECOND_APPROVAL_STATUS;
            }

            if ($userDivisionId === 122 && $request->EXPENSES_THIRD_APPROVAL_STATUS == 2) {
                $updateData['EXPENSES_THIRD_APPROVAL_BY'] = $request->EXPENSES_THIRD_APPROVAL_BY;
                $updateData['EXPENSES_THIRD_APPROVAL_USER'] = $request->EXPENSES_THIRD_APPROVAL_USER;
                $updateData['EXPENSES_THIRD_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['EXPENSES_THIRD_APPROVAL_STATUS'] = $request->EXPENSES_THIRD_APPROVAL_STATUS;
            }
            // End logic condition approve

            // Start logic condition reject
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->EXPENSES_FIRST_APPROVAL_STATUS == 4) {
                $updateData['EXPENSES_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['EXPENSES_FIRST_APPROVAL_STATUS'] = $request->EXPENSES_FIRST_APPROVAL_STATUS;
            }

            if ($userDivisionId === 132 && $request->EXPENSES_SECOND_APPROVAL_STATUS == 4) {
                $updateData['EXPENSES_SECOND_APPROVAL_BY'] = $request->EXPENSES_SECOND_APPROVAL_BY;
                $updateData['EXPENSES_SECOND_APPROVAL_USER'] = $request->EXPENSES_SECOND_APPROVAL_USER;
                $updateData['EXPENSES_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['EXPENSES_SECOND_APPROVAL_STATUS'] = $request->EXPENSES_SECOND_APPROVAL_STATUS;
            }

            if ($userDivisionId === 122 && $request->EXPENSES_THIRD_APPROVAL_STATUS == 4) {
                $updateData['EXPENSES_THIRD_APPROVAL_BY'] = $request->EXPENSES_THIRD_APPROVAL_BY;
                $updateData['EXPENSES_THIRD_APPROVAL_USER'] = $request->EXPENSES_THIRD_APPROVAL_USER;
                $updateData['EXPENSES_THIRD_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['EXPENSES_THIRD_APPROVAL_STATUS'] = $request->EXPENSES_THIRD_APPROVAL_STATUS;
            }
            // End logic condition reject

            Expenses::where('EXPENSES_ID', $expenses_id)->update($updateData);

            // Create log for approval
            user_log_create("Approve (Expenses).", "Expenses", $expenses_id);

            $expenses_detail = $request->expenses_detail;
            if (is_array($expenses_detail) && !empty($expenses_detail)) {
                foreach ($expenses_detail as $rd) {
                    $cost_classification = $rd['EXPENSES_DETAIL_COST_CLASSIFICATION'];
    
                    $expenses_detail_id = $rd['EXPENSES_DETAIL_ID'];
                    $expenses_detail_approval = $rd['EXPENSES_DETAIL_APPROVAL'];
                    $expenses_detail_amount_value_approve = $rd['EXPENSES_DETAIL_AMOUNT_VALUE_APPROVE'];
                    $expenses_detail_remarks = $rd['EXPENSES_DETAIL_REMARKS'];
                    $expenses_detail_cost_classification = $rd['EXPENSES_DETAIL_COST_CLASSIFICATION'];
                    
                    if ($cost_classification != null || $cost_classification != "") {
                        $expenses_detail_cost_classification = $cost_classification;
                    }
                    
                    ExpensesDetail::where('EXPENSES_DETAIL_ID', $expenses_detail_id)->update([
                        'EXPENSES_DETAIL_APPROVAL' => $expenses_detail_approval,
                        'EXPENSES_DETAIL_COST_CLASSIFICATION' => $expenses_detail_cost_classification,
                        'EXPENSES_DETAIL_AMOUNT_VALUE_APPROVE' => $expenses_detail_amount_value_approve,
                        'EXPENSES_DETAIL_REMARKS' => $expenses_detail_remarks
                    ]);
    
                    // Created Log Expenses Detail
                    user_log_create("Approve (Expenses Detail).", "Expenses", $expenses_detail_id);
                }
            }
    
        });

        return new JsonResponse([
            'Expenses has been approved.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function revised(Request $request)
    {
        // $validator = Validator::make($request->all(), 
        //     [
        //         'EXPENSES_DETAIL_RELATION_ORGANIZATION_ID' => 'required',
        //         'EXPENSES_DETAIL_DESCRIPTION' => 'required'
        //     ],
        //     [
        //         'EXPENSES_DETAIL_RELATION_ORGANIZATION_ID.required' => 'The paid to field is required.',
        //         'EXPENSES_DETAIL_DESCRIPTION.required' => 'The description field is required.'
        //     ]
        // );

        // if ($validator->fails()) {
        //     return new JsonResponse([
        //         $validator->errors()->all()
        //     ], 422, [
        //         'X-Inertia' => true
        //     ]);
        // }

        DB::transaction(function () use ($request) {
            $user = Auth::user();
            $user_id = $user->id;
            
            $expenses_id = $request->EXPENSES_ID;
            $expenses_total_amount = $request->EXPENSES_TOTAL_AMOUNT;
            $expenses_first_approval_status = 1;
            $expenses_request_note = $request->EXPENSES_REQUEST_NOTE;
            $expenses_updated_at = now();
            $expenses_updated_by = $user_id;
    
            Expenses::where('EXPENSES_ID', $expenses_id)->update([
                'EXPENSES_FIRST_APPROVAL_STATUS' => $expenses_first_approval_status,
                'EXPENSES_REQUEST_NOTE' => $expenses_request_note,
                'EXPENSES_TOTAL_AMOUNT' => $expenses_total_amount,
                'EXPENSES_UPDATED_AT' => $expenses_updated_at,
                'EXPENSES_UPDATED_BY' => $expenses_updated_by
            ]);
    
            // Created Log Expenses
            user_log_create("Revised (Expenses).", "Expenses", $expenses_id);
    
            foreach ($request->expenses_detail as $rd) {
                $expenses_detail_id = $rd['EXPENSES_DETAIL_ID'];
                $expenses_detail_due_date = isset($rd['EXPENSES_DETAIL_DUE_DATE']) ? $rd['EXPENSES_DETAIL_DUE_DATE'] : null;
                $expenses_detail_type = $rd['EXPENSES_DETAIL_TYPE'];
                $expenses_detail_currency = $rd['EXPENSES_DETAIL_CURRENCY'];
                $expenses_detail_amount_value = $rd['EXPENSES_DETAIL_AMOUNT_VALUE'];
                $expenses_detail_description = $rd['EXPENSES_DETAIL_DESCRIPTION'];
                $expenses_detail_relation_organization_id = $rd['EXPENSES_DETAIL_RELATION_ORGANIZATION_ID'];
                
                $ExpensesDetail = ExpensesDetail::updateOrCreate(
                [
                    'EXPENSES_DETAIL_ID' => $expenses_detail_id
                ],
                [
                    'EXPENSES_ID' => $expenses_id,
                    'EXPENSES_DETAIL_DUE_DATE' => $expenses_detail_due_date,
                    'EXPENSES_DETAIL_TYPE' => $expenses_detail_type,
                    'EXPENSES_DETAIL_CURRENCY' => $expenses_detail_currency,
                    'EXPENSES_DETAIL_AMOUNT_VALUE' => $expenses_detail_amount_value,
                    'EXPENSES_DETAIL_RELATION_ORGANIZATION_ID' => $expenses_detail_relation_organization_id,
                    'EXPENSES_DETAIL_DESCRIPTION' => $expenses_detail_description
                ]);
    
                $expensesDetailId = $ExpensesDetail->EXPENSES_DETAIL_ID;
    
                $files = $request->file('expenses_detail');
                
                if (is_array($files) && !empty($files)) {
                    if(isset($rd['filesDocument'])) {
                        foreach ($rd['filesDocument'] as $file) {
                            $uploadFile = $file['EXPENSES_DETAIL_DOCUMENT'];
                        
                            $parentDir = ((floor(($expensesDetailId) / 1000)) * 1000) . '/';
                            $CAId = $expensesDetailId . '/';
                            $typeDir = '';
                            $uploadPath = 'documents/' . 'Expenses/'. $parentDir . $CAId . $typeDir;
            
                            $userId = $user->id;
            
                            $documentOriginalName =  replace_special_characters($uploadFile->getClientOriginalName());
                            $documentFileName =  $expensesDetailId . '-' . replace_special_characters($uploadFile->getClientOriginalName());
                            $documentDirName =  $uploadPath;
                            $documentFileType = $uploadFile->getMimeType();
                            $documentFileSize = $uploadFile->getSize();
            
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $uploadFile, $expensesDetailId . '-' . replace_special_characters($uploadFile->getClientOriginalName()));
            
                            $document = Document::create([
                                'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                                'DOCUMENT_FILENAME'               => $documentFileName,
                                'DOCUMENT_DIRNAME'                => $documentDirName,
                                'DOCUMENT_FILETYPE'               => $documentFileType,
                                'DOCUMENT_FILESIZE'               => $documentFileSize,
                                'DOCUMENT_CREATED_BY'             => $userId
                            ])->DOCUMENT_ID;
            
                            if($document){
                                Document::where('DOCUMENT_ID', $document)->update([
                                    'DOCUMENT_FILENAME'           => $document."-".$documentOriginalName,
                                ]);
                            }
            
                            if ($document) {
                                MExpensesDocument::create([
                                    'EXPENSES_DOCUMENT_EXPENSES_DETAIL_ID' => $expensesDetailId,
                                    'EXPENSES_DOCUMENT_EXPENSES_DETAIL_DOCUMENT_ID' => $document,
                                    'EXPENSES_DOCUMENT_CREATED_AT' => now(),
                                    'EXPENSES_DOCUMENT_CREATED_BY' => $userId,
                                ]);
                            }
                        }
                    }
                }
    
                // Created Log Expenses Detail
                user_log_create("Revised (Expenses Detail).", "Expenses", $expenses_detail_id);
            }
    
            // Delete row from table cash advance detail
            $deletedRows = $request->deletedRow;
            if($deletedRows) {
                foreach ($deletedRows as $deletedRow) {
                    $expensesDetailId = $deletedRow['EXPENSES_DETAIL_ID'];
                    
                    $filePath = '/documents/Expenses/0/' . $expensesDetailId;
    
                    // Delete data document from directory
                    if(Storage::disk('public')->exists($filePath)) {   
                        Storage::disk('public')->deleteDirectory($filePath);
                    } 
    
                    // Delete row from table expenses detail
                    ExpensesDetail::destroy($expensesDetailId);
                }
            }
    
            // Delete document
            $deletedDocuments = $request->deletedDocument;
            if ($deletedDocuments) {
                foreach ($deletedDocuments as $document_value) {
                    // Get Data Document
                    $documentId = $document_value['DOCUMENT_ID'];
                    $expensesDetailId = $document_value['EXPENSES_DETAIL_ID'];
    
                    $getDocument = Document::find($documentId);
    
                    $documentFilename = $expensesDetailId . '-' . $getDocument->DOCUMENT_ORIGINAL_NAME;
                    $documentDirname = $getDocument->DOCUMENT_DIRNAME;
                    
                    $filePath = '/'. $documentDirname . '/' . $documentFilename;
    
                    // Delete data document from directory
                    if(Storage::disk('public')->exists($filePath)) {   
                        Storage::disk('public')->delete($filePath);
                    } 
    
                    // Delete data from table m_expenses_document
                    MExpensesDocument::where('EXPENSES_DOCUMENT_EXPENSES_DETAIL_DOCUMENT_ID', $documentId)->delete();
    
                    // Delete data from table t_document
                    Document::destroy($documentId);
                }
            }
        });
        
        return new JsonResponse([
            'Expenses has been revised.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function execute(Request $request)
    {
        DB::transaction(function () use ($request) {
            $expenses_id = $request->expenses_id;
            $expenses_second_approval_status = 6;
            $expenses_method = $request->expenses_method;
            $expenses_settlement_date = $request->expenses_settlement_date;
    
            Expenses::where('EXPENSES_ID', $expenses_id)->update([
                'EXPENSES_SECOND_APPROVAL_STATUS' => $expenses_second_approval_status,
                'EXPENSES_METHOD' => $expenses_method,
                'EXPENSES_SETTLEMENT_DATE' => $expenses_settlement_date
            ]);
    
            // Start process file upload
            $files = $request->file('proof_of_document');
            if (is_array($files) && !empty($files)) {
                foreach ($files as $file) {
                    $uploadedFile = $file['proof_of_document'];
                    $parentDir = ((floor(($expenses_id) / 1000)) * 1000) . '/';
                    $CAId = $expenses_id . '/';
                    $typeDir = '';
                    $uploadPath = 'documents/' . 'ExpensesProofOfDocument/'. $parentDir . $CAId . $typeDir;
    
                    $userId = Auth::user()->id;
    
                    $documentOriginalName =  replace_special_characters($uploadedFile->getClientOriginalName());
                    $documentFileName =  $expenses_id . '-' . replace_special_characters($uploadedFile->getClientOriginalName());
                    $documentDirName  =  $uploadPath;
                    $documentFileType = $uploadedFile->getMimeType();
                    $documentFileSize = $uploadedFile->getSize();
    
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $uploadedFile, $expenses_id . '-' . replace_special_characters($uploadedFile->getClientOriginalName()));
    
                    $document = Document::create([
                        'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                        'DOCUMENT_FILENAME'               => $documentFileName,
                        'DOCUMENT_DIRNAME'                => $documentDirName,
                        'DOCUMENT_FILETYPE'               => $documentFileType,
                        'DOCUMENT_FILESIZE'               => $documentFileSize,
                        'DOCUMENT_CREATED_BY'             => $userId
                    ])->DOCUMENT_ID;
    
                    if($document) {
                        Document::where('DOCUMENT_ID', $document)->update([
                            'DOCUMENT_FILENAME'           => $document . "-" . $documentOriginalName,
                        ]);
                    }
                        
                    if ($document) {
                        MExpensesProofOfDocument::create([
                            'EXPENSES_PROOF_OF_DOCUMENT_EXPENSES_ID' => $expenses_id,
                            'EXPENSES_PROOF_OF_DOCUMENT_EXPENSES_DOCUMENT_ID' => $document,
                            'EXPENSES_PROOF_OF_DOCUMENT_CREATED_AT' => now(),
                            'EXPENSES_PROOF_OF_DOCUMENT_CREATED_BY' => $userId,
                        ]);
                    }
                }
            }
    
            // Created Log Expenses
            user_log_create("Execute (Expenses).", "Expenses", $expenses_id);
        });
        
        return new JsonResponse([
            'Expenses has been execute.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}