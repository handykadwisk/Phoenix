<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\CashAdvanceCostClassification;
use App\Models\CashAdvanceDetailReport;
use App\Models\CashAdvanceReport;
use App\Models\Document;
use App\Models\MCashAdvanceDocument;
use App\Models\MCashAdvanceProofOfDocument;
use App\Models\MCashAdvanceReportDocument;
use App\Models\RCashAdvanceDifferent;
use App\Models\RCashAdvanceMethod;
use App\Models\TDocument;
use App\Models\TPerson;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CashAdvanceReportController extends Controller
{
    public function getReportCAData($dataPerPage = 2, $searchQuery = null)
    {
        $data = CashAdvanceReport::orderBy('REPORT_CASH_ADVANCE_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('REPORT_CASH_ADVANCE_NUMBER')) {
                $data->where('REPORT_CASH_ADVANCE_CASH_ADVANCE_ID', 'like', '%'.$searchQuery->REPORT_CASH_ADVANCE_NUMBER.'%');
            }
        }
        return $data->paginate($dataPerPage);
    }

    public function getCAReport(Request $request)
    {
        $data = $this->getReportCAData(10, $request);
        return response()->json($data);
    }

    public function getCAReportById(string $id) 
    {
        $data = CashAdvanceReport::with('cash_advance')->findOrFail($id);
        // $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_CASH_ADVANCE_ID', $id);
        // dd($data);
        return response()->json($data);
    }

    public function getCountCAReportRequestStatus()
    {
        $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 1)->count();

        return response()->json($data);
    }

    public function getCountCAReportApprove1Status()
    {
        $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 2)->count();

        return response()->json($data);
    }

    public function getCountCAReportApprove2Status()
    {
        $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 2)->count();

        return response()->json($data);
    }

    public function getCountCAReportPendingReportStatus()
    {
        $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 5)->count();

        return response()->json($data);
    }

    public function getCountCAReportNeedRevisionStatus()
    {
        $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 3)
                            ->orWhere('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 3)
                            ->orWhere('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', 3)
                            ->count();

        return response()->json($data);
    }

    public function getCountCAReportRejectStatus()
    {
        $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 4)
                            ->orWhere('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 4)
                            ->orWhere('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', 4)
                            ->count();

        return response()->json($data);
    }

    public function getCashAdvanceDifferents()
    {
        $data = RCashAdvanceDifferent::all();

        return response()->json($data);
    }

    public function getCashAdvanceApproval()
    {
        $data = CashAdvanceCostClassification::all();

        return response()->json($data);
    }

    public function getCashAdvanceMethod()
    {
        $data = RCashAdvanceMethod::all();

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

    public function getCashAdvanceReportNumber()
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

        $code = 'PV/RCA/';
        $start_char = 14;
        $start_char_2 = 7;
        
        $year_month = date('Y/n').'/';

        $queries = DB::select('SELECT MAX(REPORT_CASH_ADVANCE_NUMBER) AS max_number FROM t_report_cash_advance');

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

        $cash_advance_report_number = $code . $year_month . $counting;

        return $cash_advance_report_number;
    }

    public function cash_advance_report_download($cash_advance_detail_report_id, $document_id)
    {
        $document = TDocument::find($document_id);

        $document_filename = $cash_advance_detail_report_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
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

    public function cash_advance_report_proof_of_document_download($report_cash_advance_id, $document_id)
    {
        $document = TDocument::find($document_id);

        $document_filename = $report_cash_advance_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
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

    public function cash_advance_report(Request $request)
    {
        // dd($request);

        $user_id = auth()->user()->id;
        $person = TPerson::find($request->cash_advance_first_approval_by);

        $total_amount_report = 0;

        foreach ($request->CashAdvanceDetail as $value) {
            $total_amount_report += $value['cash_advance_detail_amount'];
        }

        $report_cash_advance_total_amount_different = $request->cash_advance_total_amount_request - $total_amount_report;

        if ($report_cash_advance_total_amount_different > 0) {
            $type = 1;
        } else if ($report_cash_advance_total_amount_different < 0) {
            $type = 2;
        } else {
            $type = 3;
        }
        
        $report_cash_advance_id = $request->cash_advance_id;
        $report_cash_advance_number = $this->getCashAdvanceReportNumber();
        $report_cash_advance_division = "IT";
        $report_cash_advance_used_by = $request->cash_advance_used_by;
        $report_cash_advance_requested_by = $user_id;
        $report_cash_advance_requested_date = now();
        $report_cash_advance_first_approval_by = $request->cash_advance_first_approval_by;
        $report_cash_advance_first_approval_user = $person->PERSON_FIRST_NAME;
        $report_cash_advance_first_approval_status = 1;
        $report_cash_advance_request_note = $request->cash_advance_request_note;
        $report_cash_advance_type = $type;
        $report_cash_advance_total_amount = $total_amount_report;
        $report_cash_advance_total_amount_request = $request->cash_advance_total_amount_request;
        $cash_advance_created_at = now();
        $cash_advance_created_by = $user_id;

        // Insert Report CA
        $report_cash_advance = CashAdvanceReport::create([
            'REPORT_CASH_ADVANCE_CASH_ADVANCE_ID' => $report_cash_advance_id,
            'REPORT_CASH_ADVANCE_NUMBER' => $report_cash_advance_number,
            'REPORT_CASH_ADVANCE_DIVISION' => $report_cash_advance_division,
            'REPORT_CASH_ADVANCE_USED_BY' => $report_cash_advance_used_by,
            'REPORT_CASH_ADVANCE_REQUESTED_BY' => $report_cash_advance_requested_by,
            'REPORT_CASH_ADVANCE_REQUESTED_DATE' => $report_cash_advance_requested_date,
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_BY' => $report_cash_advance_first_approval_by,
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_USER' => $report_cash_advance_first_approval_user,
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $report_cash_advance_first_approval_status,
            'REPORT_CASH_ADVANCE_REQUEST_NOTE' => $report_cash_advance_request_note,
            'REPORT_CASH_ADVANCE_TYPE' => $report_cash_advance_type,
            'REPORT_CASH_ADVANCE_TOTAL_AMOUNT' => $report_cash_advance_total_amount,
            'REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST' => $report_cash_advance_total_amount_request,
            'REPORT_CASH_ADVANCE_TOTAL_AMOUNT_DIFFERENT' => $report_cash_advance_total_amount_different,
            'REPORT_CASH_ADVANCE_CREATED_AT' => $cash_advance_created_at,
            'REPORT_CASH_ADVANCE_CREATED_BY' => $cash_advance_created_by
        ])->REPORT_CASH_ADVANCE_ID;

        // Created Log Report CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Cash Advance Report).",
                "module"      => "Cash Advance Report",
                "id"          => $report_cash_advance
            ]),
            'action_by'  => Auth::user()->email
        ]);

        foreach ($request->CashAdvanceDetail as $key => $cad) {
            $report_cash_advance_detail_start_date = $cad['cash_advance_detail_start_date'];
            $report_cash_advance_detail_end_date = $cad['cash_advance_detail_end_date'];
            $report_cash_advance_detail_purpose = $cad['cash_advance_detail_purpose'];
            $report_cash_advance_detail_location = $cad['cash_advance_detail_location'];
            $cash_advance_detail_relation_organization_id = $cad['cash_advance_detail_relation_organization_id']['value'];
            $report_cash_advance_detail_relation_name = $cad['cash_advance_detail_relation_name'];
            $report_cash_advance_detail_relation_position = $cad['cash_advance_detail_relation_position'];
            $report_cash_advance_detail_amount = $cad['cash_advance_detail_amount'];
            $report_cash_advance_detail_cost_classification = $cad['cash_advance_detail_cost_classification'];
            $report_cash_advance_detail_amount_approve = $cad['cash_advance_detail_amount_approve'];
            $report_cash_advance_detail_remarks = $cad['cash_advance_detail_remarks'];

            $report_cash_advance_detail = CashAdvanceDetailReport::create([
                'REPORT_CASH_ADVANCE_ID' => $report_cash_advance,
                'REPORT_CASH_ADVANCE_DETAIL_START_DATE' => $report_cash_advance_detail_start_date,
                'REPORT_CASH_ADVANCE_DETAIL_END_DATE' => $report_cash_advance_detail_end_date,
                'REPORT_CASH_ADVANCE_DETAIL_PURPOSE' => $report_cash_advance_detail_purpose,
                'REPORT_CASH_ADVANCE_DETAIL_LOCATION' => $report_cash_advance_detail_location,
                'REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID' => $cash_advance_detail_relation_organization_id,
                'REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME' => $report_cash_advance_detail_relation_name,
                'REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION' => $report_cash_advance_detail_relation_position,
                'REPORT_CASH_ADVANCE_DETAIL_AMOUNT' => $report_cash_advance_detail_amount,
                'REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION' => $report_cash_advance_detail_cost_classification,
                'REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE' => $report_cash_advance_detail_amount_approve,
                'REPORT_CASH_ADVANCE_DETAIL_REMARKS' => $report_cash_advance_detail_remarks
            ]);

            // Get data expenses detail id
            $report_cash_advance_detail_id = $report_cash_advance_detail->REPORT_CASH_ADVANCE_DETAIL_ID;

            // Start process file upload
            $file = $request->file('CashAdvanceDetail');
            if ($file) {
                foreach ($cad['cash_advance_detail_document_id'] as $key => $test) {
                    // $uploadedFile = $request->file('CashAdvanceDetail' . $test);
                    $uploadedFile = $test;
                    $parentDir = ((floor(($report_cash_advance_detail_id) / 1000)) * 1000) . '/';
                    $CAId = $report_cash_advance_detail_id . '/';
                    $typeDir = '';
                    $uploadPath = 'documents/' . 'CashAdvanceReport/'. $parentDir . $CAId . $typeDir;

                    $userId = Auth::user()->id;

                    $documentOriginalName =  $this->RemoveSpecialChar($uploadedFile->getClientOriginalName());
                    $documentFileName =  $report_cash_advance_detail_id . '-' . $this->RemoveSpecialChar($uploadedFile->getClientOriginalName());
                    $documentDirName =  $uploadPath;
                    $documentFileType = $uploadedFile->getMimeType();
                    $documentFileSize = $uploadedFile->getSize();

                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $test, $report_cash_advance_detail_id . '-' . $this->RemoveSpecialChar($uploadedFile->getClientOriginalName()));

                    $document = TDocument::create([
                        'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                        'DOCUMENT_FILENAME'               => $documentFileName,
                        'DOCUMENT_DIRNAME'                => $documentDirName,
                        'DOCUMENT_FILETYPE'               => $documentFileType,
                        'DOCUMENT_FILESIZE'               => $documentFileSize,
                        'DOCUMENT_CREATED_BY'             => $userId
                    ])->DOCUMENT_ID;

                    // if($document) {
                    //     TDocument::where('DOCUMENT_ID', $document)->update([
                    //         'DOCUMENT_FILENAME'           => $document . "-" . $documentOriginalName,
                    //     ]);
                    // }
                        
                    if ($document) {
                        MCashAdvanceReportDocument::create([
                            'CASH_ADVANCE_DOCUMENT_REPORT_CASH_ADVANCE_DETAIL_ID' => $report_cash_advance_detail_id,
                            'CASH_ADVANCE_DOCUMENT_REPORT_CASH_ADVANCE_DETAIL_DOCUMENT_ID' => $document,
                            'CASH_ADVANCE_DOCUMENT_CREATED_AT' => now(),
                            'CASH_ADVANCE_DOCUMENT_CREATED_BY' => $userId,
                        ]);
                    }
                }
            }

            // Created Log Report CA Detail
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Created (Cash Advance Report Detail).",
                    "module"      => "Cash Advance Report Detail",
                    "id"          => $report_cash_advance_detail
                ]),
                'action_by'  => Auth::user()->email
            ]);
        }

        return new JsonResponse([
            'New Cash Advance Report has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_report_approve(Request $request)
    {
        // dd($request);

        $cash_advance_detail_report = $request->cash_advance_detail_report;

        $total_amount_approve = 0;

        if (is_array($cash_advance_detail_report) && !empty($cash_advance_detail_report)) {
            foreach ($request->cash_advance_detail_report as $value) {
                $total_amount_approve += $value['REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE'];
            }
        }

        $report_cash_advance_id = $request->REPORT_CASH_ADVANCE_ID;
        $report_cash_advance_first_approval_change_status_date = date('Y-m-d H:i:s');
        $report_cash_advance_first_approval_status = $request->REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS;
        $report_cash_advance_type = $request->REPORT_CASH_ADVANCE_TYPE;
        $report_cash_advance_amount = $request->REPORT_CASH_ADVANCE_AMOUNT;
        $report_cash_advance_total_amount = $request->REPORT_CASH_ADVANCE_TOTAL_AMOUNT;
        $report_cash_advance_total_amount_approve = $total_amount_approve;
        $report_cash_advance_total_amount_different = $request->REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST - $report_cash_advance_total_amount_approve;

        CashAdvanceReport::where('REPORT_CASH_ADVANCE_ID', $report_cash_advance_id)->update([
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE' => $report_cash_advance_first_approval_change_status_date,
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $report_cash_advance_first_approval_status,
            'REPORT_CASH_ADVANCE_TYPE' => $report_cash_advance_type,
            'REPORT_CASH_ADVANCE_AMOUNT' => $report_cash_advance_amount,
            'REPORT_CASH_ADVANCE_TOTAL_AMOUNT' => $report_cash_advance_total_amount,
            'REPORT_CASH_ADVANCE_TOTAL_AMOUNT_APPROVE' => $report_cash_advance_total_amount_approve,
            'REPORT_CASH_ADVANCE_TOTAL_AMOUNT_DIFFERENT' => $report_cash_advance_total_amount_different,
        ]);

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Approve (Cash Advance Report).",
                "module"      => "Cash Advance Report",
                "id"          => $report_cash_advance_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        if (is_array($cash_advance_detail_report) && !empty($cash_advance_detail_report)) {
            foreach ($cash_advance_detail_report as $cad) {
                $report_cash_advance_detail_id = $cad['REPORT_CASH_ADVANCE_DETAIL_ID'];
                $report_cash_advance_detail_approval = $cad['REPORT_CASH_ADVANCE_DETAIL_APPROVAL'];
                $report_cash_advance_detail_cost_classification = $cad['REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION']['value'];
                $report_cash_advance_detail_amount_approve = $cad['REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE'];
                $report_cash_advance_detail_remarks = $cad['REPORT_CASH_ADVANCE_DETAIL_REMARKS'];

                CashAdvanceDetailReport::where('REPORT_CASH_ADVANCE_DETAIL_ID', $report_cash_advance_detail_id)->update([
                    'REPORT_CASH_ADVANCE_DETAIL_APPROVAL' => $report_cash_advance_detail_approval,
                    'REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION' => $report_cash_advance_detail_cost_classification,
                    'REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE' => $report_cash_advance_detail_amount_approve,
                    'REPORT_CASH_ADVANCE_DETAIL_REMARKS' => $report_cash_advance_detail_remarks
                ]);

                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Approve (Cash Advance Report).",
                        "module"      => "Cash Advance Report",
                        "id"          => $report_cash_advance_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        }

        return new JsonResponse([
            'Cash Advance Report has been approved.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_report_revised(Request $request)
    {
        // dd($request);

        $cash_advance_detail_report = $request->cash_advance_detail_report;

        $user_id = auth()->user()->id;

        $report_cash_advance_id = $request->REPORT_CASH_ADVANCE_ID;

        $CountRequestDataById = sizeof($cash_advance_detail_report);
        $CountCashAdvanceDetail = CashAdvanceDetailReport::where('REPORT_CASH_ADVANCE_ID', $report_cash_advance_id)->count();

        $total_amount_report = 0;

        foreach ($cash_advance_detail_report as $value) {
            $total_amount_report += $value['REPORT_CASH_ADVANCE_DETAIL_AMOUNT'];
        }

        $report_cash_advance_total_amount_different = $request->REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST - $total_amount_report;

        if ($report_cash_advance_total_amount_different > 0) {
            $type = 1;
        } else if ($report_cash_advance_total_amount_different < 0) {
            $type = 2;
        } else {
            $type = 3;
        }

        $report_cash_advance_total_amount = $total_amount_report;
        $report_cash_advance_first_approval_status = 1;
        $report_cash_advance_request_note = $request->REPORT_CASH_ADVANCE_REQUEST_NOTE;
        $report_cash_advance_updated_at = now();
        $report_cash_advance_updated_by = $user_id;

        CashAdvanceReport::where('REPORT_CASH_ADVANCE_ID', $report_cash_advance_id)->update([
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $report_cash_advance_first_approval_status,
            'REPORT_CASH_ADVANCE_REQUEST_NOTE' => $report_cash_advance_request_note,
            'REPORT_CASH_ADVANCE_TYPE' => $type,
            'REPORT_CASH_ADVANCE_TOTAL_AMOUNT' => $report_cash_advance_total_amount,
            'REPORT_CASH_ADVANCE_TOTAL_AMOUNT_DIFFERENT' => $report_cash_advance_total_amount_different,
            'REPORT_CASH_ADVANCE_UPDATED_AT' => $report_cash_advance_updated_at,
            'REPORT_CASH_ADVANCE_UPDATED_BY' => $report_cash_advance_updated_by
        ]);

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Revised (Cash Advance).",
                "module"      => "Cash Advance",
                "id"          => $report_cash_advance_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        if ($CountRequestDataById === $CountCashAdvanceDetail) {
            foreach ($cash_advance_detail_report as $cad) {
                $report_cash_advance_detail_id = $cad['REPORT_CASH_ADVANCE_DETAIL_ID'];
                $report_cash_advance_detail_start_date = $cad['REPORT_CASH_ADVANCE_DETAIL_START_DATE'];
                $report_cash_advance_detail_end_date = $cad['REPORT_CASH_ADVANCE_DETAIL_END_DATE'];
                $report_cash_advance_detail_purpose = $cad['REPORT_CASH_ADVANCE_DETAIL_PURPOSE'];
                $report_cash_advance_detail_location = $cad['REPORT_CASH_ADVANCE_DETAIL_LOCATION'];
                $report_cash_advance_detail_relation_organization_id = $cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID'];
                $report_cash_advance_detail_relation_name = $cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME'];
                $report_cash_advance_detail_relation_position = $cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION'];
                $report_cash_advance_detail_amount = $cad['REPORT_CASH_ADVANCE_DETAIL_AMOUNT'];
                // $report_cash_advance_detail_status = null;

                CashAdvanceDetailReport::where('REPORT_CASH_ADVANCE_DETAIL_ID', $report_cash_advance_detail_id)->update([
                    'REPORT_CASH_ADVANCE_DETAIL_START_DATE' => $report_cash_advance_detail_start_date,
                    'REPORT_CASH_ADVANCE_DETAIL_END_DATE' => $report_cash_advance_detail_end_date,
                    'REPORT_CASH_ADVANCE_DETAIL_PURPOSE' => $report_cash_advance_detail_purpose,
                    'REPORT_CASH_ADVANCE_DETAIL_LOCATION' => $report_cash_advance_detail_location,
                    'REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID' => $report_cash_advance_detail_relation_organization_id,
                    'REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME' => $report_cash_advance_detail_relation_name,
                    'REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION' => $report_cash_advance_detail_relation_position,
                    'REPORT_CASH_ADVANCE_DETAIL_AMOUNT' => $report_cash_advance_detail_amount,
                    // 'REPORT_CASH_ADVANCE_DETAIL_STATUS' => $report_cash_advance_detail_status
                ]);

                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Cash Advance Report).",
                        "module"      => "Cash Advance Report",
                        "id"          => $report_cash_advance_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        } else {
            CashAdvanceDetailReport::where('REPORT_CASH_ADVANCE_ID', $report_cash_advance_id)->delete();

            foreach ($cash_advance_detail_report as $cad) {
                $report_cash_advance_detail_id = $cad['REPORT_CASH_ADVANCE_DETAIL_ID'];
                $report_cash_advance_detail_start_date = $cad['REPORT_CASH_ADVANCE_DETAIL_START_DATE'];
                $report_cash_advance_detail_end_date = $cad['REPORT_CASH_ADVANCE_DETAIL_END_DATE'];
                $report_cash_advance_detail_purpose = $cad['REPORT_CASH_ADVANCE_DETAIL_PURPOSE'];
                $report_cash_advance_detail_location = $cad['REPORT_CASH_ADVANCE_DETAIL_LOCATION'];
                $report_cash_advance_detail_relation_organization_id = $cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID'];
                $report_cash_advance_detail_relation_name = $cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME'];
                $report_cash_advance_detail_relation_position = $cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION'];
                $report_cash_advance_detail_amount = $cad['REPORT_CASH_ADVANCE_DETAIL_AMOUNT'];

                CashAdvanceDetailReport::create([
                    'REPORT_CASH_ADVANCE_ID' => $report_cash_advance_id,
                    'REPORT_CASH_ADVANCE_DETAIL_START_DATE' => $report_cash_advance_detail_start_date,
                    'REPORT_CASH_ADVANCE_DETAIL_END_DATE' => $report_cash_advance_detail_end_date,
                    'REPORT_CASH_ADVANCE_DETAIL_PURPOSE' => $report_cash_advance_detail_purpose,
                    'REPORT_CASH_ADVANCE_DETAIL_LOCATION' => $report_cash_advance_detail_location,
                    'REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID' => $report_cash_advance_detail_relation_organization_id,
                    'REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME' => $report_cash_advance_detail_relation_name,
                    'REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION' => $report_cash_advance_detail_relation_position,
                    'REPORT_CASH_ADVANCE_DETAIL_AMOUNT' => $report_cash_advance_detail_amount
                ]);

                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Cash Advance Report).",
                        "module"      => "Cash Advance Report",
                        "id"          => $report_cash_advance_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        }

        return new JsonResponse([
            'Cash Advance Report has been revised.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_report_execute(Request $request)
    {
        // dd($request->file('proof_of_document'));
        $report_cash_advance_id = $request->cash_advance_id;
        $report_cash_advance_second_approval_status = 6;
        $report_cash_advance_method = $request->method;
        $report_cash_advance_transaction_date = $request->transaction_date;

        CashAdvanceReport::where('REPORT_CASH_ADVANCE_ID', $report_cash_advance_id)->update([
            'REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS' => $report_cash_advance_second_approval_status,
            'REPORT_CASH_ADVANCE_METHOD' => $report_cash_advance_method,
            'REPORT_CASH_ADVANCE_TRANSACTION_DATE' => $report_cash_advance_transaction_date
        ]);

        // Start process file upload
        $files = $request->file('proof_of_document');
        if (is_array($files) && !empty($files)) {
            foreach ($files as $file) {
                $uploadedFile = $file['proof_of_document'];
                $parentDir = ((floor(($report_cash_advance_id) / 1000)) * 1000) . '/';
                $CAId = $report_cash_advance_id . '/';
                $typeDir = '';
                $uploadPath = 'documents/' . 'CashAdvanceProofOfDocument/'. $parentDir . $CAId . $typeDir;

                $userId = Auth::user()->id;

                $documentOriginalName =  $this->RemoveSpecialChar($uploadedFile->getClientOriginalName());
                $documentFileName =  $report_cash_advance_id . '-' . $this->RemoveSpecialChar($uploadedFile->getClientOriginalName());
                $documentDirName  =  $uploadPath;
                $documentFileType = $uploadedFile->getMimeType();
                $documentFileSize = $uploadedFile->getSize();

                Storage::makeDirectory($uploadPath, 0777, true, true);
                Storage::disk('public')->putFileAs($uploadPath, $uploadedFile, $report_cash_advance_id . '-' . $this->RemoveSpecialChar($uploadedFile->getClientOriginalName()));

                $document = TDocument::create([
                    'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                    'DOCUMENT_FILENAME'               => $documentFileName,
                    'DOCUMENT_DIRNAME'                => $documentDirName,
                    'DOCUMENT_FILETYPE'               => $documentFileType,
                    'DOCUMENT_FILESIZE'               => $documentFileSize,
                    'DOCUMENT_CREATED_BY'             => $userId
                ])->DOCUMENT_ID;

                if($document) {
                    TDocument::where('DOCUMENT_ID', $document)->update([
                        'DOCUMENT_FILENAME'           => $document . "-" . $documentOriginalName,
                    ]);
                }
                    
                if ($document) {
                    MCashAdvanceProofOfDocument::create([
                        'CASH_ADVANCE_PROOF_OF_DOCUMENT_REPORT_CASH_ADVANCE_ID' => $report_cash_advance_id,
                        'CASH_ADVANCE_PROOF_OF_DOCUMENT_REPORT_CASH_ADVANCE_DOCUMENT_ID' => $document,
                        'CASH_ADVANCE_PROOF_OF_DOCUMENT_CREATED_AT' => now(),
                        'CASH_ADVANCE_PROOF_OF_DOCUMENT_CREATED_BY' => $userId,
                    ]);
                }
            }
        }

        // Created Log CA Detail
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Execute (Cash Advance Report Execute).",
                "module"      => "Cash Advance Report",
                "id"          => $report_cash_advance_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            'Cash Advance Report has been execute.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}