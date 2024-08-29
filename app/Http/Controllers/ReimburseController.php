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
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ReimburseController extends Controller
{
    public function getReimburseData($dataPerPage = 2, $searchQuery = null)
    {
        $reimburse_requested_by = $searchQuery->reimburse_requested_by;
        $reimburse_used_by = $searchQuery->reimburse_used_by;
        $reimburse_start_date = $searchQuery->reimburse_start_date;
        $reimburse_end_date = $searchQuery->reimburse_end_date;
        $reimburse_division = $searchQuery->reimburse_division;
        $reimburse_cost_center = $searchQuery->reimburse_cost_center;
        $status = $searchQuery->status;
        $status_type = $searchQuery->status_type;

        $data = Reimburse::orderBy('REIMBURSE_ID', 'desc');
        
        if ($searchQuery) {
            if ($searchQuery->input('reimburse_requested_by')) {
                $data->whereHas('employee',
                function($query) use($reimburse_requested_by)
                {
                    $query->where('EMPLOYEE_FIRST_NAME', 'like', '%'. $reimburse_requested_by .'%');
                });
            }

            if ($searchQuery->input('reimburse_used_by')) {
                $data->whereHas('employee_used_by',
                function($query) use($reimburse_used_by)
                {
                    $query->where('EMPLOYEE_FIRST_NAME', 'like', '%'. $reimburse_used_by .'%');
                });
            }

            if (
                $searchQuery->input('reimburse_start_date') &&
                $searchQuery->input('reimburse_end_date')
            ) {
                $data->whereBetween('REIMBURSE_REQUESTED_DATE', [$reimburse_start_date, $reimburse_end_date]);
            }

            if ($searchQuery->input('reimburse_division')) {
                $data->whereHas('division',
                function($query) use($reimburse_division)
                {
                    $query->where('COMPANY_DIVISION_ALIAS', 'like', '%'. $reimburse_division .'%')
                            ->orWhere('COMPANY_DIVISION_INITIAL', 'like', '%'. $reimburse_division .'%');
                });
            }

            if ($searchQuery->input('reimburse_cost_center')) {
                $data->whereHas('cost_center',
                function($query) use($reimburse_cost_center)
                {
                    $query->where('COMPANY_DIVISION_ALIAS', 'like', '%'. $reimburse_cost_center .'%')
                            ->orWhere('COMPANY_DIVISION_INITIAL', 'like', '%'. $reimburse_cost_center .'%');
                });
            }

            if ($status == 1 && $status_type == "Approve1") {
                $data->where('REIMBURSE_FIRST_APPROVAL_STATUS', 1);
            } else if ($status == 2 && $status_type == "Approve1") {
                $data->where('REIMBURSE_FIRST_APPROVAL_STATUS', 2);
            } else if ($status == 2 && $status_type == "Approve2") {
                $data->where('REIMBURSE_SECOND_APPROVAL_STATUS', 2);
            } else if ($status == 2 && $status_type == "Approve3") {
                $data->where('REIMBURSE_THIRD_APPROVAL_STATUS', 2);
            } else if ($status == 3 && $status_type == "Need Revision") {
                $data->where('REIMBURSE_FIRST_APPROVAL_STATUS', 3)
                    ->orWhere('REIMBURSE_SECOND_APPROVAL_STATUS', 3)
                    ->orWhere('REIMBURSE_THIRD_APPROVAL_STATUS', 3);
            } else if ($status == 4 && $status_type == "Reject") {
                $data->where('REIMBURSE_FIRST_APPROVAL_STATUS', 4)
                ->orWhere('REIMBURSE_SECOND_APPROVAL_STATUS', 4)
                ->orWhere('REIMBURSE_THIRD_APPROVAL_STATUS', 4);
            } else if ($status == 6 && $status_type == "Complited") {
                $data->where('REIMBURSE_SECOND_APPROVAL_STATUS', 6);
            }
        }

        return $data->paginate($dataPerPage);
    }

    public function getReportCAData($dataPerPage = 2, $searchQuery = null)
    {
        $data = Reimburse::orderBy('REIMBURSE_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('REIMBURSE_NUMBER')) {
                $data->where('REIMBURSE_NUMBER', 'like', '%'.$searchQuery->REIMBURSE_NUMBER.'%');
            }
        }

        return $data->paginate($dataPerPage);
    }

    public function getReimburse(Request $request)
    {
        $data = $this->getReimburseData(10, $request);
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
        $data = Reimburse::where('REIMBURSE_FIRST_APPROVAL_STATUS', 2)->count();

        return response()->json($data);
    }

    public function getCountReimburseApprove2Status()
    {
        $data = Reimburse::where('REIMBURSE_SECOND_APPROVAL_STATUS', 2)->count();

        return response()->json($data);
    }

    public function getCountReimburseApprove3Status()
    {
        $data = Reimburse::where('REIMBURSE_THIRD_APPROVAL_STATUS', 2)->count();

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

    public function RemoveSpecialChar($str) 
    {
        $replace = Str::of($str)->replace(
            [
                '`',
                '~',
                ' ',
                '!',
                '@',
                '#',
                '$',
                '%',
                '^',
                '&',
                '*',
                '(',
                ')',
                '+',
                '=',
                '<',
                '>',
                '{',
                '}',
                '[',
                ']',
                '?',
                '/',
                ':',
                ';'
            ], 
            '-'
        );
        return $replace;
    }

    public function getReimburseNumber()
    {
        $code = 'PV/REIM/';
        $start_char = 15;
        $start_char_2 = 8;
        
        $year_month = date('Y/n').'/';

        $queries = DB::select('SELECT MAX(REIMBURSE_NUMBER) AS max_number FROM t_reimburse');

        foreach ($queries as $query) {
            $getMaxNumber = $query->max_number;
        }

        $count = (int) Str::substr($getMaxNumber, $start_char, 5);

        if ($year_month == Str::substr($getMaxNumber, $start_char_2, 7)) {
            $count++;
        } else {
            $count = 1; 
        }
        
        $counting = sprintf('%05s', $count);

        $reimburse_number = $code . $year_month . $counting;

        return $reimburse_number;
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

            $total_amount = 0;

            foreach ($request->ReimburseDetail as $value) {
                $total_amount += $value['reimburse_detail_amount'];
            }

            $reimburse_number = $this->getReimburseNumber();
            $reimburse_used_by = $request->reimburse_used_by['value'];
            $reimburse_requested_by = $user_id;
            $reimburse_division = $request->reimburse_division;
            $reimburse_cost_center = $request->reimburse_cost_center['value'];
            $reimburse_branch = $request->reimburse_branch['value'];
            $reimburse_requested_date = now();
            $reimburse_first_approval_by = $request->reimburse_first_approval_by['value'];
            $reimburse_first_approval_user = $request->reimburse_first_approval_by['label'];
            $reimburse_first_approval_status = 1;
            $reimburse_request_note = $request->reimburse_request_note;
            $reimburse_total_amount = $total_amount;
            $reimburse_created_at = now();
            $reimburse_created_by = $user_id;

            // Insert CA
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
                'REIMBURSE_CREATED_AT' => $reimburse_created_at,
                'REIMBURSE_CREATED_BY' => $reimburse_created_by
            ])->REIMBURSE_ID;

            // Created Log CA
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Created (Reimburse).",
                    "module"      => "Reimburse",
                    "id"          => $reimburse
                ]),
                'action_by'  => Auth::user()->email
            ]);

            foreach ($request->ReimburseDetail as $rd) {
                $relation_organization_id = $rd['reimburse_detail_relation_organization_id'];

                $reimburse_detail_date = $rd['reimburse_detail_date'];
                $reimburse_detail_purpose = $rd['reimburse_detail_purpose'];
                $reimburse_detail_location = $rd['reimburse_detail_location'];
                $reimburse_detail_address = $rd['reimburse_detail_address'];
                $reimburse_detail_type = $rd['reimburse_detail_type'];
                $reimburse_detail_relation_organization_id = $relation_organization_id;
                if ($relation_organization_id != null || $relation_organization_id != "") {
                    $reimburse_detail_relation_organization_id = $rd['reimburse_detail_relation_organization_id']['value'];
                }
                $reimburse_detail_relation_name = $rd['reimburse_detail_relation_name'];
                $reimburse_detail_relation_position = $rd['reimburse_detail_relation_position'];
                $reimburse_detail_amount = $rd['reimburse_detail_amount'];
                
                // Insert CA Detail
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
        
                            $userId = Auth::user()->id;
        
                            $documentOriginalName =  $this->RemoveSpecialChar($file->getClientOriginalName());
                            $documentFileName =  $reimburse_detail_id . '-' . $this->RemoveSpecialChar($file->getClientOriginalName());
                            $documentDirName =  $uploadPath;
                            $documentFileType = $file->getMimeType();
                            $documentFileSize = $file->getSize();
        
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $file, $reimburse_detail_id . '-' . $this->RemoveSpecialChar($file->getClientOriginalName()));
        
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
                                    'REIMBURSE_DOCUMENT_CREATED_AT' => now(),
                                    'REIMBURSE_DOCUMENT_CREATED_BY' => $userId,
                                ]);
                            }
                        }
                        
                    }
                }
                // End process file upload

                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Created (Reimburse Detail).",
                        "module"      => "Reimburse",
                        "id"          => $reimburse_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }

            return new JsonResponse([
                'New Reimburse has been added.'
            ], 201, [
                'X-Inertia' => true
            ]);
        });
    }

    public function approve(Request $request)
    {
        DB::transaction(function () use ($request) {
            $reimburse_detail = $request->reimburse_detail;
    
            $total_amount_approve = 0;
    
            if (is_array($reimburse_detail) && !empty($reimburse_detail)) {
                foreach ($request->reimburse_detail as $value) {
                    $total_amount_approve += $value['REIMBURSE_DETAIL_AMOUNT_APPROVE'];
                }
            }
    
            $reimburse_total_amount_different = $request->REIMBURSE_TOTAL_AMOUNT - $total_amount_approve;
    
            $reimburse_id = $request->REIMBURSE_ID;
            $reimburse_first_approval_change_status_date = date('Y-m-d H:i:s');
            $reimburse_first_approval_status = $request->REIMBURSE_FIRST_APPROVAL_STATUS;
            $reimburse_type = $request->REIMBURSE_TYPE;
            $reimburse_total_amount = $request->REIMBURSE_TOTAL_AMOUNT;
            $reimburse_total_amount_approve = $total_amount_approve;
    
            Reimburse::where('REIMBURSE_ID', $reimburse_id)->update([
                'REIMBURSE_FIRST_APPROVAL_CHANGE_STATUS_DATE' => $reimburse_first_approval_change_status_date,
                'REIMBURSE_FIRST_APPROVAL_STATUS' => $reimburse_first_approval_status,
                'REIMBURSE_TYPE' => $reimburse_type,
                'REIMBURSE_TOTAL_AMOUNT' => $reimburse_total_amount,
                'REIMBURSE_TOTAL_AMOUNT_APPROVE' => $reimburse_total_amount_approve,
                'REIMBURSE_TOTAL_AMOUNT_DIFFERENT' => $reimburse_total_amount_different,
            ]);

            $second_approval_status = $request->REIMBURSE_SECOND_APPROVAL_STATUS;

            if ($second_approval_status != null && $second_approval_status != "") {
                $reimburse_second_approval_by = $request->REIMBURSE_SECOND_APPROVAL_BY;
                $reimburse_second_approval_user = $request->REIMBURSE_SECOND_APPROVAL_USER;
                $reimburse_second_approval_change_status_date = date('Y-m-d H:i:s');
                $reimburse_second_approval_status = $second_approval_status;

                Reimburse::where('REIMBURSE_ID', $reimburse_id)->update([
                    'REIMBURSE_SECOND_APPROVAL_BY' => $reimburse_second_approval_by,
                    'REIMBURSE_SECOND_APPROVAL_USER' => $reimburse_second_approval_user,
                    'REIMBURSE_SECOND_APPROVAL_CHANGE_STATUS_DATE' => $reimburse_second_approval_change_status_date,
                    'REIMBURSE_SECOND_APPROVAL_STATUS' => $reimburse_second_approval_status,
                    'REIMBURSE_TYPE' => $reimburse_type,
                    'REIMBURSE_TOTAL_AMOUNT' => $reimburse_total_amount,
                    'REIMBURSE_TOTAL_AMOUNT_APPROVE' => $reimburse_total_amount_approve,
                    'REIMBURSE_TOTAL_AMOUNT_DIFFERENT' => $reimburse_total_amount_different,
                ]);
            }
            
            $third_approval_status = $request->REIMBURSE_THIRD_APPROVAL_STATUS;
            if ($third_approval_status != null && $third_approval_status != "") {
                $reimburse_third_approval_by = $request->REIMBURSE_THIRD_APPROVAL_BY;
                $reimburse_third_approval_user = $request->REIMBURSE_THIRD_APPROVAL_USER;
                $reimburse_third_approval_change_status_date = date('Y-m-d H:i:s');
                $reimburse_third_approval_status = $third_approval_status;

                Reimburse::where('REIMBURSE_ID', $reimburse_id)->update([
                    'REIMBURSE_THIRD_APPROVAL_BY' => $reimburse_third_approval_by,
                    'REIMBURSE_THIRD_APPROVAL_USER' => $reimburse_third_approval_user,
                    'REIMBURSE_THIRD_APPROVAL_CHANGE_STATUS_DATE' => $reimburse_third_approval_change_status_date,
                    'REIMBURSE_THIRD_APPROVAL_STATUS' => $reimburse_third_approval_status,
                    'REIMBURSE_TYPE' => $reimburse_type,
                    'REIMBURSE_TOTAL_AMOUNT' => $reimburse_total_amount,
                    'REIMBURSE_TOTAL_AMOUNT_APPROVE' => $reimburse_total_amount_approve,
                    'REIMBURSE_TOTAL_AMOUNT_DIFFERENT' => $reimburse_total_amount_different,
                ]);
            }
    
            // Created Log CA
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Approve (Reimburse).",
                    "module"      => "Reimburse",
                    "id"          => $reimburse_id
                ]),
                'action_by'  => Auth::user()->email
            ]);
    
            if (is_array($reimburse_detail) && !empty($reimburse_detail)) {
                foreach ($reimburse_detail as $rd) {
                    $cost_classification = $rd['REIMBURSE_DETAIL_COST_CLASSIFICATION'];
    
                    $reimburse_detail_id = $rd['REIMBURSE_DETAIL_ID'];
                    $reimburse_detail_approval = $rd['REIMBURSE_DETAIL_APPROVAL'];
                    $reimburse_detail_amount_approve = $rd['REIMBURSE_DETAIL_AMOUNT_APPROVE'];
                    $reimburse_detail_remarks = $rd['REIMBURSE_DETAIL_REMARKS'];
                    $reimburse_detail_cost_classification = $rd['REIMBURSE_DETAIL_COST_CLASSIFICATION'];
                    
                    if ($cost_classification != null || $cost_classification != "") {
                        $reimburse_detail_cost_classification = $cost_classification['value'];
                    }
                    
                    ReimburseDetail::where('REIMBURSE_DETAIL_ID', $reimburse_detail_id)->update([
                        'REIMBURSE_DETAIL_APPROVAL' => $reimburse_detail_approval,
                        'REIMBURSE_DETAIL_COST_CLASSIFICATION' => $reimburse_detail_cost_classification,
                        'REIMBURSE_DETAIL_AMOUNT_APPROVE' => $reimburse_detail_amount_approve,
                        'REIMBURSE_DETAIL_REMARKS' => $reimburse_detail_remarks
                    ]);
    
                    // Created Log CA Detail
                    UserLog::create([
                        'created_by' => Auth::user()->id,
                        'action'     => json_encode([
                            "description" => "Approve (Reimburse).",
                            "module"      => "Reimburse",
                            "id"          => $reimburse_detail_id
                        ]),
                        'action_by'  => Auth::user()->email
                    ]);
                }
            }
    
            return new JsonResponse([
                'Reimburse has been approved.'
            ], 201, [
                'X-Inertia' => true
            ]);
        });
    }

    public function revised(Request $request)
    {
        DB::transaction(function () use ($request) {
            $user = Auth::user();
            $user_id = $user->id;
            
            $reimburse_id = $request->REIMBURSE_ID;
    
            $total_amount = 0;
    
            foreach ($request->reimburse_detail as $value) {
                $total_amount += $value['REIMBURSE_DETAIL_AMOUNT'];
            }
    
            $reimburse_total_amount = $total_amount;
            $reimburse_first_approval_status = 1;
            $reimburse_request_note = $request->REIMBURSE_REQUEST_NOTE;
            $reimburse_updated_at = now();
            $reimburse_updated_by = $user_id;
    
            Reimburse::where('REIMBURSE_ID', $reimburse_id)->update([
                'REIMBURSE_FIRST_APPROVAL_STATUS' => $reimburse_first_approval_status,
                'REIMBURSE_REQUEST_NOTE' => $reimburse_request_note,
                'REIMBURSE_TOTAL_AMOUNT' => $reimburse_total_amount,
                'REIMBURSE_UPDATED_AT' => $reimburse_updated_at,
                'REIMBURSE_UPDATED_BY' => $reimburse_updated_by
            ]);
    
            // Created Log CA
            UserLog::create([
                'created_by' => $user->id,
                'action'     => json_encode([
                    "description" => "Revised (Reimburse).",
                    "module"      => "Reimburse",
                    "id"          => $reimburse_id
                ]),
                'action_by'  => $user->email
            ]);
    
            foreach ($request->reimburse_detail as $rd) {
                $relation_organization_id = $rd['REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID'];
    
                $reimburse_detail_id = $rd['REIMBURSE_DETAIL_ID'];
                $reimburse_detail_date = $rd['REIMBURSE_DETAIL_DATE'];
                $reimburse_detail_purpose = $rd['REIMBURSE_DETAIL_PURPOSE'];
                $reimburse_detail_location = $rd['REIMBURSE_DETAIL_LOCATION'];
                $reimburse_detail_address = $rd['REIMBURSE_DETAIL_ADDRESS'];
                $reimburse_detail_type = $rd['REIMBURSE_DETAIL_TYPE'];
                $reimburse_detail_relation_organization_id = $relation_organization_id;
                if ($relation_organization_id != NULL || $relation_organization_id != "") {
                    $reimburse_detail_relation_organization_id = $rd['REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID'];
                }
                $reimburse_detail_relation_name = $rd['REIMBURSE_DETAIL_RELATION_NAME'];
                $reimburse_detail_relation_position = $rd['REIMBURSE_DETAIL_RELATION_POSITION'];
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
            
                            $documentOriginalName =  $this->RemoveSpecialChar($uploadFile->getClientOriginalName());
                            $documentFileName =  $reimburseDetailId . '-' . $this->RemoveSpecialChar($uploadFile->getClientOriginalName());
                            $documentDirName =  $uploadPath;
                            $documentFileType = $uploadFile->getMimeType();
                            $documentFileSize = $uploadFile->getSize();
            
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $uploadFile, $reimburseDetailId . '-' . $this->RemoveSpecialChar($uploadFile->getClientOriginalName()));
            
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
                                    'REIMBURSE_DOCUMENT_CREATED_AT' => now(),
                                    'REIMBURSE_DOCUMENT_CREATED_BY' => $userId,
                                ]);
                            }
                        }
                    }
                }
    
                // Created Log CA Detail
                UserLog::create([
                    'created_by' => $user->id,
                    'action'     => json_encode([
                        "description" => "Revised (Reimburse Detail).",
                        "module"      => "Reimburse",
                        "id"          => $reimburse_detail_id
                    ]),
                    'action_by'  => $user->email
                ]);
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
    
            return new JsonResponse([
                'Reimburse has been revised.'
            ], 201, [
                'X-Inertia' => true
            ]);
        });
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
    
                    $documentOriginalName =  $this->RemoveSpecialChar($uploadedFile->getClientOriginalName());
                    $documentFileName =  $reimburse_id . '-' . $this->RemoveSpecialChar($uploadedFile->getClientOriginalName());
                    $documentDirName  =  $uploadPath;
                    $documentFileType = $uploadedFile->getMimeType();
                    $documentFileSize = $uploadedFile->getSize();
    
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $uploadedFile, $reimburse_id . '-' . $this->RemoveSpecialChar($uploadedFile->getClientOriginalName()));
    
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
                            'REIMBURSE_PROOF_OF_DOCUMENT_CREATED_AT' => now(),
                            'REIMBURSE_PROOF_OF_DOCUMENT_CREATED_BY' => $userId,
                        ]);
                    }
                }
            }
    
            // Created Log CA Detail
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Execute (Reimburse).",
                    "module"      => "Reimburse",
                    "id"          => $reimburse_id
                ]),
                'action_by'  => Auth::user()->email
            ]);
    
            return new JsonResponse([
                'Reimburse has been execute.'
            ], 201, [
                'X-Inertia' => true
            ]);
        });
    }
}