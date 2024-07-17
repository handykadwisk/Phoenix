<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\CashAdvanceDetail;
use App\Models\CashAdvancePurpose;
use App\Models\CashAdvanceReport;
use App\Models\Document;
use App\Models\CashAdvanceDetailReport;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CashAdvanceController extends Controller
{
    public function getCAData($dataPerPage = 2, $searchQuery = null)
    {
        $data = CashAdvance::orderBy('CASH_ADVANCE_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('CASH_ADVANCE_NUMBER')) {
                $data->where('CASH_ADVANCE_NUMBER', 'like', '%'.$searchQuery->CASH_ADVANCE_NUMBER.'%');
            }
        }

        return $data->paginate($dataPerPage);
    }

    public function getReportCAData($dataPerPage = 2, $searchQuery = null)
    {
        $data = CashAdvanceReport::orderBy('REPORT_CASH_ADVANCE_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('REPORT_CASH_ADVANCE_NUMBER')) {
                $data->where('CASH_ADVANCE_ID', 'like', '%'.$searchQuery->REPORT_CASH_ADVANCE_NUMBER.'%');
            }
        }

        return $data->paginate($dataPerPage);
    }

    // public function getCA()
    // {
    //     $data = $this->getCAData(10);
    //     return response()->json($data);
    // }

    public function getCA(Request $request)
    {
        $data = $this->getCAData(10, $request);
        return response()->json($data);
    }
    
    public function getCAReport(Request $request)
    {
        $data = $this->getReportCAData(10, $request);
        return response()->json($data);
    }

    public function getCAById(string $id) 
    {
        $data = CashAdvance::findOrFail($id);
        return response()->json($data);
    }

    public function getCAReportById(string $id) 
    {
        $data = CashAdvanceReport::findOrFail($id);
        return response()->json($data);
    }

    public function index() 
    {
        $data = [
            'users' => User::where('role_id', 2)->get(),
            'cash_advance_purpose' => CashAdvancePurpose::all()
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

        $code = 'CA/';
        $start_char = 10;
        $start_char_2 = 3;
        
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

    public function download($cash_advance_detail_id)
    {
        $CashAdvanceDetail = CashAdvanceDetail::find($cash_advance_detail_id);
        
        // $filePath = public_path('/storage/documents/CA/0/11/11-List-Asuransi--2-Unit-Dumptruck.pdf');
        $filePath = public_path('/storage/documents/CA/0/' . $cash_advance_detail_id . '/'. $CashAdvanceDetail->document->DOCUMENT_FILENAME);
        
        $headers = [
            'filename' => $CashAdvanceDetail->document->DOCUMENT_FILENAME
        ];

        if (file_exists($filePath)) {
            return response()->download($filePath, $CashAdvanceDetail->document->DOCUMENT_FILENAME, $headers);
        } else {
            abort(404, 'File not found');
        }
    }

    public function store(Request $request)
    {
        // dd($request);

        $user_id = auth()->user()->id;
        $user = User::find($request->cash_advance_first_approval_by);
        
        $total_amount = 0;

        foreach ($request->CashAdvanceDetail as $value) {
            $total_amount += $value['cash_advance_detail_amount'];
        }
        
        $cash_advance_number = $this->getCashAdvanceNumber();
        $cash_advance_used_by = $request->cash_advance_used_by;
        $cash_advance_requested_by = $user_id;
        $cash_advance_division = 'IT';
        $cash_advance_requested_date = now();
        $cash_advance_first_approval_by = $request->cash_advance_first_approval_by;
        $cash_advance_first_approval_user = $user->name;
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
            $cash_advance_detail_relation_organization_id = $cad['cash_advance_detail_relation_organization_id'];
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
            $file = $request->file('CashAdvanceDetail');

            if ($file) {
                $parentDir = ((floor(($cash_advance_detail_id) / 1000)) * 1000) . '/';
                $CAId = $cash_advance_detail_id . '/';
                $typeDir = '';
                $uploadPath = 'documents/' . 'CashAdvance/'. $parentDir . $CAId . $typeDir;

                $userId = Auth::user()->id;
                $documentOriginalName =  $this->RemoveSpecialChar($file[$key]['cash_advance_detail_document_id']->getClientOriginalName());
                $documentFileName =  $cash_advance_detail_id . '-' . $this->RemoveSpecialChar($file[$key]['cash_advance_detail_document_id']->getClientOriginalName());
                $documentDirName =  $uploadPath;
                $documentFileType = $file[$key]['cash_advance_detail_document_id']->getMimeType();
                $documentFileSize = $file[$key]['cash_advance_detail_document_id']->getSize();

                Storage::makeDirectory($uploadPath, 0777, true, true);
                Storage::disk('public')->putFileAs($uploadPath, $file[$key]['cash_advance_detail_document_id'], $cash_advance_detail_id . '-' . $this->RemoveSpecialChar($file[$key]['cash_advance_detail_document_id']->getClientOriginalName()));

                $document = Document::create([
                    'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                    'DOCUMENT_FILENAME'               => $documentFileName,
                    'DOCUMENT_DIRNAME'                => $documentDirName,
                    'DOCUMENT_FILETYPE'               => $documentFileType,
                    'DOCUMENT_FILESIZE'               => $documentFileSize,
                    'DOCUMENT_CREATED_BY'             => $userId
                ])->DOCUMENT_ID;
                    
                if ($document) {
                    CashAdvanceDetail::where('CASH_ADVANCE_DETAIL_ID', $CashAdvanceDetail->CASH_ADVANCE_DETAIL_ID)
                    ->update([
                        'CASH_ADVANCE_DETAIL_DOCUMENT_ID' => $document
                    ]);
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

    public function approve(Request $request)
    {
        $cash_advance_id = $request->CASH_ADVANCE_ID;
        $cash_advance_first_approval_change_status_date = date('Y-m-d H:i:s');
        $cash_advance_first_approval_status = $request->CASH_ADVANCE_FIRST_APPROVAL_STATUS;

        CashAdvance::where('CASH_ADVANCE_ID', $cash_advance_id)->update([
            'CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE' => $cash_advance_first_approval_change_status_date,
            'CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $cash_advance_first_approval_status
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

        foreach ($request->cash_advance_detail as $cad) {
            $cash_advance_detail_id = $cad['CASH_ADVANCE_DETAIL_ID'];
            $cash_advance_detail_status = $cad['CASH_ADVANCE_DETAIL_STATUS'];
            $cash_advance_detail_note = $cad['CASH_ADVANCE_DETAIL_NOTE'];

            CashAdvanceDetail::where('CASH_ADVANCE_DETAIL_ID', $cash_advance_detail_id)->update([
                'CASH_ADVANCE_DETAIL_STATUS' => $cash_advance_detail_status,
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

        return new JsonResponse([
            'Cash Advance has been approved.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function revised(Request $request)
    {
        // dd($request);

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
                $cash_advance_detail_status = null;
                
                CashAdvanceDetail::where('CASH_ADVANCE_DETAIL_ID', $cash_advance_detail_id)->update([
                    'CASH_ADVANCE_DETAIL_START_DATE' => $cash_advance_detail_start_date,
                    'CASH_ADVANCE_DETAIL_END_DATE' => $cash_advance_detail_end_date,
                    'CASH_ADVANCE_DETAIL_PURPOSE' => $cash_advance_detail_purpose,
                    'CASH_ADVANCE_DETAIL_LOCATION' => $cash_advance_detail_location,
                    'CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID' => $cash_advance_detail_relation_organization_id,
                    'CASH_ADVANCE_DETAIL_RELATION_NAME' => $cash_advance_detail_relation_name,
                    'CASH_ADVANCE_DETAIL_RELATION_POSITION' => $cash_advance_detail_relation_position,
                    'CASH_ADVANCE_DETAIL_AMOUNT' => $cash_advance_detail_amount,
                    'CASH_ADVANCE_DETAIL_STATUS' => $cash_advance_detail_status
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
        } else {
            CashAdvanceDetail::where('CASH_ADVANCE_ID', $cash_advance_id)->delete();

            foreach ($request->cash_advance_detail as $cad) {
                $cash_advance_detail_id = $cad['CASH_ADVANCE_DETAIL_ID'];
                $cash_advance_detail_start_date = $cad['CASH_ADVANCE_DETAIL_START_DATE'];
                $cash_advance_detail_end_date = $cad['CASH_ADVANCE_DETAIL_END_DATE'];
                $cash_advance_detail_purpose = $cad['CASH_ADVANCE_DETAIL_PURPOSE'];
                $cash_advance_detail_location = $cad['CASH_ADVANCE_DETAIL_LOCATION'];
                $cash_advance_detail_relation_organization_id = $cad['RELATION_ORGANIZATION_ID'];
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

    public function execute(Request $request)
    {
        // dd($request);
        $cash_advance_id = $request->CASH_ADVANCE_ID;
        $cash_advance_second_approval_by = auth()->user()->id;
        $cash_advance_second_approval_user = auth()->user()->name;
        $cash_advance_second_approval_change_status_date = date('Y-m-d H:i:s');
        $cash_advance_second_approval_status = 4;
        $cash_advance_transfer_amount = $request->CASH_ADVANCE_TRANSFER_AMOUNT;
        $cash_advance_transfer_date = $request->CASH_ADVANCE_TRANSFER_DATE;
        $cash_advance_from_bank_account = $request->CASH_ADVANCE_FROM_BANK_ACCOUNT;
        $cash_advance_cash_amount = $request->CASH_ADVANCE_CASH_AMOUNT;
        $cash_advance_receive_date = $request->CASH_ADVANCE_RECEIVE_DATE;
        $cash_advance_receive_name = $request->CASH_ADVANCE_RECEIVE_NAME;

        CashAdvance::where('CASH_ADVANCE_ID', $cash_advance_id)->update([
            'CASH_ADVANCE_SECOND_APPROVAL_BY' => $cash_advance_second_approval_by,
            'CASH_ADVANCE_SECOND_APPROVAL_USER' => $cash_advance_second_approval_user,
            'CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE' => $cash_advance_second_approval_change_status_date,
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

    public function report_cash_advance(Request $request)
    {
        // dd($request->file('refund_proof'));

        $user_id = auth()->user()->id;
        $user = User::find($request->cash_advance_first_approval_by);

        $total_amount_report = 0;

        foreach ($request->CashAdvanceDetail as $value) {
            $total_amount_report += $value['cash_advance_detail_amount'];
        }
        
        $report_cash_advance_id = $request->cash_advance_number;
        $report_cash_advance_division = "IT";
        $report_cash_advance_requested_by = $user_id;
        $report_cash_advance_requested_date = now();
        $report_cash_advance_first_approval_by = $request->cash_advance_first_approval_by;
        $report_cash_advance_first_approval_user = $user->name;
        $report_cash_advance_first_approval_status = 0;
        $report_cash_advance_request_note = $request->cash_advance_request_note;
        $report_cash_advance_refund_type = $request->refund_type;
        $report_refund_proof = $request->file('refund_proof')[0];
        $report_cash_advance_total_amount = $total_amount_report;

        // Insert Report CA
        $report_cash_advance = CashAdvanceReport::create([
            'CASH_ADVANCE_ID' => $report_cash_advance_id,
            'REPORT_CASH_ADVANCE_DIVISION' => $report_cash_advance_division,
            'REPORT_CASH_ADVANCE_REQUESTED_BY' => $report_cash_advance_requested_by,
            'REPORT_CASH_ADVANCE_REQUESTED_DATE' => $report_cash_advance_requested_date,
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_BY' => $report_cash_advance_first_approval_by,
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_USER' => $report_cash_advance_first_approval_user,
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $report_cash_advance_first_approval_status,
            'REPORT_CASH_ADVANCE_REQUEST_NOTE' => $report_cash_advance_request_note,
            'REPORT_CASH_ADVANCE_REFUND_TYPE' => $report_cash_advance_refund_type,
            'REPORT_CASH_ADVANCE_TOTAL_AMOUNT' => $report_cash_advance_total_amount
        ])->REPORT_CASH_ADVANCE_ID;

        // Created Log Report CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Report Cash Advance).",
                "module"      => "Report Cash Advance",
                "id"          => $report_cash_advance
            ]),
            'action_by'  => Auth::user()->email
        ]);

        foreach ($request->CashAdvanceDetail as $key => $cad) {
            $report_cash_advance_detail_start_date = $cad['cash_advance_detail_start_date'];
            $report_cash_advance_detail_end_date = $cad['cash_advance_detail_end_date'];
            $report_cash_advance_detail_purpose = $cad['cash_advance_detail_purpose'];
            $report_cash_advance_detail_location = $cad['cash_advance_detail_location'];
            $cash_advance_detail_relation_organization_id = $cad['cash_advance_detail_relation_organization_id'];
            $report_cash_advance_detail_relation_name = $cad['cash_advance_detail_relation_name'];
            $report_cash_advance_detail_relation_position = $cad['cash_advance_detail_relation_position'];
            $report_cash_advance_detail_amount = $cad['cash_advance_detail_amount'];

            $report_cash_advance_detail = CashAdvanceDetailReport::create([
                'REPORT_CASH_ADVANCE_ID' => $report_cash_advance,
                'REPORT_CASH_ADVANCE_DETAIL_START_DATE' => $report_cash_advance_detail_start_date,
                'REPORT_CASH_ADVANCE_DETAIL_END_DATE' => $report_cash_advance_detail_end_date,
                'REPORT_CASH_ADVANCE_DETAIL_PURPOSE' => $report_cash_advance_detail_purpose,
                'REPORT_CASH_ADVANCE_DETAIL_LOCATION' => $report_cash_advance_detail_location,
                'REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID' => $cash_advance_detail_relation_organization_id,
                'REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME' => $report_cash_advance_detail_relation_name,
                'REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION' => $report_cash_advance_detail_relation_position,
                'REPORT_CASH_ADVANCE_DETAIL_AMOUNT' => $report_cash_advance_detail_amount
            ])->REPORT_CASH_ADVANCE_DETAIL_ID;

            // Created Log Report CA Detail
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Created (Report Cash Advance Detail).",
                    "module"      => "Report Cash Advance Detail",
                    "id"          => $report_cash_advance_detail
                ]),
                'action_by'  => Auth::user()->email
            ]);
        }

        if($report_refund_proof) {
            $parentDir = ((floor(($report_cash_advance) / 1000)) * 1000) . '/';
            $CAId = $report_cash_advance . '/';
            $typeDir = '';
            $uploadPath = 'documents/' . 'CashAdvanceReport/'. $parentDir . $CAId . $typeDir;

            $userId = Auth::user()->id;
            $documentOriginalName =  $this->RemoveSpecialChar($report_refund_proof->getClientOriginalName());
            $documentFileName =  $report_cash_advance . '-' . $this->RemoveSpecialChar($report_refund_proof->getClientOriginalName());
            $documentDirName =  $uploadPath;
            $documentFileType = $report_refund_proof->getMimeType();
            $documentFileSize = $report_refund_proof->getSize();

            Storage::makeDirectory($uploadPath, 0777, true, true);
            Storage::disk('public')->putFileAs($uploadPath, $report_refund_proof, $report_cash_advance . '-' . $this->RemoveSpecialChar($report_refund_proof->getClientOriginalName()));

            $document = Document::create([
                'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                'DOCUMENT_FILENAME'               => $documentFileName,
                'DOCUMENT_DIRNAME'                => $documentDirName,
                'DOCUMENT_FILETYPE'               => $documentFileType,
                'DOCUMENT_FILESIZE'               => $documentFileSize,
                'DOCUMENT_CREATED_BY'             => $userId
            ])->DOCUMENT_ID;
                
            if ($document) {
                CashAdvanceReport::where('CASH_ADVANCE_ID', $report_cash_advance)
                ->update([
                    'REPORT_CASH_ADVANCE_REFUND_PROOF' => $document
                ]);
            }
        }

        return new JsonResponse([
            'New Report Cash Advance has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}