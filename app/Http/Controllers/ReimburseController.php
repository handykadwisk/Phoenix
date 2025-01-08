<?php

namespace App\Http\Controllers;

use App\Models\CashAdvancePurpose;
use App\Models\COA;
use App\Models\Reimburse;
use App\Models\ReimburseDetail;
use App\Models\Document;
use App\Models\MReimburseDocument;
use App\Models\MReimburseProofOfDocument;
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

class ReimburseController extends Controller
{
    public function getReimburseData($request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = Reimburse::query();
        $sortModel = $request->input('sort');
        $newSearch = json_decode($request->newFilter, true);
        $filterModel = json_decode($request->input('filter'), true);

        if ($sortModel) {
            $sortModel = explode(';', $sortModel); 
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                
                $query->orderBy($colId, $sortDirection); 
            }
        }

        if ($request->newFilter !== "") {
            if ($newSearch[0]["flag"] !== "") {
                $query->where('REIMBURSE_ID', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
            }

            foreach ($newSearch as $searchValue) {
                if ($searchValue['REIMBURSE_NUMBER']) {
                    $query->where('REIMBURSE_NUMBER', 'LIKE', '%' . $searchValue['REIMBURSE_NUMBER'] . '%');
                }

                if ($searchValue['REIMBURSE_REQUESTED_BY']) {
                    $query->whereHas('employee',
                    function($data) use($searchValue)
                    {
                        $data->where('EMPLOYEE_FIRST_NAME', 'like', '%'. $searchValue['REIMBURSE_REQUESTED_BY'] .'%');
                    });
                }

                if ($searchValue['REIMBURSE_USED_BY']) {
                    $query->whereHas('employee_used_by',
                    function($data) use($searchValue)
                    {
                        $data->where('EMPLOYEE_FIRST_NAME', 'like', '%'. $searchValue['REIMBURSE_USED_BY'] .'%');
                    });
                }

                if ($searchValue['REIMBURSE_DIVISION']) {
                    $query->where('REIMBURSE_DIVISION', $searchValue['REIMBURSE_DIVISION']['value']);
                }

                if (
                    $searchValue['REIMBURSE_START_DATE'] &&
                    $searchValue['REIMBURSE_END_DATE']
                ) {
                    $query->whereBetween('REIMBURSE_REQUESTED_DATE', [$searchValue['REIMBURSE_START_DATE'], $searchValue['REIMBURSE_END_DATE']]);
                }

                if ($searchValue['REIMBURSE_COST_CENTER']) {
                    $query->where('REIMBURSE_COST_CENTER', $searchValue['REIMBURSE_COST_CENTER']['value']);
                }

                $approval_status = $searchValue["REIMBURSE_APPROVAL_STATUS"];

                if ($approval_status === "request") {
                    $query->where('REIMBURSE_FIRST_APPROVAL_STATUS', 1);
                } else if ($approval_status === "approve1") {
                    $query->where('REIMBURSE_FIRST_APPROVAL_STATUS', 2)
                        ->where('REIMBURSE_SECOND_APPROVAL_STATUS', null)
                        ->where('REIMBURSE_THIRD_APPROVAL_STATUS', null);
                } else if ($approval_status === "approve2") {
                    $query->where('REIMBURSE_SECOND_APPROVAL_STATUS', 2)
                        ->where('REIMBURSE_THIRD_APPROVAL_STATUS', null);
                } else if ($approval_status === "approve3") {
                    $query->where('REIMBURSE_THIRD_APPROVAL_STATUS', 2)
                        ->where('REIMBURSE_SECOND_APPROVAL_STATUS', '!=', 6);
                } else if ($approval_status === "revision") {
                    $query->where('REIMBURSE_FIRST_APPROVAL_STATUS', 3)
                        ->orWhere('REIMBURSE_SECOND_APPROVAL_STATUS', 3)
                        ->orWhere('REIMBURSE_THIRD_APPROVAL_STATUS', 3);
                } else if ($approval_status === "reject") {
                    $query->where('REIMBURSE_FIRST_APPROVAL_STATUS', 4)
                        ->orWhere('REIMBURSE_SECOND_APPROVAL_STATUS', 4)
                        ->orWhere('REIMBURSE_THIRD_APPROVAL_STATUS', 4);
                } else if ($approval_status === "complited") {
                    $query->where('REIMBURSE_SECOND_APPROVAL_STATUS', 6);
                }
            }
        }

        if ($filterModel) {
            foreach ($filterModel as $filterModelKey) {
                foreach ($filterModelKey as $filterValue) {
                    if ($filterValue === 'Execute') {
                        $query->where('REIMBURSE_SECOND_APPROVAL_STATUS', 6);
                    } elseif ($filterValue === 'Pending') {
                        $query->where(function ($subQuery) {
                            $subQuery->whereNull('REIMBURSE_SECOND_APPROVAL_STATUS')
                                    ->orWhere('REIMBURSE_SECOND_APPROVAL_STATUS', '!=', 6);
                        });
                    }
                }
            }
        }

        $query->orderBy('REIMBURSE_ID', 'desc');

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    public function getReimburse(Request $request)
    {
        $data = $this->getReimburseData($request);
        return response()->json($data);
    }

    public function getReimburseById(string $id) 
    {
        $data = Reimburse::findOrFail($id);
        return response()->json($data);
    }

    public function getCountReimburseRequestStatus()
    {
        $data = Reimburse::where('REIMBURSE_FIRST_APPROVAL_STATUS', 1)->count();

        return response()->json($data);
    }

    public function getCountReimburseApprove1Status()
    {
        $data = Reimburse::where('REIMBURSE_FIRST_APPROVAL_STATUS', 2)
                        ->where('REIMBURSE_SECOND_APPROVAL_STATUS', null)
                        ->where('REIMBURSE_THIRD_APPROVAL_STATUS', null)
                        ->count();

        return response()->json($data);
    }

    public function getCountReimburseApprove2Status()
    {
        $data = Reimburse::where('REIMBURSE_SECOND_APPROVAL_STATUS', 2)
                        ->where('REIMBURSE_THIRD_APPROVAL_STATUS', null)
                        ->count();

        return response()->json($data);
    }

    public function getCountReimburseApprove3Status()
    {
        $data = Reimburse::where('REIMBURSE_THIRD_APPROVAL_STATUS', 2)
                        ->where('REIMBURSE_SECOND_APPROVAL_STATUS', '!=', 6)
                        ->count();

        return response()->json($data);
    }

    public function getCountReimburseNeedRevisionStatus()
    {
        $data = Reimburse::where('REIMBURSE_FIRST_APPROVAL_STATUS', 3)
                            ->orWhere('REIMBURSE_SECOND_APPROVAL_STATUS', 3)
                            ->orWhere('REIMBURSE_THIRD_APPROVAL_STATUS', 3)
                            ->count();

        return response()->json($data);
    }

    public function getCountReimburseRejectStatus()
    {
        $data = Reimburse::where('REIMBURSE_FIRST_APPROVAL_STATUS', 4)
                            ->orWhere('REIMBURSE_SECOND_APPROVAL_STATUS', 4)
                            ->orWhere('REIMBURSE_THIRD_APPROVAL_STATUS', 4)
                            ->count();

        return response()->json($data);
    }

    public function getReimburseApproval()
    {
        $data = RCashAdvanceApproval::all();

        return response()->json($data);
    }

    public function getReimburseNotes()
    {
        $data = RReimburseNotes::all();

        return response()->json($data);
    }

    public function getReimburseMethod()
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

        return Inertia::render('Reimburse/Reimburse', $data);
    }

