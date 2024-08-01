<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\CashAdvanceDetailReport;
use App\Models\CashAdvanceReport;
use App\Models\Document;
use App\Models\MCashAdvanceDocument;
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
                $data->where('CASH_ADVANCE_ID', 'like', '%'.$searchQuery->REPORT_CASH_ADVANCE_NUMBER.'%');
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
        $data = CashAdvanceReport::findOrFail($id);
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

    public function cash_advance_report(Request $request)
    {
        // dd($request);

        $user_id = auth()->user()->id;
        $user = User::find($request->cash_advance_first_approval_by);

        $total_amount_report = 0;

        foreach ($request->CashAdvanceDetail as $value) {
            $total_amount_report += $value['cash_advance_detail_amount'];
        }
        
        $report_cash_advance_id = $request->cash_advance_id;
        $report_cash_advance_number = $this->getCashAdvanceReportNumber();
        $report_cash_advance_division = "IT";
        $report_cash_advance_used_by = $request->cash_advance_used_by;
        $report_cash_advance_requested_by = $user_id;
        $report_cash_advance_requested_date = now();
        $report_cash_advance_first_approval_by = $request->cash_advance_first_approval_by;
        $report_cash_advance_first_approval_user = $user->name;
        $report_cash_advance_first_approval_status = 0;
        $report_cash_advance_request_note = $request->cash_advance_request_note;
        $report_cash_advance_delivery_method_transfer = $request->cash_advance_delivery_method_transfer;
        $report_cash_advance_transfer_amount = $request->cash_advance_transfer_amount;
        $report_cash_advance_delivery_method_cash = $request->cash_advance_delivery_method_cash;
        $report_cash_advance_cash_amount = $request->cash_advance_cash_amount;
        $report_cash_advance_refund_amount = $request->refund_amount;
        $report_cash_advance_refund_type = $request->refund_type;
        // $report_refund_proof = $request->file('refund_proof')[0];
        $report_cash_advance_total_amount = $total_amount_report;
        $cash_advance_created_at = now();
        $cash_advance_created_by = $user_id;

        // Insert Report CA
        $report_cash_advance = CashAdvanceReport::create([
            'CASH_ADVANCE_ID' => $report_cash_advance_id,
            'REPORT_CASH_ADVANCE_NUMBER' => $report_cash_advance_number,
            'REPORT_CASH_ADVANCE_DIVISION' => $report_cash_advance_division,
            'REPORT_CASH_ADVANCE_USED_BY' => $report_cash_advance_used_by,
            'REPORT_CASH_ADVANCE_REQUESTED_BY' => $report_cash_advance_requested_by,
            'REPORT_CASH_ADVANCE_REQUESTED_DATE' => $report_cash_advance_requested_date,
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_BY' => $report_cash_advance_first_approval_by,
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_USER' => $report_cash_advance_first_approval_user,
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $report_cash_advance_first_approval_status,
            'REPORT_CASH_ADVANCE_REQUEST_NOTE' => $report_cash_advance_request_note,
            'REPORT_CASH_ADVANCE_DELIVERY_METHOD_TRANSFER' => $report_cash_advance_delivery_method_transfer,
            'REPORT_CASH_ADVANCE_TRANSFER_AMOUNT' => $report_cash_advance_transfer_amount,
            'REPORT_CASH_ADVANCE_DELIVERY_METHOD_CASH' => $report_cash_advance_delivery_method_cash,
            'REPORT_CASH_ADVANCE_CASH_AMOUNT' => $report_cash_advance_cash_amount,
            'REPORT_CASH_ADVANCE_REFUND_AMOUNT' => $report_cash_advance_refund_amount,
            'REPORT_CASH_ADVANCE_REFUND_TYPE' => $report_cash_advance_refund_type,
            'REPORT_CASH_ADVANCE_TOTAL_AMOUNT' => $report_cash_advance_total_amount,
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

                    // Storage::makeDirectory($uploadPath, 0777, true, true);
                    // Storage::disk('public')->putFileAs($uploadPath, $test, $report_cash_advance_detail_id . '-' . $this->RemoveSpecialChar($uploadedFile->getClientOriginalName()));

                    $document = Document::create([
                        'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                        'DOCUMENT_FILENAME'               => $documentFileName,
                        'DOCUMENT_DIRNAME'                => $documentDirName,
                        'DOCUMENT_FILETYPE'               => $documentFileType,
                        'DOCUMENT_FILESIZE'               => $documentFileSize,
                        'DOCUMENT_CREATED_BY'             => $userId
                    ])->DOCUMENT_ID;
                        
                    if ($document) {
                        MCashAdvanceDocument::create([
                            'CASH_ADVANCE_DOCUMENT_CASH_ADVANCE_DETAIL_ID' => $report_cash_advance_detail_id,
                            'CASH_ADVANCE_DOCUMENT_CASH_ADVANCE_DETAIL_DOCUMENT_ID' => $document,
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

        // if($report_refund_proof) {
        //     $parentDir = ((floor(($report_cash_advance) / 1000)) * 1000) . '/';
        //     $CAId = $report_cash_advance . '/';
        //     $typeDir = '';
        //     $uploadPath = 'documents/' . 'CashAdvanceReport/'. $parentDir . $CAId . $typeDir;

        //     $userId = Auth::user()->id;
        //     $documentOriginalName =  $this->RemoveSpecialChar($report_refund_proof->getClientOriginalName());
        //     $documentFileName =  $report_cash_advance . '-' . $this->RemoveSpecialChar($report_refund_proof->getClientOriginalName());
        //     $documentDirName =  $uploadPath;
        //     $documentFileType = $report_refund_proof->getMimeType();
        //     $documentFileSize = $report_refund_proof->getSize();

        //     Storage::makeDirectory($uploadPath, 0777, true, true);
        //     Storage::disk('public')->putFileAs($uploadPath, $report_refund_proof, $report_cash_advance . '-' . $this->RemoveSpecialChar($report_refund_proof->getClientOriginalName()));

        //     $document = Document::create([
        //         'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
        //         'DOCUMENT_FILENAME'               => $documentFileName,
        //         'DOCUMENT_DIRNAME'                => $documentDirName,
        //         'DOCUMENT_FILETYPE'               => $documentFileType,
        //         'DOCUMENT_FILESIZE'               => $documentFileSize,
        //         'DOCUMENT_CREATED_BY'             => $userId
        //     ])->DOCUMENT_ID;
                
        //     if ($document) {
        //         CashAdvanceReport::where('CASH_ADVANCE_ID', $report_cash_advance)
        //         ->update([
        //             'REPORT_CASH_ADVANCE_REFUND_PROOF' => $document
        //         ]);
        //     }
        // }

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
        $report_cash_advance_delivery_method_transfer = $request->REPORT_CASH_ADVANCE_DELIVERY_METHOD_TRANSFER;
        $report_cash_advance_transfer_amount = $request->REPORT_CASH_ADVANCE_TRANSFER_AMOUNT;
        $report_cash_advance_delivery_method_cash = $request->REPORT_CASH_ADVANCE_DELIVERY_METHOD_CASH;
        $report_cash_advance_cash_amount = $request->REPORT_CASH_ADVANCE_CASH_AMOUNT;
        $report_cash_advance_total_amount = $request->REPORT_CASH_ADVANCE_TOTAL_AMOUNT;
        $report_cash_advance_total_amount_approve = $total_amount_approve;
        $report_cash_advance_total_amount_different = $report_cash_advance_total_amount - $report_cash_advance_total_amount_approve;

        CashAdvanceReport::where('REPORT_CASH_ADVANCE_ID', $report_cash_advance_id)->update([
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE' => $report_cash_advance_first_approval_change_status_date,
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $report_cash_advance_first_approval_status,
            'REPORT_CASH_ADVANCE_DELIVERY_METHOD_TRANSFER' => $report_cash_advance_delivery_method_transfer,
            'REPORT_CASH_ADVANCE_TRANSFER_AMOUNT' => $report_cash_advance_transfer_amount,
            'REPORT_CASH_ADVANCE_DELIVERY_METHOD_CASH' => $report_cash_advance_delivery_method_cash,
            'REPORT_CASH_ADVANCE_CASH_AMOUNT' => $report_cash_advance_cash_amount,
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
                $report_cash_advance_detail_cost_classification = $cad['REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION'];
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

        $total_amount = 0;

        foreach ($cash_advance_detail_report as $value) {
            $total_amount += $value['REPORT_CASH_ADVANCE_DETAIL_AMOUNT'];
        }

        $report_cash_advance_total_amount = $total_amount;
        $report_cash_advance_first_approval_status = 0;
        $report_cash_advance_request_note = $request->REPORT_CASH_ADVANCE_REQUEST_NOTE;
        $report_cash_advance_delivery_method_transfer = $request->REPORT_CASH_ADVANCE_DELIVERY_METHOD_TRANSFER;
        $report_cash_advance_transfer_amount = $request->REPORT_CASH_ADVANCE_TRANSFER_AMOUNT;
        $report_cash_advance_delivery_method_cash = $request->REPORT_CASH_ADVANCE_DELIVERY_METHOD_CASH;
        $report_cash_advance_cash_amount = $request->REPORT_CASH_ADVANCE_CASH_AMOUNT;
        $report_cash_advance_updated_at = now();
        $report_cash_advance_updated_by = $user_id;

        CashAdvanceReport::where('REPORT_CASH_ADVANCE_ID', $report_cash_advance_id)->update([
            'REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $report_cash_advance_first_approval_status,
            'REPORT_CASH_ADVANCE_REQUEST_NOTE' => $report_cash_advance_request_note,
            'REPORT_CASH_ADVANCE_DELIVERY_METHOD_TRANSFER' => $report_cash_advance_delivery_method_transfer,
            'REPORT_CASH_ADVANCE_TRANSFER_AMOUNT' => $report_cash_advance_transfer_amount,
            'REPORT_CASH_ADVANCE_DELIVERY_METHOD_CASH' => $report_cash_advance_delivery_method_cash,
            'REPORT_CASH_ADVANCE_CASH_AMOUNT' => $report_cash_advance_cash_amount,
            'REPORT_CASH_ADVANCE_TOTAL_AMOUNT' => $report_cash_advance_total_amount,
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
}
