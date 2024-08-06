<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\CashAdvanceCostClassification;
use App\Models\CashAdvanceDetail;
use App\Models\CashAdvancePurpose;
use App\Models\CashAdvanceReport;
use App\Models\Document;
use App\Models\CashAdvanceDetailReport;
use App\Models\COA;
use App\Models\MCashAdvanceDocument;
use App\Models\RCashAdvanceDifferent;
use App\Models\Relation;
use App\Models\TDocument;
use App\Models\TPerson;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;

class CashAdvanceController extends Controller
{
    public function getCAData($dataPerPage = 2, $searchQuery = null)
    {
        $cash_advance_requested_by = $searchQuery->cash_advance_requested_by;
        $cash_advance_used_by = $searchQuery->cash_advance_used_by;
        $cash_advance_start_date = $searchQuery->cash_advance_start_date;
        $cash_advance_end_date = $searchQuery->cash_advance_end_date;
        $cash_advance_type = $searchQuery->cash_advance_type;
        $status = $searchQuery->status;
        $status_type = $searchQuery->status_type;

        // dd($searchQuery);
        
        if ($cash_advance_type == null || $cash_advance_type == 1) {
            $data = CashAdvance::with('cash_advance_report')->orderBy('CASH_ADVANCE_ID', 'desc');

            if ($searchQuery) {
                if ($searchQuery->input('cash_advance_requested_by')) {
                    $data->whereHas('person',
                    function($query) use($cash_advance_requested_by)
                    {
                        $query->where('PERSON_FIRST_NAME', 'like', '%'. $cash_advance_requested_by .'%');
                    });
                }

                if ($searchQuery->input('cash_advance_used_by')) {
                    $data->whereHas('person_used_by',
                    function($query) use($cash_advance_used_by)
                    {
                        $query->where('PERSON_FIRST_NAME', 'like', '%'. $cash_advance_used_by .'%');
                    });
                }

                if (
                    $searchQuery->input('cash_advance_start_date') &&
                    $searchQuery->input('cash_advance_end_date')
                ) {
                    $data->whereBetween('CASH_ADVANCE_REQUESTED_DATE', [$cash_advance_start_date, $cash_advance_end_date]);
                }

                if ($searchQuery->input('cash_advance_division')) {
                    $data->where('CASH_ADVANCE_DIVISION', 'like', '%'. $searchQuery->cash_advance_division .'%');
                }

                if ($status == 0 && $status_type == "Approve1") {
                    $data->where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 0);
                } else if ($status == 1 && $status_type == "Approve1") {
                    $data->where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 1);
                } else if ($status == 1 && $status_type == "Approve2") {
                    $data->where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 1);
                } else if ($status == 4 && $status_type == "Pending Report") {
                    $data->where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 4);
                } else if ($status == 3 && $status_type == "Need Revision") {
                    $data->where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 3)
                        ->orWhere('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 3)
                        ->orWhere('CASH_ADVANCE_THIRD_APPROVAL_STATUS', 3);
                } else if ($status == 2 && $status_type == "Reject") {
                    $data->where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 2)
                    ->orWhere('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 2)
                    ->orWhere('CASH_ADVANCE_THIRD_APPROVAL_STATUS', 2);
                }
            }
        } else if ($cash_advance_type == 2) {
            $data = CashAdvanceReport::orderBy('REPORT_CASH_ADVANCE_ID', 'desc');

            if ($searchQuery) {
                if ($searchQuery->input('cash_advance_requested_by')) {
                    $data->whereHas('person',
                    function($query) use($cash_advance_requested_by)
                    {
                        $query->where('PERSON_FIRST_NAME', 'like', '%'. $cash_advance_requested_by .'%');
                    });
                }

                if ($searchQuery->input('cash_advance_used_by')) {
                    $data->whereHas('person_used_by',
                    function($query) use($cash_advance_used_by)
                    {
                        $query->where('PERSON_FIRST_NAME', 'like', '%'. $cash_advance_used_by .'%');
                    });
                }

                if (
                    $searchQuery->input('cash_advance_start_date') &&
                    $searchQuery->input('cash_advance_end_date')
                ) {
                    $data->whereBetween('REPORT_CASH_ADVANCE_REQUESTED_DATE', [$cash_advance_start_date, $cash_advance_end_date]);
                }

                if ($searchQuery->input('cash_advance_division')) {
                    $data->where('REPORT_CASH_ADVANCE_DIVISION', 'like', '%'. $searchQuery->cash_advance_division .'%');
                }

                if ($status == 0 && $status_type == "Approve1") {
                    $data->where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 0);
                } else if ($status == 1 && $status_type == "Approve1") {
                    $data->where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 1);
                } else if ($status == 1 && $status_type == "Approve2") {
                    $data->where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 1);
                } else if ($status == 4 && $status_type == "Pending Report") {
                    $data->where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 4);
                } else if ($status == 3 && $status_type == "Need Revision") {
                    $data->where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 3)
                        ->orWhere('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 3)
                        ->orWhere('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', 3);
                } else if ($status == 2 && $status_type == "Reject") {
                    $data->where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 2)
                    ->orWhere('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 2)
                    ->orWhere('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', 2);
                }
            }
        }
        return $data->paginate($dataPerPage);
    }

    public function getCA(Request $request)
    {
        $data = $this->getCAData(10, $request);
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
        $data = CashAdvance::where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 0)->count();

        return response()->json($data);
    }

    public function getCountCAApprove1Status()
    {
        $data = CashAdvance::where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 1)->count();

        return response()->json($data);
    }

    public function getCountCAApprove2Status()
    {
        $data = CashAdvance::where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 1)->count();

        return response()->json($data);
    }

    public function getCountCAPendingReportStatus()
    {
        $data = CashAdvance::where('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 4)->count();

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
        $data = CashAdvance::where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 2)
                            ->orWhere('CASH_ADVANCE_SECOND_APPROVAL_STATUS', 2)
                            ->orWhere('CASH_ADVANCE_THIRD_APPROVAL_STATUS', 2)
                            ->count();

        return response()->json($data);
    }

    public function index()
    {   
        $data = [
            'users' => User::where('role_id', 2)->get(),
            'cash_advance_purpose' => CashAdvancePurpose::all(),
            'cash_advance_cost_classification' => CashAdvanceCostClassification::all(),
            'relations' => Relation::all(),
            'coa' => COA::all(),
            'persons' => TPerson::all()
        ];

        return Inertia::render('CA/CashAdvance', $data);
    }

    public function getCANumber()
    {
        $data =
            CashAdvance::where('CASH_ADVANCE_FIRST_APPROVAL_STATUS', 1)
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

    public function getCashAdvanceNumber()
    {
        // if ($cash_advance_type == 1) {
        //     $code = 'CA/';
        //     $start_char = 10;
        //     $start_char_2 = 3;
        // } else {
        //     $code = 'RMBS/';
        //     $start_char = 12;
        //     $start_char_2 = 5;
        // }

        $code = 'PV/CA/';
        $start_char = 13;
        $start_char_2 = 6;

        $year_month = date('Y/n').'/';

        $queries = DB::select('SELECT MAX(CASH_ADVANCE_NUMBER) AS max_number FROM t_cash_advance');

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

        $cash_advance_number = $code . $year_month . $counting;

        return $cash_advance_number;
    }

    public function cash_advance_download($cash_advance_detail_id, $key)
    {
        $CashAdvanceDetail = MCashAdvanceDocument::where('CASH_ADVANCE_DOCUMENT_CASH_ADVANCE_DETAIL_ID', $cash_advance_detail_id)->get();

        $document_filename = $CashAdvanceDetail[$key]['document']['DOCUMENT_FILENAME'];

        $filePath = public_path('/storage/documents/CashAdvance/0/' . $cash_advance_detail_id . '/'. $document_filename);

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
        // dd($request);

        $user_id = auth()->user()->id;
        $person = TPerson::find($request->cash_advance_first_approval_by['value']);

        $total_amount = 0;

        foreach ($request->CashAdvanceDetail as $value) {
            $total_amount += $value['cash_advance_detail_amount'];
        }

        $cash_advance_number = $this->getCashAdvanceNumber();
        $cash_advance_used_by = $request->cash_advance_used_by['value'];
        $cash_advance_requested_by = $user_id;
        $cash_advance_division = 'IT';
        $cash_advance_requested_date = now();
        $cash_advance_first_approval_by = $request->cash_advance_first_approval_by['value'];
        $cash_advance_first_approval_user = $person->PERSON_FIRST_NAME;
        $cash_advance_first_approval_status = 0;
        $cash_advance_request_note = $request->cash_advance_request_note;
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
            'CASH_ADVANCE_REQUESTED_DATE' => $cash_advance_requested_date,
            'CASH_ADVANCE_FIRST_APPROVAL_BY' => $cash_advance_first_approval_by,
            'CASH_ADVANCE_FIRST_APPROVAL_USER' => $cash_advance_first_approval_user,
            'CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $cash_advance_first_approval_status,
            'CASH_ADVANCE_REQUEST_NOTE' => $cash_advance_request_note,
            'CASH_ADVANCE_DELIVERY_METHOD_TRANSFER' => $cash_advance_delivery_method_transfer,
            'CASH_ADVANCE_TRANSFER_AMOUNT' => $cash_advance_transfer_amount,
            'CASH_ADVANCE_DELIVERY_METHOD_CASH' => $cash_advance_delivery_method_cash,
            'CASH_ADVANCE_CASH_AMOUNT' => $cash_advance_cash_amount,
            'CASH_ADVANCE_TOTAL_AMOUNT' => $cash_advance_total_amount,
            'CASH_ADVANCE_CREATED_AT' => $cash_advance_created_at,
            'CASH_ADVANCE_CREATED_BY' => $cash_advance_created_by
        ])->CASH_ADVANCE_ID;

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Cash Advance).",
                "module"      => "Cash Advance",
                "id"          => $cash_advance
            ]),
            'action_by'  => Auth::user()->email
        ]);

        foreach ($request->CashAdvanceDetail as $key => $cad) {
            $cash_advance_detail_start_date = $cad['cash_advance_detail_start_date'];
            $cash_advance_detail_end_date = $cad['cash_advance_detail_end_date'];
            $cash_advance_detail_purpose = $cad['cash_advance_detail_purpose'];
            $cash_advance_detail_location = $cad['cash_advance_detail_location'];
            $cash_advance_detail_relation_organization_id = $cad['cash_advance_detail_relation_organization_id']['value'];
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
                foreach ($cad['cash_advance_detail_document_id'] as $file) {
                    $parentDir = ((floor(($cash_advance_detail_id) / 1000)) * 1000) . '/';
                    $CAId = $cash_advance_detail_id . '/';
                    $typeDir = '';
                    $uploadPath = 'documents/' . 'CashAdvance/'. $parentDir . $CAId . $typeDir;

                    $userId = Auth::user()->id;

                    $documentOriginalName =  $this->RemoveSpecialChar($file->getClientOriginalName());
                    $documentFileName =  $cash_advance_detail_id . '-' . $this->RemoveSpecialChar($file->getClientOriginalName());
                    $documentDirName =  $uploadPath;
                    $documentFileType = $file->getMimeType();
                    $documentFileSize = $file->getSize();

                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $file, $cash_advance_detail_id . '-' . $this->RemoveSpecialChar($file->getClientOriginalName()));

                    $document = TDocument::create([
                        'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                        'DOCUMENT_FILENAME'               => $documentFileName,
                        'DOCUMENT_DIRNAME'                => $documentDirName,
                        'DOCUMENT_FILETYPE'               => $documentFileType,
                        'DOCUMENT_FILESIZE'               => $documentFileSize,
                        'DOCUMENT_CREATED_BY'             => $userId
                    ])->DOCUMENT_ID;

                    // if($document){
                    //     Document::where('DOCUMENT_ID', $document)->update([
                    //         'DOCUMENT_FILENAME'             => $document."-".$documentOriginalName,
                    //     ]);
                    // }

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
            // End process file upload

            // Created Log CA Detail
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Created (Cash Advance Detail).",
                    "module"      => "Cash Advance",
                    "id"          => $cash_advance_detail_id
                ]),
                'action_by'  => Auth::user()->email
            ]);
        }

        return new JsonResponse([
            'New Cash Advance has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_approve(Request $request)
    {
        // dd($request->cash_advance_detail);
        $cash_advance_id = $request->CASH_ADVANCE_ID;
        $cash_advance_first_approval_change_status_date = date('Y-m-d H:i:s');
        $cash_advance_first_approval_status = $request->CASH_ADVANCE_FIRST_APPROVAL_STATUS;
        $cash_advance_transfer_amount = $request->CASH_ADVANCE_TRANSFER_AMOUNT;
        $cash_advance_cash_amount = $request->CASH_ADVANCE_CASH_AMOUNT;

        CashAdvance::where('CASH_ADVANCE_ID', $cash_advance_id)->update([
            'CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE' => $cash_advance_first_approval_change_status_date,
            'CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $cash_advance_first_approval_status,
            'CASH_ADVANCE_TRANSFER_AMOUNT' => $cash_advance_transfer_amount,
            'CASH_ADVANCE_CASH_AMOUNT' => $cash_advance_cash_amount
        ]);

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Approve (Cash Advance).",
                "module"      => "Cash Advance",
                "id"          => $cash_advance_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        if (is_array($request->cash_advance_detail) && !empty($request->cash_advance_detail)) {
            foreach ($request->cash_advance_detail as $cad) {
                $cash_advance_detail_id = $cad['CASH_ADVANCE_DETAIL_ID'];
                $cash_advance_detail_note = $cad['CASH_ADVANCE_DETAIL_NOTE'];

                CashAdvanceDetail::where('CASH_ADVANCE_DETAIL_ID', $cash_advance_detail_id)->update([
                    'CASH_ADVANCE_DETAIL_NOTE' => $cash_advance_detail_note
                ]);

                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Approve (Cash Advance Detail).",
                        "module"      => "Cash Advance",
                        "id"          => $cash_advance_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        }

        return new JsonResponse([
            'Cash Advance has been approved.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_revised(Request $request)
    {
        // dd($key);
        $user_id = auth()->user()->id;

        $cash_advance_id = $request->CASH_ADVANCE_ID;

        $CountRequestDataById = sizeof($request->cash_advance_detail);
        $CountCashAdvanceDetail = CashAdvanceDetail::where('CASH_ADVANCE_ID', $cash_advance_id)->count();

        $total_amount = 0;

        foreach ($request->cash_advance_detail as $value) {
            $total_amount += $value['CASH_ADVANCE_DETAIL_AMOUNT'];
        }

        $cash_advance_total_amount = $total_amount;
        $cash_advance_first_approval_status = 0;
        $cash_advance_request_note = $request->CASH_ADVANCE_REQUEST_NOTE;
        $cash_advance_delivery_method_transfer = $request->CASH_ADVANCE_DELIVERY_METHOD_TRANSFER;
        $cash_advance_transfer_amount = $request->CASH_ADVANCE_TRANSFER_AMOUNT;
        $cash_advance_delivery_method_cash = $request->CASH_ADVANCE_DELIVERY_METHOD_CASH;
        $cash_advance_cash_amount = $request->CASH_ADVANCE_CASH_AMOUNT;
        $cash_advance_updated_at = now();
        $cash_advance_updated_by = $user_id;

        CashAdvance::where('CASH_ADVANCE_ID', $cash_advance_id)->update([
            'CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $cash_advance_first_approval_status,
            'CASH_ADVANCE_REQUEST_NOTE' => $cash_advance_request_note,
            'CASH_ADVANCE_DELIVERY_METHOD_TRANSFER' => $cash_advance_delivery_method_transfer,
            'CASH_ADVANCE_TRANSFER_AMOUNT' => $cash_advance_transfer_amount,
            'CASH_ADVANCE_DELIVERY_METHOD_CASH' => $cash_advance_delivery_method_cash,
            'CASH_ADVANCE_CASH_AMOUNT' => $cash_advance_cash_amount,
            'CASH_ADVANCE_TOTAL_AMOUNT' => $cash_advance_total_amount,
            'CASH_ADVANCE_UPDATED_AT' => $cash_advance_updated_at,
            'CASH_ADVANCE_UPDATED_BY' => $cash_advance_updated_by
        ]);

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Revised (Cash Advance).",
                "module"      => "Cash Advance",
                "id"          => $cash_advance_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        if ($CountRequestDataById === $CountCashAdvanceDetail) {
            foreach ($request->cash_advance_detail as $key => $cad) {
                $cash_advance_detail_id = $cad['CASH_ADVANCE_DETAIL_ID'];
                $cash_advance_detail_start_date = $cad['CASH_ADVANCE_DETAIL_START_DATE'];
                $cash_advance_detail_end_date = $cad['CASH_ADVANCE_DETAIL_END_DATE'];
                $cash_advance_detail_purpose = $cad['CASH_ADVANCE_DETAIL_PURPOSE'];
                $cash_advance_detail_location = $cad['CASH_ADVANCE_DETAIL_LOCATION'];
                $cash_advance_detail_relation_organization_id = $cad['CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID'];
                $cash_advance_detail_relation_name = $cad['CASH_ADVANCE_DETAIL_RELATION_NAME'];
                $cash_advance_detail_relation_position = $cad['CASH_ADVANCE_DETAIL_RELATION_POSITION'];
                $cash_advance_detail_amount = $cad['CASH_ADVANCE_DETAIL_AMOUNT'];

                CashAdvanceDetail::where('CASH_ADVANCE_DETAIL_ID', $cash_advance_detail_id)->update([
                    'CASH_ADVANCE_DETAIL_START_DATE' => $cash_advance_detail_start_date,
                    'CASH_ADVANCE_DETAIL_END_DATE' => $cash_advance_detail_end_date,
                    'CASH_ADVANCE_DETAIL_PURPOSE' => $cash_advance_detail_purpose,
                    'CASH_ADVANCE_DETAIL_LOCATION' => $cash_advance_detail_location,
                    'CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID' => $cash_advance_detail_relation_organization_id,
                    'CASH_ADVANCE_DETAIL_RELATION_NAME' => $cash_advance_detail_relation_name,
                    'CASH_ADVANCE_DETAIL_RELATION_POSITION' => $cash_advance_detail_relation_position,
                    'CASH_ADVANCE_DETAIL_AMOUNT' => $cash_advance_detail_amount,
                ]);

                // Start process file upload
                $files = $request->file('cash_advance_detail');
                if (is_array($files) && !empty($files)) {
                    foreach ($cad['CASH_ADVANCE_DETAIL_DOCUMENT_ID'] as $file) {
                        $parentDir = ((floor(($cash_advance_detail_id) / 1000)) * 1000) . '/';
                        $CAId = $cash_advance_detail_id . '/';
                        $typeDir = '';
                        $uploadPath = 'documents/' . 'CashAdvance/'. $parentDir . $CAId . $typeDir;

                        $userId = Auth::user()->id;

                        $documentOriginalName =  $this->RemoveSpecialChar($file->getClientOriginalName());
                        $documentFileName =  $cash_advance_detail_id . '-' . $this->RemoveSpecialChar($file->getClientOriginalName());
                        $documentDirName =  $uploadPath;
                        $documentFileType = $file->getMimeType();
                        $documentFileSize = $file->getSize();

                        Storage::makeDirectory($uploadPath, 0777, true, true);
                        Storage::disk('public')->putFileAs($uploadPath, $file, $cash_advance_detail_id . '-' . $this->RemoveSpecialChar($file->getClientOriginalName()));

                        $document = TDocument::create([
                            'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                            'DOCUMENT_FILENAME'               => $documentFileName,
                            'DOCUMENT_DIRNAME'                => $documentDirName,
                            'DOCUMENT_FILETYPE'               => $documentFileType,
                            'DOCUMENT_FILESIZE'               => $documentFileSize,
                            'DOCUMENT_CREATED_BY'             => $userId
                        ])->DOCUMENT_ID;

                        // if($document){
                        //     Document::where('DOCUMENT_ID', $document)->update([
                        //         'DOCUMENT_FILENAME'             => $document."-".$documentOriginalName,
                        //     ]);
                        // }

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
                // End process file upload

                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Cash Advance Detail).",
                        "module"      => "Cash Advance",
                        "id"          => $cash_advance_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        } else {
            CashAdvanceDetail::where('CASH_ADVANCE_ID', $cash_advance_id)->delete();

            foreach ($request->cash_advance_detail as $cad) {
                $cash_advance_detail_id = $cad['CASH_ADVANCE_DETAIL_ID'];
                $cash_advance_detail_start_date = $cad['CASH_ADVANCE_DETAIL_START_DATE'];
                $cash_advance_detail_end_date = $cad['CASH_ADVANCE_DETAIL_END_DATE'];
                $cash_advance_detail_purpose = $cad['CASH_ADVANCE_DETAIL_PURPOSE'];
                $cash_advance_detail_location = $cad['CASH_ADVANCE_DETAIL_LOCATION'];
                $cash_advance_detail_relation_organization_id = $cad['CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID'];
                $cash_advance_detail_relation_name = $cad['CASH_ADVANCE_DETAIL_RELATION_NAME'];
                $cash_advance_detail_relation_position = $cad['CASH_ADVANCE_DETAIL_RELATION_POSITION'];
                $cash_advance_detail_amount = $cad['CASH_ADVANCE_DETAIL_AMOUNT'];

                CashAdvanceDetail::create([
                    'CASH_ADVANCE_ID' => $cash_advance_id,
                    'CASH_ADVANCE_DETAIL_START_DATE' => $cash_advance_detail_start_date,
                    'CASH_ADVANCE_DETAIL_END_DATE' => $cash_advance_detail_end_date,
                    'CASH_ADVANCE_DETAIL_PURPOSE' => $cash_advance_detail_purpose,
                    'CASH_ADVANCE_DETAIL_LOCATION' => $cash_advance_detail_location,
                    'CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID' => $cash_advance_detail_relation_organization_id,
                    'CASH_ADVANCE_DETAIL_RELATION_NAME' => $cash_advance_detail_relation_name,
                    'CASH_ADVANCE_DETAIL_RELATION_POSITION' => $cash_advance_detail_relation_position,
                    'CASH_ADVANCE_DETAIL_AMOUNT' => $cash_advance_detail_amount
                ]);

                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Cash Advance Detail).",
                        "module"      => "Cash Advance",
                        "id"          => $cash_advance_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        }

        return new JsonResponse([
            'Cash Advance has been revised.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_execute(Request $request)
    {
        // dd($request);
        $cash_advance_id = $request->CASH_ADVANCE_ID;
        // $cash_advance_second_approval_by = auth()->user()->id;
        // $cash_advance_second_approval_user = auth()->user()->name;
        // $cash_advance_second_approval_change_status_date = date('Y-m-d H:i:s');
        $cash_advance_second_approval_status = 4;
        $cash_advance_transfer_amount = $request->CASH_ADVANCE_TRANSFER_AMOUNT;
        $cash_advance_transfer_date = $request->CASH_ADVANCE_TRANSFER_DATE;
        $cash_advance_from_bank_account = $request->CASH_ADVANCE_FROM_BANK_ACCOUNT;
        $cash_advance_cash_amount = $request->CASH_ADVANCE_CASH_AMOUNT;
        $cash_advance_receive_date = $request->CASH_ADVANCE_RECEIVE_DATE;
        $cash_advance_receive_name = $request->CASH_ADVANCE_RECEIVE_NAME;

        CashAdvance::where('CASH_ADVANCE_ID', $cash_advance_id)->update([
            // 'CASH_ADVANCE_SECOND_APPROVAL_BY' => $cash_advance_second_approval_by,
            // 'CASH_ADVANCE_SECOND_APPROVAL_USER' => $cash_advance_second_approval_user,
            // 'CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE' => $cash_advance_second_approval_change_status_date,
            'CASH_ADVANCE_SECOND_APPROVAL_STATUS' => $cash_advance_second_approval_status,
            'CASH_ADVANCE_TRANSFER_AMOUNT' => $cash_advance_transfer_amount,
            'CASH_ADVANCE_TRANSFER_DATE' => $cash_advance_transfer_date,
            'CASH_ADVANCE_FROM_BANK_ACCOUNT' => $cash_advance_from_bank_account,
            'CASH_ADVANCE_CASH_AMOUNT' => $cash_advance_cash_amount,
            'CASH_ADVANCE_RECEIVE_DATE' => $cash_advance_receive_date,
            'CASH_ADVANCE_RECEIVE_NAME' => $cash_advance_receive_name,
        ]);

        // Created Log CA Detail
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Execute (Cash Advance).",
                "module"      => "Cash Advance",
                "id"          => $cash_advance_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            'Cash Advance has been execute.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
