<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\CashAdvanceCostClassification;
use App\Models\CashAdvanceDetail;
use App\Models\CashAdvancePurpose;
use App\Models\CashAdvanceReport;
use App\Models\COA;
use App\Models\MCashAdvanceDocument;
use App\Models\Relation;
use App\Models\Document;
use App\Models\TCompany;
use App\Models\TCompanyDivision;
use App\Models\TCompanyOffice;
use App\Models\TEmployee;
use App\Models\TEmployeeBankAccount;
use App\Models\TPerson;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;

use function App\Helpers\replace_special_characters;
use function App\Helpers\user_log_create;

class CashAdvanceController extends Controller
{
    public function getCAData($request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = CashAdvance::query()->with(['cash_advance_report']);
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
                $query->where('CASH_ADVANCE_ID', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
            }

            foreach ($newSearch as $searchValue) {
                $cash_advance_type = $searchValue['CASH_ADVANCE_TYPE'];

                if ($cash_advance_type == 1 || $cash_advance_type == "") {
                    if ($searchValue['CASH_ADVANCE_NUMBER']) {
                        $query->where('CASH_ADVANCE_NUMBER', 'LIKE', '%' . $searchValue['CASH_ADVANCE_NUMBER'] . '%');
                    }
    
                    if ($searchValue['CASH_ADVANCE_REQUESTED_BY']) {
                        $query->whereHas('employee',
                        function($data) use($searchValue)
                        {
                            $data->where('EMPLOYEE_FIRST_NAME', 'like', '%'. $searchValue['CASH_ADVANCE_REQUESTED_BY'] .'%');
                        });
                    }
    
                    if ($searchValue['CASH_ADVANCE_USED_BY']) {
                        $query->whereHas('employee_used_by',
                        function($data) use($searchValue)
                        {
                            $data->where('EMPLOYEE_FIRST_NAME', 'like', '%'. $searchValue['CASH_ADVANCE_USED_BY'] .'%');
                        });
                    }
    
                    if ($searchValue['CASH_ADVANCE_DIVISION']) {
                        $query->where('CASH_ADVANCE_DIVISION', $searchValue['CASH_ADVANCE_DIVISION']['value']);
                    }
    
                    if (
                        $searchValue['CASH_ADVANCE_START_DATE'] &&
                        $searchValue['CASH_ADVANCE_END_DATE']
                    ) {
                        $query->whereBetween('CASH_ADVANCE_REQUESTED_DATE', [$searchValue['CASH_ADVANCE_START_DATE'], $searchValue['CASH_ADVANCE_END_DATE']]);
                    }
    
                    if ($searchValue['CASH_ADVANCE_COST_CENTER']) {
                        $query->where('CASH_ADVANCE_COST_CENTER', $searchValue['CASH_ADVANCE_COST_CENTER']['value']);
                    }
                } else if ($cash_advance_type == 2) {
                    if ($searchValue['CASH_ADVANCE_NUMBER']) {
                        $query->whereHas('cash_advance_report', function ($data) {
                            $data->where('REPORT_CASH_ADVANCE_NUMBER', '!=', null);
                        });
                    }
                    
                    if ($searchValue['CASH_ADVANCE_REQUESTED_BY']) {
                        $query->whereHas('cash_advance_report', 
                        function($query_report) use ($searchValue)
                        {
                            $query_report->whereHas('employee', function($data) use ($searchValue)
                            {
                                $data->where('EMPLOYEE_FIRST_NAME', 'like', '%'. $searchValue['CASH_ADVANCE_REQUESTED_BY'] .'%');
                            });
                        });
                    }

                    if ($searchValue['CASH_ADVANCE_DIVISION']) {
                        $query->whereHas('cash_advance_report', function ($data) use ($searchValue) {
                            $data->where('REPORT_CASH_ADVANCE_DIVISION', $searchValue['CASH_ADVANCE_DIVISION']);
                        });
                    }

                    if ($searchValue['CASH_ADVANCE_USED_BY']) {
                        $query->whereHas('cash_advance_report', 
                        function($query_report) use ($searchValue)
                        {
                            $query_report->whereHas('employee_used_by', function($data) use ($searchValue)
                            {
                                $data->where('EMPLOYEE_FIRST_NAME', 'like', '%'. $searchValue['CASH_ADVANCE_USED_BY'] .'%');
                            });
                        });
                    }

                    if (
                        $searchValue['CASH_ADVANCE_START_DATE'] &&
                        $searchValue['CASH_ADVANCE_END_DATE']
                    ) {
                        $query->whereHas('cash_advance_report', function ($data) use ($searchValue) {
                            $data->whereBetween('REPORT_CASH_ADVANCE_REQUESTED_DATE', [$searchValue['CASH_ADVANCE_START_DATE'], $searchValue['CASH_ADVANCE_END_DATE']]);
                        });
                    }

                    if ($searchValue['CASH_ADVANCE_COST_CENTER']) {
                        $query->whereHas('cash_advance_report', function ($data) use ($searchValue) {
                            $data->where('REPORT_CASH_ADVANCE_COST_CENTER', $searchValue['CASH_ADVANCE_COST_CENTER']);
                        });
                    }
                }

                $approval_status = $searchValue["CASH_ADVANCE_APPROVAL_STATUS"];
    
                // Logic condition button search cash advance
                if ($approval_status === "request") {
                    $query->where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 1);
                } else if ($approval_status === "approve1") {
                    $query->where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 2)
                            ->where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', null)
                            ->where('CASH_ADVANCE_THIRD_APPROVAL_STATUS', null)
                            ->whereDoesntHave('cash_advance_report');
                } else if ($approval_status === "approve2") {
                    $query->where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 2)
                            ->where('CASH_ADVANCE_THIRD_APPROVAL_STATUS', null)
                            ->whereDoesntHave('cash_advance_report');
                } else if ($approval_status === "approve3") {
                    $query->where('CASH_ADVANCE_THIRD_APPROVAL_STATUS', 2)
                            ->where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', '!=', 5)
                            ->whereDoesntHave('cash_advance_report');
                } else if ($approval_status === "pendingReport") {
                    $query->where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 5)
                            ->whereDoesntHave('cash_advance_report');
                } else if ($approval_status === "revision") {
                    $query->where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 3)
                        ->orWhere('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 3)
                        ->orWhere('CASH_ADVANCE_THIRD_APPROVAL_STATUS', 3);
                } else if ($approval_status === "reject") {
                    $query->where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 4)
                    ->orWhere('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 4)
                    ->orWhere('CASH_ADVANCE_THIRD_APPROVAL_STATUS', 4);
                }

                // Logic condition button search cash advance report
                if ($approval_status === "requestReport") {
                    $query->whereHas('cash_advance_report', function ($data) {
                        $data->where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 1);
                    });
                } else if ($approval_status === "approve1Report") {
                    $query->whereHas('cash_advance_report', function ($data)
                    {
                        $data->where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 2)
                                ->where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', null)
                                ->where('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', null);
                    });
                } else if ($approval_status === "approve2Report") {
                    $query->whereHas('cash_advance_report', function ($data)
                    {
                        $data->where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 2)
                                ->where('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', null);
                    });
                } else if ($approval_status === "approve3Report") {
                    $query->whereHas('cash_advance_report', function ($data)
                    {
                        $data->where('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', 2)
                                ->where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', '!=', 6);
                    });
                } else if ($approval_status === "revisionReport") {
                    $query->whereHas('cash_advance_report', function ($data)
                    {
                        $data->where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 3)
                        ->orWhere('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 3)
                        ->orWhere('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', 3);
                    });
                } else if ($approval_status === "rejectReport") {
                    $query->whereHas('cash_advance_report', function ($data)
                    {
                        $data->where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 4)
                        ->orWhere('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 4)
                        ->orWhere('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', 4);
                    });
                } else if ($approval_status === "complited") {
                    $query->whereHas('cash_advance_report', function ($data)
                    {
                        $data->where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 6);
                    });
                }
            }
        }

        if ($filterModel) {
            foreach ($filterModel as $filterModelKey) {
                foreach ($filterModelKey as $filterValue) {
                    if ($filterValue === 'Execute') {
                        $query->where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 5);
                    } elseif ($filterValue === 'Pending') {
                        $query->where(function ($subQuery) {
                            $subQuery->whereNull('CASH_ADVANCE_SECOND_APPROVAL_STATUS')
                                    ->orWhere('CASH_ADVANCE_SECOND_APPROVAL_STATUS', '!=', 5);
                        });
                    } elseif ($filterValue === 'Execute Report') {
                        $query->whereHas('cash_advance_report', function ($subQuery) {
                            $subQuery->where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 6);
                        });
                    } elseif ($filterValue === 'Pending Report') {
                        $query->where('cash_advance_report', function ($subQuery) {
                            $subQuery->whereNull('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS')
                                    ->orWhere('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', '!=', 6);
                        });
                    }
                }
            }
        }

        $query->orderBy('CASH_ADVANCE_ID', 'desc');

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    public function getCA(Request $request)
    {
        $data = $this->getCAData($request);
        // dd($data->get());
        return response()->json($data);
    }

    public function getCAById(string $id)
    {
        $data = CashAdvance::findOrFail($id);
        return response()->json($data);
    }

    public function getCAReportById(string $id)
    {
        // $data = CashAdvanceReport::findOrFail($id);
        $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_CASH_ADVANCE_ID', $id);
        return response()->json($data);
    }

    public function getCountCARequestStatus()
    {
        $data = CashAdvance::where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 1)->count();

        return response()->json($data);
    }

    public function getCountCAApprove1Status()
    {
        $data = CashAdvance::where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 2)
                        ->where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', null)
                        ->where('CASH_ADVANCE_THIRD_APPROVAL_STATUS', null)
                        ->count();

        return response()->json($data);
    }

    public function getCountCAApprove2Status()
    {
        $data = CashAdvance::where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 2)
                        ->where('CASH_ADVANCE_THIRD_APPROVAL_STATUS', null)
                        ->count();

        return response()->json($data);
    }

    public function getCountCAApprove3Status()
    {
        $data = CashAdvance::where('CASH_ADVANCE_THIRD_APPROVAL_STATUS', 2)
                        ->where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', '!=', 5)
                        ->count();

        return response()->json($data);
    }

    public function getCountCAPendingReportStatus()
    {
        $data = CashAdvance::where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 5)
                           ->whereDoesntHave('cash_advance_report')
                           ->count();

        return response()->json($data);
    }

    public function getCountCANeedRevisionStatus()
    {
        $data = CashAdvance::where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 3)
                            ->orWhere('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 3)
                            ->orWhere('CASH_ADVANCE_THIRD_APPROVAL_STATUS', 3)
                            ->count();

        return response()->json($data);
    }

    public function getCountCARejectStatus()
    {
        $data = CashAdvance::where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 4)
                            ->orWhere('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 4)
                            ->orWhere('CASH_ADVANCE_THIRD_APPROVAL_STATUS', 4)
                            ->count();

        return response()->json($data);
    }

    public function getEmployeeBankAccount()
    {
        $data = TEmployeeBankAccount::with('mForBank')
                                    ->whereHas('mForBank', function ($query) {
                                        $query->where('FOR_BANK_ACCOUNT_ID', 1);
                                    })
                                    ->get();

        return response()->json($data);
    }

    public function getCompanies()
    {
        $data = TCompany::all();

        return response()->json($data);
    }

    public function index()
    {   
        $data = [
            'cash_advance_purpose' => CashAdvancePurpose::all(),
            'cash_advance_cost_classification' => CashAdvanceCostClassification::all(),
            'relations' => Relation::all(),
            'coa' => COA::all(),
            'employees' => TEmployee::all(),
            'office' => TCompanyOffice::all(),
            'division' => TCompanyDivision::all()
        ];

        return Inertia::render('CA/CashAdvance', $data);
    }

    public function getCANumber()
    {
        $data =
            CashAdvance::where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 2)
                        ->orderBy('CASH_ADVANCE_ID', 'desc')
                        ->get();

        return response()->json($data);
    }

    public function getCAPerson()
    {
        $data = TPerson::all();

        return response()->json($data);
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

    public function generateCashAdvanceNumber()
    {
        // Format kode
        $prefix = 'PV/CA/';
        
        // Ambil tahun dan bulan saat ini
        $currentYear = date('Y');
        $currentMonth = date('n');

        // Cari kode terakhir dari tabel
        $lastCode = CashAdvance::orderBy('CASH_ADVANCE_CREATED_AT', 'desc')->first();

        // Inisialisasi nomor urut
        $nextNumber = 1;

        if ($lastCode) {
            // Mengambil tahun dan bulan dari kode terakhir
            $lastCodeYear = substr($lastCode->CASH_ADVANCE_NUMBER, 6, 4);
            $lastCodeMonth = substr($lastCode->CASH_ADVANCE_NUMBER, 11, strlen($currentMonth));

            // Jika bulan dan tahun sama, lanjutkan increment nomor
            if ($lastCodeYear == $currentYear && $lastCodeMonth == $currentMonth) {
                $lastSequenceNumber = (int) substr($lastCode->CASH_ADVANCE_NUMBER, -5);
                $nextNumber = $lastSequenceNumber + 1;
            }
        }

        // Format nomor urut dengan dengan menambahkan 0 di depan nomor urut
        $formattedNumber = str_pad($nextNumber, 5, '0', STR_PAD_LEFT);

        // Menggabungkan kode akhir
        $cashAdvanceNumber = $prefix . "$currentYear/$currentMonth/$formattedNumber";

        return $cashAdvanceNumber;
    }

    public function cash_advance_doc_reader($cash_advance_detail_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $cash_advance_detail_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
        $document_dirname = $document->DOCUMENT_DIRNAME;

        $filePath = "/storage" . "/". $document_dirname . "/" . $document_filename;

        $data = [
            'uri' => $filePath
        ];

        return Inertia::render('CA/CashAdvanceDocReader', $data);
    }

    public function cash_advance_download($cash_advance_detail_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $cash_advance_detail_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
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
            'cash_advance_cost_center' => 'required',
            'cash_advance_used_by' => 'required',
            'cash_advance_branch' => 'required',
            'cash_advance_first_approval_by' => 'required'
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
    
            foreach ($request->CashAdvanceDetail as $value) {
                $total_amount += $value['cash_advance_detail_amount'];
            }
    
            $cash_advance_number = $this->generateCashAdvanceNumber();
            $cash_advance_used_by = $request->cash_advance_used_by['value'];
            $cash_advance_requested_by = $request->cash_advance_requested_by;
            $cash_advance_division = $request->cash_advance_division;
            $cash_advance_cost_center = $request->cash_advance_cost_center['value'];
            $cash_advance_branch = $request->cash_advance_branch['value'];
            $cash_advance_requested_date = now();
            $cash_advance_first_approval_by = $request->cash_advance_first_approval_by['value'];
            $cash_advance_first_approval_user = $request->cash_advance_first_approval_by['label'];
            $cash_advance_first_approval_status = 1;
            $cash_advance_request_note = $request->cash_advance_request_note;
            $cash_advance_to_bank_account = $request->cash_advance_to_bank_account;
            $cash_advance_delivery_method_transfer = $request->cash_advance_delivery_method_transfer;
            $cash_advance_transfer_amount = $request->cash_advance_transfer_amount;
            $cash_advance_delivery_method_cash = $request->cash_advance_delivery_method_cash;
            $cash_advance_cash_amount = $request->cash_advance_cash_amount;
            $cash_advance_total_amount = $total_amount;
            $cash_advance_created_at = now();
            $cash_advance_created_by = $user_id;
    
            // Insert CA
            $cash_advance = CashAdvance::create([
                'CASH_ADVANCE_NUMBER' => $cash_advance_number,
                'CASH_ADVANCE_USED_BY' => $cash_advance_used_by,
                'CASH_ADVANCE_REQUESTED_BY' => $cash_advance_requested_by,
                'CASH_ADVANCE_DIVISION' => $cash_advance_division,
                'CASH_ADVANCE_COST_CENTER' => $cash_advance_cost_center,
                'CASH_ADVANCE_BRANCH' => $cash_advance_branch,
                'CASH_ADVANCE_REQUESTED_DATE' => $cash_advance_requested_date,
                'CASH_ADVANCE_FIRST_APPROVAL_BY' => $cash_advance_first_approval_by,
                'CASH_ADVANCE_FIRST_APPROVAL_USER' => $cash_advance_first_approval_user,
                'CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $cash_advance_first_approval_status,
                'CASH_ADVANCE_REQUEST_NOTE' => $cash_advance_request_note,
                'CASH_ADVANCE_TO_BANK_ACCOUNT' => $cash_advance_to_bank_account,
                'CASH_ADVANCE_DELIVERY_METHOD_TRANSFER' => $cash_advance_delivery_method_transfer,
                'CASH_ADVANCE_TRANSFER_AMOUNT' => $cash_advance_transfer_amount,
                'CASH_ADVANCE_DELIVERY_METHOD_CASH' => $cash_advance_delivery_method_cash,
                'CASH_ADVANCE_CASH_AMOUNT' => $cash_advance_cash_amount,
                'CASH_ADVANCE_TOTAL_AMOUNT' => $cash_advance_total_amount,
                'CASH_ADVANCE_CREATED_AT' => $cash_advance_created_at,
                'CASH_ADVANCE_CREATED_BY' => $cash_advance_created_by
            ])->CASH_ADVANCE_ID;
    
            // Created Log CA
            user_log_create("Created (Cash Advance).", "Cash Advance", $cash_advance);
    
            foreach ($request->CashAdvanceDetail as $cad) {
                $relation_organization_id = $cad['cash_advance_detail_relation_organization_id'];

                $cash_advance_detail_start_date = $cad['cash_advance_detail_start_date'];
                $cash_advance_detail_end_date = $cad['cash_advance_detail_end_date'];
                $cash_advance_detail_purpose = $cad['cash_advance_detail_purpose'];
                $cash_advance_detail_location = $cad['cash_advance_detail_location'];
                $cash_advance_detail_relation_organization_id = $relation_organization_id;
                if ($relation_organization_id != null || $relation_organization_id != "") {
                    $cash_advance_detail_relation_organization_id = $relation_organization_id['value'];
                }
                $cash_advance_detail_relation_name = $cad['cash_advance_detail_relation_name'];
                $cash_advance_detail_relation_position = $cad['cash_advance_detail_relation_position'];
                $cash_advance_detail_amount = $cad['cash_advance_detail_amount'];
    
                // Insert CA Detail
                $CashAdvanceDetail = CashAdvanceDetail::create([
                    'CASH_ADVANCE_ID' => $cash_advance,
                    'CASH_ADVANCE_DETAIL_START_DATE' => $cash_advance_detail_start_date,
                    'CASH_ADVANCE_DETAIL_END_DATE' => $cash_advance_detail_end_date,
                    'CASH_ADVANCE_DETAIL_PURPOSE' => $cash_advance_detail_purpose,
                    'CASH_ADVANCE_DETAIL_LOCATION' => $cash_advance_detail_location,
                    'CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID' => $cash_advance_detail_relation_organization_id,
                    'CASH_ADVANCE_DETAIL_RELATION_NAME' => $cash_advance_detail_relation_name,
                    'CASH_ADVANCE_DETAIL_RELATION_POSITION' => $cash_advance_detail_relation_position,
                    'CASH_ADVANCE_DETAIL_AMOUNT' => $cash_advance_detail_amount
                ]);
    
                // Get data expenses detail id
                $cash_advance_detail_id = $CashAdvanceDetail->CASH_ADVANCE_DETAIL_ID;
    
                // Start process file upload
                $files = $request->file('CashAdvanceDetail');
                if (is_array($files) && !empty($files)) {
                    if (isset($cad['cash_advance_detail_document_id'])) {
                        foreach ($cad['cash_advance_detail_document_id'] as $file) {
                            $parentDir = ((floor(($cash_advance_detail_id) / 1000)) * 1000) . '/';
                            $CAId = $cash_advance_detail_id . '/';
                            $typeDir = '';
                            $uploadPath = 'documents/' . 'CashAdvance/'. $parentDir . $CAId . $typeDir;
        
                            $userId = Auth::user()->id;
        
                            $documentOriginalName =  replace_special_characters($file->getClientOriginalName());
                            $documentFileName =  $cash_advance_detail_id . '-' . replace_special_characters($file->getClientOriginalName());
                            $documentDirName =  $uploadPath;
                            $documentFileType = $file->getMimeType();
                            $documentFileSize = $file->getSize();
        
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $file, $cash_advance_detail_id . '-' . replace_special_characters($file->getClientOriginalName()));
        
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
                                MCashAdvanceDocument::create([
                                    'CASH_ADVANCE_DOCUMENT_CASH_ADVANCE_DETAIL_ID' => $cash_advance_detail_id,
                                    'CASH_ADVANCE_DOCUMENT_CASH_ADVANCE_DETAIL_DOCUMENT_ID' => $document,
                                    'CASH_ADVANCE_DOCUMENT_CREATED_AT' => now(),
                                    'CASH_ADVANCE_DOCUMENT_CREATED_BY' => $userId,
                                ]);
                            }
                        }
                    }
                }
                // End process file upload
    
                // Created Log CA Detail
                user_log_create("Created (Cash Advance Detail).", "Cash Advance", $cash_advance_detail_id);
            }
        });
        
        return new JsonResponse([
            'New Cash Advance has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_approve(Request $request)
    {
        $cashAdvanceStatus = DB::transaction(function () use ($request) {
            $cash_advance_id = $request->CASH_ADVANCE_ID;
            $cash_advance_to_bank_account = $request->CASH_ADVANCE_TO_BANK_ACCOUNT;
            $cash_advance_delivery_method_transfer = $request->CASH_ADVANCE_DELIVERY_METHOD_TRANSFER;
            $cash_advance_transfer_amount = $request->CASH_ADVANCE_TRANSFER_AMOUNT;
            $cash_advance_delivery_method_cash = $request->CASH_ADVANCE_DELIVERY_METHOD_CASH;
            $cash_advance_cash_amount = $request->CASH_ADVANCE_CASH_AMOUNT;
    
            $updateData = [
                'CASH_ADVANCE_TO_BANK_ACCOUNT' => $cash_advance_to_bank_account,
                'CASH_ADVANCE_DELIVERY_METHOD_TRANSFER' => $cash_advance_delivery_method_transfer,
                'CASH_ADVANCE_TRANSFER_AMOUNT' => $cash_advance_transfer_amount,
                'CASH_ADVANCE_DELIVERY_METHOD_CASH' => $cash_advance_delivery_method_cash,
                'CASH_ADVANCE_CASH_AMOUNT' => $cash_advance_cash_amount
            ];

            $userDivisionId = Auth::user()->employee->division->COMPANY_DIVISION_ID;

            // Start logic condition revised
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->CASH_ADVANCE_FIRST_APPROVAL_STATUS == 3) {
                $updateData['CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['CASH_ADVANCE_FIRST_APPROVAL_STATUS'] = 3;
            }

            if ($userDivisionId === 132 && $request->CASH_ADVANCE_SECOND_APPROVAL_STATUS == 3) {
                $updateData['CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['CASH_ADVANCE_FIRST_APPROVAL_STATUS'] = 3;
            }

            if ($userDivisionId === 122 && $request->CASH_ADVANCE_THIRD_APPROVAL_STATUS == 3) {
                $updateData['CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['CASH_ADVANCE_FIRST_APPROVAL_STATUS'] = 3;
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_BY'] = null;
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_USER'] = null;
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_STATUS'] = null;
            }
            // End logic condition revised
            
            // Start logic condition approve
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->CASH_ADVANCE_FIRST_APPROVAL_STATUS == 2) {
                $updateData['CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['CASH_ADVANCE_FIRST_APPROVAL_STATUS'] = $request->CASH_ADVANCE_FIRST_APPROVAL_STATUS;
            }

            if ($userDivisionId === 132 && $request->CASH_ADVANCE_SECOND_APPROVAL_STATUS == 2) {
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_BY'] = $request->CASH_ADVANCE_SECOND_APPROVAL_BY;
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_USER'] = $request->CASH_ADVANCE_SECOND_APPROVAL_USER;
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_STATUS'] = $request->CASH_ADVANCE_SECOND_APPROVAL_STATUS;
            }

            if ($userDivisionId === 122 && $request->CASH_ADVANCE_THIRD_APPROVAL_STATUS == 2) {
                $updateData['CASH_ADVANCE_THIRD_APPROVAL_BY'] = $request->CASH_ADVANCE_THIRD_APPROVAL_BY;
                $updateData['CASH_ADVANCE_THIRD_APPROVAL_USER'] = $request->CASH_ADVANCE_THIRD_APPROVAL_USER;
                $updateData['CASH_ADVANCE_THIRD_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['CASH_ADVANCE_THIRD_APPROVAL_STATUS'] = $request->CASH_ADVANCE_THIRD_APPROVAL_STATUS;
            }
            // End logic condition approve

            // Start logic condition reject
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->CASH_ADVANCE_FIRST_APPROVAL_STATUS == 4) {
                $updateData['CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['CASH_ADVANCE_FIRST_APPROVAL_STATUS'] = $request->CASH_ADVANCE_FIRST_APPROVAL_STATUS;
            }

            if ($userDivisionId === 132 && $request->CASH_ADVANCE_SECOND_APPROVAL_STATUS == 4) {
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_BY'] = $request->CASH_ADVANCE_SECOND_APPROVAL_BY;
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_USER'] = $request->CASH_ADVANCE_SECOND_APPROVAL_USER;
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['CASH_ADVANCE_SECOND_APPROVAL_STATUS'] = $request->CASH_ADVANCE_SECOND_APPROVAL_STATUS;
            }

            if ($userDivisionId === 122 && $request->CASH_ADVANCE_THIRD_APPROVAL_STATUS == 4) {
                $updateData['CASH_ADVANCE_THIRD_APPROVAL_BY'] = $request->CASH_ADVANCE_THIRD_APPROVAL_BY;
                $updateData['CASH_ADVANCE_THIRD_APPROVAL_USER'] = $request->CASH_ADVANCE_THIRD_APPROVAL_USER;
                $updateData['CASH_ADVANCE_THIRD_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['CASH_ADVANCE_THIRD_APPROVAL_STATUS'] = $request->CASH_ADVANCE_THIRD_APPROVAL_STATUS;
            }
            // End logic condition reject

            CashAdvance::where('CASH_ADVANCE_ID', $cash_advance_id)->update($updateData);

            // Create log for approval
            user_log_create("Approve (Cash Advance).", "Cash Advance", $cash_advance_id);
    
            if (is_array($request->cash_advance_detail) && !empty($request->cash_advance_detail)) {
                foreach ($request->cash_advance_detail as $cad) {
                    $cash_advance_detail_id = $cad['CASH_ADVANCE_DETAIL_ID'];
                    $cash_advance_detail_note = $cad['CASH_ADVANCE_DETAIL_NOTE'];
    
                    CashAdvanceDetail::where('CASH_ADVANCE_DETAIL_ID', $cash_advance_detail_id)->update([
                        'CASH_ADVANCE_DETAIL_NOTE' => $cash_advance_detail_note
                    ]);
    
                    // Created Log CA Detail
                    user_log_create("Approve (Cash Advance Detail).", "Cash Advance", $cash_advance_detail_id);
                }
            }

            if ($userDivisionId !== 132 && $userDivisionId !== 122) {
                return $request->CASH_ADVANCE_FIRST_APPROVAL_STATUS;
            }
            
            if ($userDivisionId === 132) {
                return $request->CASH_ADVANCE_SECOND_APPROVAL_STATUS;
            }
            
            if ($userDivisionId === 122) {
                return $request->CASH_ADVANCE_THIRD_APPROVAL_STATUS;
            }
        });

        if ($cashAdvanceStatus === 2) {
            $alertText = "Cash Advance has been approved";
        } else if ($cashAdvanceStatus === 3) {
            $alertText = "Cash Advance needs to be revised";
        } else if ($cashAdvanceStatus === 4) {
            $alertText = "Cash Advance rejected";
        } else {
            $alertText = "Cash Advance status not found";
        }

        return new JsonResponse([
            $alertText
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_revised(Request $request)
    {
        DB::transaction(function () use ($request) {
            $user = Auth::user();
            $user_id = $user->id;
    
            $cash_advance_id = $request->CASH_ADVANCE_ID;
    
            $cash_advance_detail = $request->cash_advance_detail;
    
            $total_amount = 0;
    
            foreach ($cash_advance_detail as $value) {
                $total_amount += $value['CASH_ADVANCE_DETAIL_AMOUNT'];
            }
    
            $cash_advance_total_amount = $total_amount;
            $cash_advance_first_approval_status = 1;
            $cash_advance_request_note = $request->CASH_ADVANCE_REQUEST_NOTE;
            $cash_advance_to_bank_account = $request->CASH_ADVANCE_TO_BANK_ACCOUNT;
            $cash_advance_delivery_method_transfer = $request->CASH_ADVANCE_DELIVERY_METHOD_TRANSFER;
            $cash_advance_transfer_amount = $request->CASH_ADVANCE_TRANSFER_AMOUNT;
            $cash_advance_delivery_method_cash = $request->CASH_ADVANCE_DELIVERY_METHOD_CASH;
            $cash_advance_cash_amount = $request->CASH_ADVANCE_CASH_AMOUNT;
            $cash_advance_updated_at = now();
            $cash_advance_updated_by = $user_id;
    
            // Update data from table cash advance
            CashAdvance::where('CASH_ADVANCE_ID', $cash_advance_id)->update([
                'CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $cash_advance_first_approval_status,
                'CASH_ADVANCE_REQUEST_NOTE' => $cash_advance_request_note,
                'CASH_ADVANCE_TO_BANK_ACCOUNT' => $cash_advance_to_bank_account,
                'CASH_ADVANCE_DELIVERY_METHOD_TRANSFER' => $cash_advance_delivery_method_transfer,
                'CASH_ADVANCE_TRANSFER_AMOUNT' => $cash_advance_transfer_amount,
                'CASH_ADVANCE_DELIVERY_METHOD_CASH' => $cash_advance_delivery_method_cash,
                'CASH_ADVANCE_CASH_AMOUNT' => $cash_advance_cash_amount,
                'CASH_ADVANCE_TOTAL_AMOUNT' => $cash_advance_total_amount,
                'CASH_ADVANCE_UPDATED_AT' => $cash_advance_updated_at,
                'CASH_ADVANCE_UPDATED_BY' => $cash_advance_updated_by
            ]);
    
            // Created Log CA
            user_log_create("Revised (Cash Advance).", "Cash Advance", $cash_advance_id);
    
            // Update data from table cash advance detail
            foreach ($cash_advance_detail as $cad) {
                $relation_organization_id = isset($cad['CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID']) ? $cad['CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID'] : null;
                $relation_name = isset($cad['CASH_ADVANCE_DETAIL_RELATION_NAME']) ? $cad['CASH_ADVANCE_DETAIL_RELATION_NAME'] : null;
                $relation_position = isset($cad['CASH_ADVANCE_DETAIL_RELATION_POSITION']) ? $cad['CASH_ADVANCE_DETAIL_RELATION_POSITION'] : null;
                
                $cash_advance_detail_id = $cad['CASH_ADVANCE_DETAIL_ID'];
                $cash_advance_detail_start_date = $cad['CASH_ADVANCE_DETAIL_START_DATE'];
                $cash_advance_detail_end_date = $cad['CASH_ADVANCE_DETAIL_END_DATE'];
                $cash_advance_detail_purpose = $cad['CASH_ADVANCE_DETAIL_PURPOSE'];
                $cash_advance_detail_relation_organization_id = !empty($relation_organization_id) ? $relation_organization_id : null;
                $cash_advance_detail_relation_name = !empty($relation_name) ? $relation_name : null;
                $cash_advance_detail_relation_position = !empty($relation_position) ? $relation_position : null;
                $cash_advance_detail_location = $cad['CASH_ADVANCE_DETAIL_LOCATION'];
                $cash_advance_detail_amount = $cad['CASH_ADVANCE_DETAIL_AMOUNT'];
    
                $cashAdvanceDetail = CashAdvanceDetail::updateOrCreate(
                    [
                        'CASH_ADVANCE_DETAIL_ID' => $cash_advance_detail_id
                    ],
                    [
                        'CASH_ADVANCE_ID' => $cash_advance_id,
                        'CASH_ADVANCE_DETAIL_START_DATE' => $cash_advance_detail_start_date,
                        'CASH_ADVANCE_DETAIL_END_DATE' => $cash_advance_detail_end_date,
                        'CASH_ADVANCE_DETAIL_PURPOSE' => $cash_advance_detail_purpose,
                        'CASH_ADVANCE_DETAIL_LOCATION' => $cash_advance_detail_location,
                        'CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID' => $cash_advance_detail_relation_organization_id,
                        'CASH_ADVANCE_DETAIL_RELATION_NAME' => $cash_advance_detail_relation_name,
                        'CASH_ADVANCE_DETAIL_RELATION_POSITION' => $cash_advance_detail_relation_position,
                        'CASH_ADVANCE_DETAIL_AMOUNT' => $cash_advance_detail_amount,
                    ]
                );
    
                $cashAdvanceDetailId = $cashAdvanceDetail->CASH_ADVANCE_DETAIL_ID;
    
                $requestFile = $request->file('cash_advance_detail');
    
                // $files = $cad['filesDocument'];
    
                if (is_array($requestFile) && !empty($requestFile)) {
                    if (isset($cad['filesDocument'])) {
                        foreach ($cad['filesDocument'] as $file) {
                            $uploadFile = $file['CASH_ADVANCE_DETAIL_DOCUMENT'];
                        
                            $parentDir = ((floor(($cashAdvanceDetailId) / 1000)) * 1000) . '/';
                            $CAId = $cashAdvanceDetailId . '/';
                            $typeDir = '';
                            $uploadPath = 'documents/' . 'CashAdvance/'. $parentDir . $CAId . $typeDir;
            
                            $userId = Auth::user()->id;
            
                            $documentOriginalName =  replace_special_characters($uploadFile->getClientOriginalName());
                            $documentFileName =  $cashAdvanceDetailId . '-' . replace_special_characters($uploadFile->getClientOriginalName());
                            $documentDirName =  $uploadPath;
                            $documentFileType = $uploadFile->getMimeType();
                            $documentFileSize = $uploadFile->getSize();
            
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $uploadFile, $cashAdvanceDetailId . '-' . replace_special_characters($uploadFile->getClientOriginalName()));
            
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
                                MCashAdvanceDocument::create([
                                    'CASH_ADVANCE_DOCUMENT_CASH_ADVANCE_DETAIL_ID' => $cashAdvanceDetailId,
                                    'CASH_ADVANCE_DOCUMENT_CASH_ADVANCE_DETAIL_DOCUMENT_ID' => $document,
                                    'CASH_ADVANCE_DOCUMENT_CREATED_AT' => now(),
                                    'CASH_ADVANCE_DOCUMENT_CREATED_BY' => $userId,
                                ]);
                            }
                        }
                    }
                }
    
                // Created Log CA Detail
                user_log_create("Revised (Cash Advance Detail).", "Cash Advance", $cashAdvanceDetailId);
            }
    
            // Delete row from table cash advance detail
            $deletedRows = $request->deletedRow;
            if($deletedRows) {
                foreach ($deletedRows as $deletedRow) {
                    $cashAdvanceDetailId = $deletedRow['CASH_ADVANCE_DETAIL_ID'];
    
                    $filePath = '/documents/CashAdvance/0/' . $cashAdvanceDetailId;
    
                    // Delete data document from directory
                    if(Storage::disk('public')->exists($filePath)) {   
                        Storage::disk('public')->deleteDirectory($filePath);
                    }
                    
                    // Delete row from table cash advance detail
                    CashAdvanceDetail::destroy($cashAdvanceDetailId);
                }
            }
            
            // Delete document
            $deletedDocuments = $request->deletedDocument;
            if ($deletedDocuments) {
                foreach ($deletedDocuments as $document_value) {
                    // Get Data Document
                    $documentId = $document_value['DOCUMENT_ID'];
                    $cashAdvanceDetailId = $document_value['CASH_ADVANCE_DETAIL_ID'];
    
                    $getDocument = Document::find($documentId);
    
                    $documentFilename = $cashAdvanceDetailId . '-' . $getDocument->DOCUMENT_ORIGINAL_NAME;
                    $documentDirname = $getDocument->DOCUMENT_DIRNAME;
                    
                    $filePath = '/'. $documentDirname . '/' . $documentFilename;
    
                    // Delete data document from directory
                    if(Storage::disk('public')->exists($filePath)) {   
                        Storage::disk('public')->delete($filePath);
                    } 
    
                    // Delete data from table m_cash_advance_document
                    MCashAdvanceDocument::where('CASH_ADVANCE_DOCUMENT_CASH_ADVANCE_DETAIL_DOCUMENT_ID', $documentId)->delete();
    
                    // Delete data from table t_document
                    Document::destroy($documentId);
                }
            }
        });
        
        return new JsonResponse([
            'Cash Advance has been revised.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_execute(Request $request)
    {
        DB::transaction(function () use ($request) {
            $cash_advance_id = $request->CASH_ADVANCE_ID;
            $cash_advance_second_approval_status = 5;
            $cash_advance_delivery_method_transfer = $request->CASH_ADVANCE_DELIVERY_METHOD_TRANSFER;
            $cash_advance_transfer_amount = $request->CASH_ADVANCE_TRANSFER_AMOUNT;
            $cash_advance_transfer_date = $request->CASH_ADVANCE_TRANSFER_DATE;
            $cash_advance_from_bank_account = $request->CASH_ADVANCE_FROM_BANK_ACCOUNT;
            $cash_advance_to_bank_account = $request->CASH_ADVANCE_TO_BANK_ACCOUNT;
            $cash_advance_delivery_method_cash = $request->CASH_ADVANCE_DELIVERY_METHOD_CASH;
            $cash_advance_cash_amount = $request->CASH_ADVANCE_CASH_AMOUNT;
            $cash_advance_receive_date = $request->CASH_ADVANCE_RECEIVE_DATE;
            $cash_advance_receive_name = $request->CASH_ADVANCE_RECEIVE_NAME;
    
            CashAdvance::where('CASH_ADVANCE_ID', $cash_advance_id)->update([
                'CASH_ADVANCE_SECOND_APPROVAL_STATUS' => $cash_advance_second_approval_status,
                'CASH_ADVANCE_DELIVERY_METHOD_TRANSFER' => $cash_advance_delivery_method_transfer,
                'CASH_ADVANCE_TRANSFER_AMOUNT' => $cash_advance_transfer_amount,
                'CASH_ADVANCE_TRANSFER_DATE' => $cash_advance_transfer_date,
                'CASH_ADVANCE_FROM_BANK_ACCOUNT' => $cash_advance_from_bank_account,
                'CASH_ADVANCE_TO_BANK_ACCOUNT' => $cash_advance_to_bank_account,
                'CASH_ADVANCE_DELIVERY_METHOD_CASH' => $cash_advance_delivery_method_cash,
                'CASH_ADVANCE_CASH_AMOUNT' => $cash_advance_cash_amount,
                'CASH_ADVANCE_RECEIVE_DATE' => $cash_advance_receive_date,
                'CASH_ADVANCE_RECEIVE_NAME' => $cash_advance_receive_name,
            ]);
    
            // Created Log CA Detail
            user_log_create("Execute (Cash Advance).", "Cash Advance", $cash_advance_id);
        });
        
        return new JsonResponse([
            'Cash Advance has been execute.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}