    public function generateReimburseNumber()
    {
        // Format kode
        $prefix = 'PV/REIM/';
        
        // Ambil tahun dan bulan saat ini
        $currentYear = date('Y');
        $currentMonth = date('n');

        // Cari kode terakhir dari tabel
        $lastCode = Reimburse::orderBy('REIMBURSE_CREATED_DATE', 'desc')->first();

        // Inisialisasi nomor urut
        $nextNumber = 1;

        if ($lastCode) {
            // Mengambil tahun dan bulan dari kode terakhir
            $lastCodeYear = substr($lastCode->REIMBURSE_NUMBER, 8, 4);
            $lastCodeMonth = substr($lastCode->REIMBURSE_NUMBER, 13, strlen($currentMonth));

            // Jika bulan dan tahun sama, lanjutkan increment nomor
            if ($lastCodeYear == $currentYear && $lastCodeMonth == $currentMonth) {
                $lastSequenceNumber = (int) substr($lastCode->REIMBURSE_NUMBER, -5);
                $nextNumber = $lastSequenceNumber + 1;
            }
        }

        // Format nomor urut dengan dengan menambahkan 0 di depan nomor urut
        $formattedNumber = str_pad($nextNumber, 5, '0', STR_PAD_LEFT);

        // Menggabungkan kode akhir
        $reimburseNumber = $prefix . "$currentYear/$currentMonth/$formattedNumber";

        return $reimburseNumber;
    }

    public function reimburse_doc_reader($reimburse_detail_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $reimburse_detail_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
        $document_dirname = $document->DOCUMENT_DIRNAME;

        $filePath = "/storage" . "/". $document_dirname . "/" . $document_filename;

        $data = [
            'uri' => $filePath
        ];

        return Inertia::render('Reimburse/ReimburseDocReader', $data);
    }

    public function reimburse_proof_of_document_doc_reader($reimburse_detail_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $reimburse_detail_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
        $document_dirname = $document->DOCUMENT_DIRNAME;

        $filePath = "/storage" . "/". $document_dirname . "/" . $document_filename;

        $data = [
            'uri' => $filePath
        ];

        return Inertia::render('Reimburse/ReimburseDocReader', $data);
    }

    public function download($reimburse_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $reimburse_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
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

    public function reimburse_proof_of_document_download($reimburse_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $reimburse_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reimburse_cost_center' => 'required',
            'reimburse_used_by' => 'required',
            'reimburse_branch' => 'required',
            'reimburse_first_approval_by' => 'required'
        ]);

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

            $reimburse_number = $this->generateReimburseNumber();
            $reimburse_used_by = $request->reimburse_used_by['value'];
            $reimburse_requested_by = $request->reimburse_requested_by;
            $reimburse_division = $request->reimburse_division;
            $reimburse_cost_center = $request->reimburse_cost_center['value'];
            $reimburse_branch = $request->reimburse_branch['value'];
            $reimburse_requested_date = now();
            $reimburse_first_approval_by = $request->reimburse_first_approval_by['value'];
            $reimburse_first_approval_user = $request->reimburse_first_approval_by['label'];
            $reimburse_first_approval_status = 1;
            $reimburse_request_note = $request->reimburse_request_note;
            $reimburse_total_amount = $request->reimburse_total_amount;
            $reimburse_created_date = now();
            $reimburse_created_by = $user_id;

            // Insert Reimburse
            $reimburse = Reimburse::create([
                'REIMBURSE_NUMBER' => $reimburse_number,
                'REIMBURSE_USED_BY' => $reimburse_used_by,
                'REIMBURSE_REQUESTED_BY' => $reimburse_requested_by,
                'REIMBURSE_DIVISION' => $reimburse_division,
                'REIMBURSE_COST_CENTER' => $reimburse_cost_center,
                'REIMBURSE_BRANCH' => $reimburse_branch,
                'REIMBURSE_REQUESTED_DATE' => $reimburse_requested_date,
                'REIMBURSE_FIRST_APPROVAL_BY' => $reimburse_first_approval_by,
                'REIMBURSE_FIRST_APPROVAL_USER' => $reimburse_first_approval_user,
                'REIMBURSE_FIRST_APPROVAL_STATUS' => $reimburse_first_approval_status,
                'REIMBURSE_REQUEST_NOTE' => $reimburse_request_note,
                'REIMBURSE_TOTAL_AMOUNT' => $reimburse_total_amount,
                'REIMBURSE_CREATED_DATE' => $reimburse_created_date,
                'REIMBURSE_CREATED_BY' => $reimburse_created_by
            ])->REIMBURSE_ID;

            // Created Log Reimburse
            user_log_create("Created (Reimburse).", "Reimburse", $reimburse);

            foreach ($request->ReimburseDetail as $rd) {
                $relation_organization_id = $rd['reimburse_detail_relation_organization_id'];

                $reimburse_detail_date = $rd['reimburse_detail_date'];
                $reimburse_detail_purpose = $rd['reimburse_detail_purpose'];
                $reimburse_detail_location = $rd['reimburse_detail_location'];
                $reimburse_detail_address = $rd['reimburse_detail_address'];
                $reimburse_detail_type = $rd['reimburse_detail_type'];
                $reimburse_detail_relation_organization_id = $relation_organization_id;
                if ($relation_organization_id != null || $relation_organization_id != "") {
                    $reimburse_detail_relation_organization_id = $relation_organization_id['value'];
                }
                $reimburse_detail_relation_name = $rd['reimburse_detail_relation_name'];
                $reimburse_detail_relation_position = $rd['reimburse_detail_relation_position'];
                $reimburse_detail_amount = $rd['reimburse_detail_amount'];
                
                // Insert Reimburse Detail
                $ReimburseDetail = ReimburseDetail::create([
                    'REIMBURSE_ID' => $reimburse,
                    'REIMBURSE_DETAIL_DATE' => $reimburse_detail_date,
                    'REIMBURSE_DETAIL_PURPOSE' => $reimburse_detail_purpose,
                    'REIMBURSE_DETAIL_LOCATION' => $reimburse_detail_location,
                    'REIMBURSE_DETAIL_ADDRESS' => $reimburse_detail_address,
                    'REIMBURSE_DETAIL_TYPE' => $reimburse_detail_type,
                    'REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID' => $reimburse_detail_relation_organization_id,
                    'REIMBURSE_DETAIL_RELATION_NAME' => $reimburse_detail_relation_name,
                    'REIMBURSE_DETAIL_RELATION_POSITION' => $reimburse_detail_relation_position,
                    'REIMBURSE_DETAIL_AMOUNT' => $reimburse_detail_amount
                ]);

                // Get data reimburse detail id
                $reimburse_detail_id = $ReimburseDetail->REIMBURSE_DETAIL_ID;

                // Start process file upload
                $files = $request->file('ReimburseDetail');
                if (is_array($files) && !empty($files)) {
                    if (isset($rd['reimburse_detail_document'])) {
                        foreach ($rd['reimburse_detail_document'] as $file) {
                            $parentDir = ((floor(($reimburse_detail_id) / 1000)) * 1000) . '/';
                            $CAId = $reimburse_detail_id . '/';
                            $typeDir = '';
                            $uploadPath = 'documents/' . 'Reimburse/'. $parentDir . $CAId . $typeDir;
        
                            $userId = $user->id;
        
                            $documentOriginalName =  replace_special_characters($file->getClientOriginalName());
                            $documentFileName =  $reimburse_detail_id . '-' . replace_special_characters($file->getClientOriginalName());
                            $documentDirName =  $uploadPath;
                            $documentFileType = $file->getMimeType();
                            $documentFileSize = $file->getSize();
        
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $file, $reimburse_detail_id . '-' . replace_special_characters($file->getClientOriginalName()));
        
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
                                MReimburseDocument::create([
                                    'REIMBURSE_DOCUMENT_REIMBURSE_DETAIL_ID' => $reimburse_detail_id,
                                    'REIMBURSE_DOCUMENT_REIMBURSE_DETAIL_DOCUMENT_ID' => $document,
                                    'REIMBURSE_DOCUMENT_CREATED_DATE' => now(),
                                    'REIMBURSE_DOCUMENT_CREATED_BY' => $userId,
                                ]);
                            }
                        }
                        
                    }
                }
                // End process file upload

                // Created Log Reimburse Detail
                user_log_create("Created (Reimburse Detail).", "Reimburse", $reimburse_detail_id);
            }
        });
        
        return new JsonResponse([
            'New Reimburse has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function approve(Request $request)
    {
        $reimburseStatus = DB::transaction(function () use ($request) {
            $reimburse_id = $request->REIMBURSE_ID;
            $reimburse_type = $request->REIMBURSE_TYPE;
            $reimburse_total_amount = $request->REIMBURSE_TOTAL_AMOUNT;
            $reimburse_total_amount_approve = $request->REIMBURSE_TOTAL_AMOUNT_APPROVE;
            $reimburse_total_amount_different = $reimburse_total_amount - $reimburse_total_amount_approve;

            $updateData = [
                'REIMBURSE_TYPE' => $reimburse_type,
                'REIMBURSE_TOTAL_AMOUNT' => $reimburse_total_amount,
                'REIMBURSE_TOTAL_AMOUNT_APPROVE' => $reimburse_total_amount_approve,
                'REIMBURSE_TOTAL_AMOUNT_DIFFERENT' => $reimburse_total_amount_different,
            ];

            $userDivisionId = Auth::user()->employee->division->COMPANY_DIVISION_ID;

            // Start logic condition revised
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->REIMBURSE_FIRST_APPROVAL_STATUS == 3) {
                $updateData['REIMBURSE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['REIMBURSE_FIRST_APPROVAL_STATUS'] = 3;
            }

            if ($userDivisionId === 132 && $request->REIMBURSE_SECOND_APPROVAL_STATUS == 3) {
                $updateData['REIMBURSE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['REIMBURSE_FIRST_APPROVAL_STATUS'] = 3;
            }

            if ($userDivisionId === 122 && $request->REIMBURSE_THIRD_APPROVAL_STATUS == 3) {
                $updateData['REIMBURSE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['REIMBURSE_FIRST_APPROVAL_STATUS'] = 3;
                $updateData['REIMBURSE_SECOND_APPROVAL_BY'] = null;
                $updateData['REIMBURSE_SECOND_APPROVAL_USER'] = null;
                $updateData['REIMBURSE_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['REIMBURSE_SECOND_APPROVAL_STATUS'] = null;
            }
            // End logic condition revised
            
            // Start logic condition approve
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->REIMBURSE_FIRST_APPROVAL_STATUS == 2) {
                $updateData['REIMBURSE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REIMBURSE_FIRST_APPROVAL_STATUS'] = $request->REIMBURSE_FIRST_APPROVAL_STATUS;
            }

            if ($userDivisionId === 132 && $request->REIMBURSE_SECOND_APPROVAL_STATUS == 2) {
                $updateData['REIMBURSE_SECOND_APPROVAL_BY'] = $request->REIMBURSE_SECOND_APPROVAL_BY;
                $updateData['REIMBURSE_SECOND_APPROVAL_USER'] = $request->REIMBURSE_SECOND_APPROVAL_USER;
                $updateData['REIMBURSE_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REIMBURSE_SECOND_APPROVAL_STATUS'] = $request->REIMBURSE_SECOND_APPROVAL_STATUS;
            }

            if ($userDivisionId === 122 && $request->REIMBURSE_THIRD_APPROVAL_STATUS == 2) {
                $updateData['REIMBURSE_THIRD_APPROVAL_BY'] = $request->REIMBURSE_THIRD_APPROVAL_BY;
                $updateData['REIMBURSE_THIRD_APPROVAL_USER'] = $request->REIMBURSE_THIRD_APPROVAL_USER;
                $updateData['REIMBURSE_THIRD_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REIMBURSE_THIRD_APPROVAL_STATUS'] = $request->REIMBURSE_THIRD_APPROVAL_STATUS;
            }
            // End logic condition approve

            // Start logic condition reject
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->REIMBURSE_FIRST_APPROVAL_STATUS == 4) {
                $updateData['REIMBURSE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REIMBURSE_FIRST_APPROVAL_STATUS'] = $request->REIMBURSE_FIRST_APPROVAL_STATUS;
            }

            if ($userDivisionId === 132 && $request->REIMBURSE_SECOND_APPROVAL_STATUS == 4) {
                $updateData['REIMBURSE_SECOND_APPROVAL_BY'] = $request->REIMBURSE_SECOND_APPROVAL_BY;
                $updateData['REIMBURSE_SECOND_APPROVAL_USER'] = $request->REIMBURSE_SECOND_APPROVAL_USER;
                $updateData['REIMBURSE_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REIMBURSE_SECOND_APPROVAL_STATUS'] = $request->REIMBURSE_SECOND_APPROVAL_STATUS;
            }

            if ($userDivisionId === 122 && $request->REIMBURSE_THIRD_APPROVAL_STATUS == 4) {
                $updateData['REIMBURSE_THIRD_APPROVAL_BY'] = $request->REIMBURSE_THIRD_APPROVAL_BY;
                $updateData['REIMBURSE_THIRD_APPROVAL_USER'] = $request->REIMBURSE_THIRD_APPROVAL_USER;
                $updateData['REIMBURSE_THIRD_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REIMBURSE_THIRD_APPROVAL_STATUS'] = $request->REIMBURSE_THIRD_APPROVAL_STATUS;
            }
            // End logic condition reject

            Reimburse::where('REIMBURSE_ID', $reimburse_id)->update($updateData);

            // Create log reimburse
            user_log_create("Approve (Reimburse).", "Reimburse", $reimburse_id);

            $reimburse_detail = $request->reimburse_detail;
            if (is_array($reimburse_detail) && !empty($reimburse_detail)) {
                foreach ($reimburse_detail as $rd) {
                    $cost_classification = $rd['REIMBURSE_DETAIL_COST_CLASSIFICATION'];
    
                    $reimburse_detail_id = $rd['REIMBURSE_DETAIL_ID'];
                    $reimburse_detail_approval = $rd['REIMBURSE_DETAIL_APPROVAL'];
                    $reimburse_detail_amount_approve = $rd['REIMBURSE_DETAIL_AMOUNT_APPROVE'];
                    $reimburse_detail_remarks = $rd['REIMBURSE_DETAIL_REMARKS'];
                    $reimburse_detail_cost_classification = $rd['REIMBURSE_DETAIL_COST_CLASSIFICATION'];
                    
                    if ($cost_classification != null || $cost_classification != "") {
                        $reimburse_detail_cost_classification = $cost_classification;
                    }
                    
                    ReimburseDetail::where('REIMBURSE_DETAIL_ID', $reimburse_detail_id)->update([
                        'REIMBURSE_DETAIL_APPROVAL' => $reimburse_detail_approval,
                        'REIMBURSE_DETAIL_COST_CLASSIFICATION' => $reimburse_detail_cost_classification,
                        'REIMBURSE_DETAIL_AMOUNT_APPROVE' => $reimburse_detail_amount_approve,
                        'REIMBURSE_DETAIL_REMARKS' => $reimburse_detail_remarks
                    ]);
    
                    // Created Log Reimburse Detail
                    user_log_create("Approve (Reimburse Detail).", "Reimburse", $reimburse_detail_id);
                }
            }
            
            if ($userDivisionId !== 132 && $userDivisionId !== 122) {
                return $request->REIMBURSE_FIRST_APPROVAL_STATUS;
            }
            
            if ($userDivisionId === 132) {
                return $request->REIMBURSE_SECOND_APPROVAL_STATUS;
            }
            
            if ($userDivisionId === 122) {
                return $request->REIMBURSE_THIRD_APPROVAL_STATUS;
            }  
        });

        if ($reimburseStatus === 2) {
            $alertText = "Reimburse has been approved";
        } else if ($reimburseStatus === 3) {
            $alertText = "Reimburse needs to be revised";
        } else if ($reimburseStatus === 4) {
            $alertText = "Reimburse rejected";
        } else {
            $alertText = "Reimburse status not found";
        }
        
        return new JsonResponse([
            $alertText
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function revised(Request $request)
    {
        DB::transaction(function () use ($request) {
            $user = Auth::user();
            $user_id = $user->id;
            
            $reimburse_id = $request->REIMBURSE_ID;
            $reimburse_total_amount = $request->REIMBURSE_TOTAL_AMOUNT;
            $reimburse_first_approval_status = 1;
            $reimburse_request_note = $request->REIMBURSE_REQUEST_NOTE;
            $reimburse_updated_date = now();
            $reimburse_updated_by = $user_id;
    
            Reimburse::where('REIMBURSE_ID', $reimburse_id)->update([
                'REIMBURSE_FIRST_APPROVAL_STATUS' => $reimburse_first_approval_status,
                'REIMBURSE_REQUEST_NOTE' => $reimburse_request_note,
                'REIMBURSE_TOTAL_AMOUNT' => $reimburse_total_amount,
                'REIMBURSE_UPDATED_DATE' => $reimburse_updated_date,
                'REIMBURSE_UPDATED_BY' => $reimburse_updated_by
            ]);
    
            // Created Log Reimburse
            user_log_create("Revised (Reimburse).", "Reimburse", $reimburse_id);
    
            foreach ($request->reimburse_detail as $rd) {
                $relation_organization_id = isset($rd['REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID']) ? $rd['REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID'] : null;
                $relation_name = isset($rd['REIMBURSE_DETAIL_RELATION_NAME']) ? $rd['REIMBURSE_DETAIL_RELATION_NAME'] : null;
                $relation_position = isset($rd['REIMBURSE_DETAIL_RELATION_POSITION']) ? $rd['REIMBURSE_DETAIL_RELATION_POSITION'] : null;

                $reimburse_detail_id = $rd['REIMBURSE_DETAIL_ID'];
                $reimburse_detail_date = $rd['REIMBURSE_DETAIL_DATE'];
                $reimburse_detail_purpose = $rd['REIMBURSE_DETAIL_PURPOSE'];
                $reimburse_detail_location = $rd['REIMBURSE_DETAIL_LOCATION'];
                $reimburse_detail_address = $rd['REIMBURSE_DETAIL_ADDRESS'];
                $reimburse_detail_type = $rd['REIMBURSE_DETAIL_TYPE'];
                $reimburse_detail_relation_organization_id = !empty($relation_organization_id) ? $relation_organization_id : null;
                $reimburse_detail_relation_name = !empty($relation_name) ? $relation_name : null;
                $reimburse_detail_relation_position = !empty($relation_position) ? $relation_position : null;
                $reimburse_detail_amount = $rd['REIMBURSE_DETAIL_AMOUNT'];
                
                $ReimburseDetail = ReimburseDetail::updateOrCreate(
                [
                    'REIMBURSE_DETAIL_ID' => $reimburse_detail_id
                ],
                [
                    'REIMBURSE_ID' => $reimburse_id,
                    'REIMBURSE_DETAIL_DATE' => $reimburse_detail_date,
                    'REIMBURSE_DETAIL_PURPOSE' => $reimburse_detail_purpose,
                    'REIMBURSE_DETAIL_LOCATION' => $reimburse_detail_location,
                    'REIMBURSE_DETAIL_ADDRESS' => $reimburse_detail_address,
                    'REIMBURSE_DETAIL_TYPE' => $reimburse_detail_type,
                    'REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID' => $reimburse_detail_relation_organization_id,
                    'REIMBURSE_DETAIL_RELATION_NAME' => $reimburse_detail_relation_name,
                    'REIMBURSE_DETAIL_RELATION_POSITION' => $reimburse_detail_relation_position,
                    'REIMBURSE_DETAIL_AMOUNT' => $reimburse_detail_amount
                ]);
    
                $reimburseDetailId = $ReimburseDetail->REIMBURSE_DETAIL_ID;
    
                $files = $request->file('reimburse_detail');
                
                if (is_array($files) && !empty($files)) {
                    if(isset($rd['filesDocument'])) {
                        foreach ($rd['filesDocument'] as $file) {
                            $uploadFile = $file['REIMBURSE_DETAIL_DOCUMENT'];
                        
                            $parentDir = ((floor(($reimburseDetailId) / 1000)) * 1000) . '/';
                            $CAId = $reimburseDetailId . '/';
                            $typeDir = '';
                            $uploadPath = 'documents/' . 'Reimburse/'. $parentDir . $CAId . $typeDir;
            
                            $userId = $user->id;
            
                            $documentOriginalName =  replace_special_characters($uploadFile->getClientOriginalName());
                            $documentFileName =  $reimburseDetailId . '-' . replace_special_characters($uploadFile->getClientOriginalName());
                            $documentDirName =  $uploadPath;
                            $documentFileType = $uploadFile->getMimeType();
                            $documentFileSize = $uploadFile->getSize();
            
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $uploadFile, $reimburseDetailId . '-' . replace_special_characters($uploadFile->getClientOriginalName()));
            
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
                                MReimburseDocument::create([
                                    'REIMBURSE_DOCUMENT_REIMBURSE_DETAIL_ID' => $reimburseDetailId,
                                    'REIMBURSE_DOCUMENT_REIMBURSE_DETAIL_DOCUMENT_ID' => $document,
                                    'REIMBURSE_DOCUMENT_CREATED_DATE' => now(),
                                    'REIMBURSE_DOCUMENT_CREATED_BY' => $userId,
                                ]);
                            }
                        }
                    }
                }
    
                // Created Log Reimburse Detail
                user_log_create("Revised (Reimburse Detail).", "Reimburse", $reimburse_detail_id);
            }
    
            // Delete row from table cash advance detail
            $deletedRows = $request->deletedRow;
            if($deletedRows) {
                foreach ($deletedRows as $deletedRow) {
                    $reimburseDetailId = $deletedRow['REIMBURSE_DETAIL_ID'];
                    
                    $filePath = '/documents/Reimburse/0/' . $reimburseDetailId;
    
                    // Delete data document from directory
                    if(Storage::disk('public')->exists($filePath)) {   
                        Storage::disk('public')->deleteDirectory($filePath);
                    } 
    
                    // Delete row from table reimburse detail
                    ReimburseDetail::destroy($reimburseDetailId);
                }
            }
    
            // Delete document
            $deletedDocuments = $request->deletedDocument;
            if ($deletedDocuments) {
                foreach ($deletedDocuments as $document_value) {
                    // Get Data Document
                    $documentId = $document_value['DOCUMENT_ID'];
                    $reimburseDetailId = $document_value['REIMBURSE_DETAIL_ID'];
    
                    $getDocument = Document::find($documentId);
    
                    $documentFilename = $reimburseDetailId . '-' . $getDocument->DOCUMENT_ORIGINAL_NAME;
                    $documentDirname = $getDocument->DOCUMENT_DIRNAME;
                    
                    $filePath = '/'. $documentDirname . '/' . $documentFilename;
    
                    // Delete data document from directory
                    if(Storage::disk('public')->exists($filePath)) {   
                        Storage::disk('public')->delete($filePath);
                    } 
    
                    // Delete data from table m_reimburse_document
                    MReimburseDocument::where('REIMBURSE_DOCUMENT_REIMBURSE_DETAIL_DOCUMENT_ID', $documentId)->delete();
    
                    // Delete data from table t_document
                    Document::destroy($documentId);
                }
            }
        });
        
        return new JsonResponse([
            'Reimburse has been revised.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function execute(Request $request)
    {
        DB::transaction(function () use ($request) {
            $reimburse_id = $request->reimburse_id;
            $reimburse_second_approval_status = 6;
            $reimburse_method = $request->reimburse_method;
            $reimburse_settlement_date = $request->reimburse_settlement_date;
    
            Reimburse::where('REIMBURSE_ID', $reimburse_id)->update([
                'REIMBURSE_SECOND_APPROVAL_STATUS' => $reimburse_second_approval_status,
                'REIMBURSE_METHOD' => $reimburse_method,
                'REIMBURSE_SETTLEMENT_DATE' => $reimburse_settlement_date
            ]);
    
            // Start process file upload
            $files = $request->file('proof_of_document');
            if (is_array($files) && !empty($files)) {
                foreach ($files as $file) {
                    $uploadedFile = $file['proof_of_document'];
                    $parentDir = ((floor(($reimburse_id) / 1000)) * 1000) . '/';
                    $CAId = $reimburse_id . '/';
                    $typeDir = '';
                    $uploadPath = 'documents/' . 'ReimburseProofOfDocument/'. $parentDir . $CAId . $typeDir;
    
                    $userId = Auth::user()->id;
    
                    $documentOriginalName =  replace_special_characters($uploadedFile->getClientOriginalName());
                    $documentFileName =  $reimburse_id . '-' . replace_special_characters($uploadedFile->getClientOriginalName());
                    $documentDirName  =  $uploadPath;
                    $documentFileType = $uploadedFile->getMimeType();
                    $documentFileSize = $uploadedFile->getSize();
    
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $uploadedFile, $reimburse_id . '-' . replace_special_characters($uploadedFile->getClientOriginalName()));
    
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
                        MReimburseProofOfDocument::create([
                            'REIMBURSE_PROOF_OF_DOCUMENT_REIMBURSE_ID' => $reimburse_id,
                            'REIMBURSE_PROOF_OF_DOCUMENT_REIMBURSE_DOCUMENT_ID' => $document,
                            'REIMBURSE_PROOF_OF_DOCUMENT_CREATED_DATE' => now(),
                            'REIMBURSE_PROOF_OF_DOCUMENT_CREATED_BY' => $userId,
                        ]);
                    }
                }
            }
    
            // Created Log Reimburse Detail
            user_log_create("Execute (Reimburse).", "Reimburse", $reimburse_id);
        });
        
        return new JsonResponse([
            'Reimburse has been execute.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}