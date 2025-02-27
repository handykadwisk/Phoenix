<?php

namespace App\Http\Controllers;

use App\Models\CashAdvanceDetailReport;
use App\Models\CashAdvanceReport;
use App\Models\Document;
use App\Models\MCashAdvanceProofOfDocument;
use App\Models\MCashAdvanceReportDocument;
use App\Models\RCashAdvanceApproval;
use App\Models\RCashAdvanceDifference;
use App\Models\RCashAdvanceDifferent;
use App\Models\RCashAdvanceMethod;
use App\Models\TEmployee;
use App\Models\TPerson;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

use function App\Helpers\replace_special_characters;
use function App\Helpers\user_log_create;

class CashAdvanceReportController extends Controller
{
    public function getCAReportById(string $id) 
    {
        $data = CashAdvanceReport::with('cash_advance')->findOrFail($id);

        return response()->json($data);
    }

    public function getCountCAReportRequestStatus()
    {
        $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 1)->count();

        return response()->json($data);
    }

    public function getCountCAReportApprove1Status()
    {
        $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS', 2)
                                ->where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', null)
                                ->where('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', null)
                                ->count();

        return response()->json($data);
    }

    public function getCountCAReportApprove2Status()
    {
        $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', 2)
                                ->where('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', null)
                                ->count();

        return response()->json($data);
    }

    public function getCountCAReportApprove3Status()
    {
        $data = CashAdvanceReport::where('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS', 2)
                                ->where('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS', '!=', 6)
                                ->count();

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

    public function getCashAdvanceDifference()
    {
        $data = RCashAdvanceDifference::all();

        return response()->json($data);
    }

    public function getCashAdvanceApproval()
    {
        $data = RCashAdvanceApproval::all();

        return response()->json($data);
    }

    public function getCashAdvanceMethod()
    {
        $data = RCashAdvanceMethod::all();

        return response()->json($data);
    }

    public function generateCashAdvanceReportNumber()
    {
        // Format kode
        $prefix = 'PV/RCA/';
        
        // Ambil tahun dan bulan saat ini
        $currentYear = date('Y');
        $currentMonth = date('n');

        // Cari kode terakhir dari tabel
        $lastCode = CashAdvanceReport::orderBy('REPORT_CASH_ADVANCE_CREATED_DATE', 'desc')->first();

        // Inisialisasi nomor urut
        $nextNumber = 1;

        if ($lastCode) {
            // Mengambil tahun dan bulan dari kode terakhir
            $lastCodeYear = substr($lastCode->REPORT_CASH_ADVANCE_NUMBER, 7, 4);
            $lastCodeMonth = substr($lastCode->REPORT_CASH_ADVANCE_NUMBER, 12, strlen($currentMonth));

            // Jika bulan dan tahun sama, lanjutkan increment nomor
            if ($lastCodeYear == $currentYear && $lastCodeMonth == $currentMonth) {
                $lastSequenceNumber = (int) substr($lastCode->REPORT_CASH_ADVANCE_NUMBER, -5);
                $nextNumber = $lastSequenceNumber + 1;
            }
        }

        // Format nomor urut dengan dengan menambahkan 0 di depan nomor urut
        $formattedNumber = str_pad($nextNumber, 5, '0', STR_PAD_LEFT);

        // Menggabungkan kode akhir
        $reportCashAdvanceNumber = $prefix . "$currentYear/$currentMonth/$formattedNumber";

        return $reportCashAdvanceNumber;
    }

    public function cash_advance_report_doc_reader($cash_advance_report_detail_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $cash_advance_report_detail_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
        $document_dirname = $document->DOCUMENT_DIRNAME;

        $filePath = "/storage" . "/". $document_dirname . "/" . $document_filename;

        $data = [
            'uri' => $filePath
        ];

        return Inertia::render('CA/CashAdvanceDocReader', $data);
    }

    public function cash_advance_report_proof_of_document_doc_reader($cash_advance_report_id, $document_id)
    {
        $document = Document::find($document_id);

        $document_filename = $cash_advance_report_id . '-' . $document->DOCUMENT_ORIGINAL_NAME;
        $document_dirname = $document->DOCUMENT_DIRNAME;

        $filePath = "/storage" . "/". $document_dirname . "/" . $document_filename;

        $data = [
            'uri' => $filePath
        ];

        return Inertia::render('CA/CashAdvanceDocReader', $data);
    }

    public function cash_advance_report_download($cash_advance_detail_report_id, $document_id)
    {
        $document = Document::find($document_id);

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
        $document = Document::find($document_id);

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
        DB::transaction(function () use ($request) {
            $user = Auth::user();
            $user_id = $user->id;
            $employee = TEmployee::find($request->cash_advance_first_approval_by);
    
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
            $report_cash_advance_number = $this->generateCashAdvanceReportNumber();
            $report_cash_advance_division = $request->cash_advance_division;
            $report_cash_advance_cost_center = $request->cash_advance_cost_center;
            $report_cash_advance_branch = $request->cash_advance_branch;
            $report_cash_advance_used_by = $request->cash_advance_used_by;
            $report_cash_advance_requested_by = $request->cash_advance_requested_by;
            $report_cash_advance_requested_date = now();
            $report_cash_advance_first_approval_by = $request->cash_advance_first_approval_by;
            $report_cash_advance_first_approval_user = $employee->EMPLOYEE_FIRST_NAME;
            $report_cash_advance_first_approval_status = 1;
            $report_cash_advance_request_note = $request->cash_advance_request_note;
            $report_cash_advance_type = $type;
            $report_cash_advance_total_amount = $total_amount_report;
            $report_cash_advance_total_amount_request = $request->cash_advance_total_amount_request;
            $report_cash_advance_created_date = now();
            $report_cash_advance_created_by = $user_id;
    
            // Insert Report CA
            $report_cash_advance = CashAdvanceReport::create([
                'REPORT_CASH_ADVANCE_CASH_ADVANCE_ID' => $report_cash_advance_id,
                'REPORT_CASH_ADVANCE_NUMBER' => $report_cash_advance_number,
                'REPORT_CASH_ADVANCE_DIVISION' => $report_cash_advance_division,
                'REPORT_CASH_ADVANCE_COST_CENTER' => $report_cash_advance_cost_center,
                'REPORT_CASH_ADVANCE_BRANCH' => $report_cash_advance_branch,
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
                'REPORT_CASH_ADVANCE_CREATED_DATE' => $report_cash_advance_created_date,
                'REPORT_CASH_ADVANCE_CREATED_BY' => $report_cash_advance_created_by
            ])->REPORT_CASH_ADVANCE_ID;
    
            // Created Log Report CA
            user_log_create("Created (Cash Advance Report).", "Cash Advance Report", $report_cash_advance);
    
            foreach ($request->CashAdvanceDetail as $cad) {
                $relation_organization_id = $cad['cash_advance_detail_relation_organization_id'];

                $report_cash_advance_detail_start_date = $cad['cash_advance_detail_start_date'];
                $report_cash_advance_detail_end_date = $cad['cash_advance_detail_end_date'];
                $report_cash_advance_detail_purpose = $cad['cash_advance_detail_purpose'];
                $report_cash_advance_detail_location = $cad['cash_advance_detail_location'];
                $cash_advance_detail_relation_organization_id = $relation_organization_id;
                if ($relation_organization_id != null || $relation_organization_id != "") {
                    $cash_advance_detail_relation_organization_id = $relation_organization_id['value'];
                }
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
                $files = $request->file('CashAdvanceDetail');
                if ($files) {
                    if (isset($cad['cash_advance_detail_document_id'])) {
                        foreach ($cad['cash_advance_detail_document_id'] as $file) {
                            $uploadedFile = $file;
                            $parentDir = ((floor(($report_cash_advance_detail_id) / 1000)) * 1000) . '/';
                            $CAId = $report_cash_advance_detail_id . '/';
                            $typeDir = '';
                            $uploadPath = 'documents/' . 'CashAdvanceReport/'. $parentDir . $CAId . $typeDir;
        
                            $userId = Auth::user()->id;
        
                            $documentOriginalName =  replace_special_characters($uploadedFile->getClientOriginalName());
                            $documentFileName =  $report_cash_advance_detail_id . '-' . replace_special_characters($uploadedFile->getClientOriginalName());
                            $documentDirName =  $uploadPath;
                            $documentFileType = $uploadedFile->getMimeType();
                            $documentFileSize = $uploadedFile->getSize();
        
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $uploadedFile, $report_cash_advance_detail_id . '-' . replace_special_characters($uploadedFile->getClientOriginalName()));
        
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
                                MCashAdvanceReportDocument::create([
                                    'CASH_ADVANCE_DOCUMENT_REPORT_CASH_ADVANCE_DETAIL_ID' => $report_cash_advance_detail_id,
                                    'CASH_ADVANCE_DOCUMENT_REPORT_CASH_ADVANCE_DETAIL_DOCUMENT_ID' => $document,
                                    'CASH_ADVANCE_DOCUMENT_CREATED_DATE' => now(),
                                    'CASH_ADVANCE_DOCUMENT_CREATED_BY' => $userId,
                                ]);
                            }
                        }
                    }
                }
    
                // Created Log Report CA Detail
                user_log_create("Created (Cash Advance Report Detail).", "Cash Advance Report Detail", $report_cash_advance_detail);
            }
        });
        
        return new JsonResponse([
            'New Cash Advance Report has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_report_approve(Request $request)
    {
        $cashAdvanceReportStatus = DB::transaction(function () use ($request) {
            $cash_advance_detail_report = $request->cash_advance_detail_report;
    
            $total_amount_approve = 0;
    
            if (is_array($cash_advance_detail_report) && !empty($cash_advance_detail_report)) {
                foreach ($request->cash_advance_detail_report as $value) {
                    $total_amount_approve += $value['REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE'];
                }
            }
            
            $report_cash_advance_id = $request->REPORT_CASH_ADVANCE_ID;
            $report_cash_advance_type = $request->REPORT_CASH_ADVANCE_TYPE;
            $report_cash_advance_amount = $request->REPORT_CASH_ADVANCE_AMOUNT;
            $report_cash_advance_total_amount = $request->REPORT_CASH_ADVANCE_TOTAL_AMOUNT;
            $report_cash_advance_total_amount_approve = $total_amount_approve;
            $report_cash_advance_total_amount_different = $request->REPORT_CASH_ADVANCE_TOTAL_AMOUNT_REQUEST - $total_amount_approve;
            
            $updateData = [
                'REPORT_CASH_ADVANCE_TYPE' => $report_cash_advance_type,
                'REPORT_CASH_ADVANCE_AMOUNT' => $report_cash_advance_amount,
                'REPORT_CASH_ADVANCE_TOTAL_AMOUNT' => $report_cash_advance_total_amount,
                'REPORT_CASH_ADVANCE_TOTAL_AMOUNT_APPROVE' => $report_cash_advance_total_amount_approve,
                'REPORT_CASH_ADVANCE_TOTAL_AMOUNT_DIFFERENT' => $report_cash_advance_total_amount_different,
            ];

            $userDivisionId = Auth::user()->employee->division->COMPANY_DIVISION_ID;

            // Start logic condition revised
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS == 3) {
                $updateData['REPORT_CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS'] = 3;
            }

            if ($userDivisionId === 132 && $request->REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS == 3) {
                $updateData['REPORT_CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS'] = 3;
            }

            if ($userDivisionId === 122 && $request->REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS == 3) {
                $updateData['REPORT_CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS'] = 3;
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_BY'] = null;
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_USER'] = null;
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = null;
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS'] = null;
            }
            // End logic condition revised
            
            // Start logic condition approve
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS == 2) {
                $updateData['REPORT_CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS'] = $request->REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS;
            }

            if ($userDivisionId === 132 && $request->REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS == 2) {
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_BY'] = $request->REPORT_CASH_ADVANCE_SECOND_APPROVAL_BY;
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_USER'] = $request->REPORT_CASH_ADVANCE_SECOND_APPROVAL_USER;
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS'] = $request->REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS;
            }

            if ($userDivisionId === 122 && $request->REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS == 2) {
                $updateData['REPORT_CASH_ADVANCE_THIRD_APPROVAL_BY'] = $request->REPORT_CASH_ADVANCE_THIRD_APPROVAL_BY;
                $updateData['REPORT_CASH_ADVANCE_THIRD_APPROVAL_USER'] = $request->REPORT_CASH_ADVANCE_THIRD_APPROVAL_USER;
                $updateData['REPORT_CASH_ADVANCE_THIRD_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS'] = $request->REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS;
            }
            // End logic condition approve

            // Start logic condition reject
            if ($userDivisionId !== 132 && $userDivisionId !== 122 && $request->REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS == 4) {
                $updateData['REPORT_CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS'] = $request->REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS;
            }

            if ($userDivisionId === 132 && $request->REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS == 4) {
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_BY'] = $request->REPORT_CASH_ADVANCE_SECOND_APPROVAL_BY;
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_USER'] = $request->REPORT_CASH_ADVANCE_SECOND_APPROVAL_USER;
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS'] = $request->REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS;
            }

            if ($userDivisionId === 122 && $request->REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS == 4) {
                $updateData['REPORT_CASH_ADVANCE_THIRD_APPROVAL_BY'] = $request->REPORT_CASH_ADVANCE_THIRD_APPROVAL_BY;
                $updateData['REPORT_CASH_ADVANCE_THIRD_APPROVAL_USER'] = $request->REPORT_CASH_ADVANCE_THIRD_APPROVAL_USER;
                $updateData['REPORT_CASH_ADVANCE_THIRD_APPROVAL_CHANGE_STATUS_DATE'] = now();
                $updateData['REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS'] = $request->REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS;
            }
            // End logic condition reject

            CashAdvanceReport::where('REPORT_CASH_ADVANCE_ID', $report_cash_advance_id)->update($updateData);

            // Create log for approval
            user_log_create("Approve (Cash Advance Report).", "Cash Advance Report", $report_cash_advance_id);
    
            if (is_array($cash_advance_detail_report) && !empty($cash_advance_detail_report)) {
                foreach ($cash_advance_detail_report as $cad) {
                    $cost_classification = $cad['REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION'];
                    
                    $report_cash_advance_detail_id = $cad['REPORT_CASH_ADVANCE_DETAIL_ID'];
                    $report_cash_advance_detail_approval = $cad['REPORT_CASH_ADVANCE_DETAIL_APPROVAL'];
                    $report_cash_advance_detail_amount_approve = $cad['REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE'];
                    $report_cash_advance_detail_remarks = $cad['REPORT_CASH_ADVANCE_DETAIL_REMARKS'];
                    $report_cash_advance_detail_cost_classification = $cost_classification;
                    if ($cost_classification != null || $cost_classification != "") {
                        $report_cash_advance_detail_cost_classification = $cost_classification;
                    }
    
                    CashAdvanceDetailReport::where('REPORT_CASH_ADVANCE_DETAIL_ID', $report_cash_advance_detail_id)->update([
                        'REPORT_CASH_ADVANCE_DETAIL_APPROVAL' => $report_cash_advance_detail_approval,
                        'REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION' => $report_cash_advance_detail_cost_classification,
                        'REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE' => $report_cash_advance_detail_amount_approve,
                        'REPORT_CASH_ADVANCE_DETAIL_REMARKS' => $report_cash_advance_detail_remarks
                    ]);
    
                    // Created Log CA Detail
                    user_log_create("Approve (Cash Advance Report Detail).", "Cash Advance Report", $report_cash_advance_detail_id);
                }
            }

            if ($userDivisionId !== 132 && $userDivisionId !== 122) {
                return $request->REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS;
            }
            
            if ($userDivisionId === 132) {
                return $request->REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS;
            }
            
            if ($userDivisionId === 122) {
                return $request->REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS;
            }
        });

        if ($cashAdvanceReportStatus === 2) {
            $alertText = "Cash Advance Report has been approved";
        } else if ($cashAdvanceReportStatus === 3) {
            $alertText = "Cash Advance Report needs to be revised";
        } else if ($cashAdvanceReportStatus === 4) {
            $alertText = "Cash Advance Report rejected";
        } else {
            $alertText = "Cash Advance Report status not found";
        }
        
        return new JsonResponse([
            $alertText
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_report_revised(Request $request)
    {
        DB::transaction(function () use ($request) {
            $cash_advance_detail_report = $request->cash_advance_detail_report;
    
            $user_id = Auth::user()->id;
    
            $report_cash_advance_id = $request->REPORT_CASH_ADVANCE_ID;
    
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
            $report_cash_advance_updated_date = now();
            $report_cash_advance_updated_by = $user_id;
    
            CashAdvanceReport::where('REPORT_CASH_ADVANCE_ID', $report_cash_advance_id)->update([
                'REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS' => $report_cash_advance_first_approval_status,
                'REPORT_CASH_ADVANCE_REQUEST_NOTE' => $report_cash_advance_request_note,
                'REPORT_CASH_ADVANCE_TYPE' => $type,
                'REPORT_CASH_ADVANCE_TOTAL_AMOUNT' => $report_cash_advance_total_amount,
                'REPORT_CASH_ADVANCE_TOTAL_AMOUNT_DIFFERENT' => $report_cash_advance_total_amount_different,
                'REPORT_CASH_ADVANCE_UPDATED_DATE' => $report_cash_advance_updated_date,
                'REPORT_CASH_ADVANCE_UPDATED_BY' => $report_cash_advance_updated_by
            ]);
    
            // Created Log CA
            user_log_create("Revised (Cash Advance Report).", "Cash Advance Report", $report_cash_advance_id);
    
            foreach ($cash_advance_detail_report as $cad) {
                $relation_organization_id = isset($cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID']) ? $cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID'] : null;
                $relation_name = isset($cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME']) ? $cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME'] : null;
                $relation_position = isset($cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION']) ? $cad['REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION'] : null;

                $report_cash_advance_detail_id = $cad['REPORT_CASH_ADVANCE_DETAIL_ID'];
                $report_cash_advance_detail_start_date = $cad['REPORT_CASH_ADVANCE_DETAIL_START_DATE'];
                $report_cash_advance_detail_end_date = $cad['REPORT_CASH_ADVANCE_DETAIL_END_DATE'];
                $report_cash_advance_detail_purpose = $cad['REPORT_CASH_ADVANCE_DETAIL_PURPOSE'];
                $report_cash_advance_detail_relation_organization_id = !empty($relation_organization_id) ? $relation_organization_id : null;
                $report_cash_advance_detail_relation_name = !empty($relation_name) ? $relation_name : null;
                $report_cash_advance_detail_relation_position = !empty($relation_position) ? $relation_position : null;
                $report_cash_advance_detail_location = $cad['REPORT_CASH_ADVANCE_DETAIL_LOCATION'];
                $report_cash_advance_detail_amount = $cad['REPORT_CASH_ADVANCE_DETAIL_AMOUNT'];
    
                $cashAdvanceDetailReport = CashAdvanceDetailReport::updateOrCreate(
                    [
                        'REPORT_CASH_ADVANCE_DETAIL_ID' => $report_cash_advance_detail_id
                    ],
                    [
                        'REPORT_CASH_ADVANCE_ID' => $report_cash_advance_id,
                        'REPORT_CASH_ADVANCE_DETAIL_START_DATE' => $report_cash_advance_detail_start_date,
                        'REPORT_CASH_ADVANCE_DETAIL_END_DATE' => $report_cash_advance_detail_end_date,
                        'REPORT_CASH_ADVANCE_DETAIL_PURPOSE' => $report_cash_advance_detail_purpose,
                        'REPORT_CASH_ADVANCE_DETAIL_LOCATION' => $report_cash_advance_detail_location,
                        'REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID' => $report_cash_advance_detail_relation_organization_id,
                        'REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME' => $report_cash_advance_detail_relation_name,
                        'REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION' => $report_cash_advance_detail_relation_position,
                        'REPORT_CASH_ADVANCE_DETAIL_AMOUNT' => $report_cash_advance_detail_amount
                    ]
                );
    
                $cashAdvanceDetailReportId = $cashAdvanceDetailReport->REPORT_CASH_ADVANCE_DETAIL_ID;
    
                // Upload file document
                $requestFile = $request->file('cash_advance_detail_report');
                
                if (is_array($requestFile) && !empty($requestFile)) {
                    if (isset($cad['filesDocument'])) {
                        foreach ($cad['filesDocument'] as $file) {
                            $uploadFile = $file['REPORT_CASH_ADVANCE_DETAIL_DOCUMENT'];
                            $parentDir = ((floor(($cashAdvanceDetailReportId) / 1000)) * 1000) . '/';
                            $CAId = $cashAdvanceDetailReportId . '/';
                            $typeDir = '';
                            $uploadPath = 'documents/' . 'CashAdvanceReport/'. $parentDir . $CAId . $typeDir;
            
                            $userId = Auth::user()->id;
            
                            $documentOriginalName =  replace_special_characters($uploadFile->getClientOriginalName());
                            $documentFileName =  $cashAdvanceDetailReportId . '-' . replace_special_characters($uploadFile->getClientOriginalName());
                            $documentDirName =  $uploadPath;
                            $documentFileType = $uploadFile->getMimeType();
                            $documentFileSize = $uploadFile->getSize();
            
                            Storage::makeDirectory($uploadPath, 0777, true, true);
                            Storage::disk('public')->putFileAs($uploadPath, $uploadFile, $cashAdvanceDetailReportId . '-' . replace_special_characters($uploadFile->getClientOriginalName()));
            
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
                                MCashAdvanceReportDocument::create([
                                    'CASH_ADVANCE_DOCUMENT_REPORT_CASH_ADVANCE_DETAIL_ID' => $cashAdvanceDetailReportId,
                                    'CASH_ADVANCE_DOCUMENT_REPORT_CASH_ADVANCE_DETAIL_DOCUMENT_ID' => $document,
                                    'CASH_ADVANCE_DOCUMENT_CREATED_DATE' => now(),
                                    'CASH_ADVANCE_DOCUMENT_CREATED_BY' => $userId,
                                ]);
                            }
                        }
                    }
                }
    
                // Delete row from table cash advance detail
                $deletedRows = $request->deletedRow;
                if($deletedRows) {
                    foreach ($deletedRows as $deletedRow) {
                        $cashAdvanceReportDetailId = $deletedRow['REPORT_CASH_ADVANCE_DETAIL_ID'];
    
                        $filePath = '/documents/CashAdvanceReport/0/' . $cashAdvanceReportDetailId;
    
                        // Delete data document from directory
                        if(Storage::disk('public')->exists($filePath)) {   
                            Storage::disk('public')->deleteDirectory($filePath);
                        }
    
                        // Delete row from table cash advance report detail
                        CashAdvanceDetailReport::destroy($cashAdvanceReportDetailId);
                    }
                }
    
                // Delete document
                $deletedDocuments = $request->deletedDocument;
                if ($deletedDocuments) {
                    foreach ($deletedDocuments as $document_value) {
                        // Get Data Document
                        $documentId = $document_value['DOCUMENT_ID'];
                        $cashAdvanceDetailReportId = $document_value['REPORT_CASH_ADVANCE_DETAIL_ID'];
    
                        $getDocument = Document::find($documentId);
    
                        $documentFilename = $cashAdvanceDetailReportId . '-' . $getDocument->DOCUMENT_ORIGINAL_NAME;
                        $documentDirname = $getDocument->DOCUMENT_DIRNAME;
                        
                        $filePath = '/'. $documentDirname . '/' . $documentFilename;
    
                        // Delete data document from directory
                        if(Storage::disk('public')->exists($filePath)) {   
                            Storage::disk('public')->delete($filePath);
                        } 
    
                        // Delete data from table m_cash_advance_document
                        MCashAdvanceReportDocument::where('CASH_ADVANCE_DOCUMENT_REPORT_CASH_ADVANCE_DETAIL_DOCUMENT_ID', $documentId)->delete();
    
                        // Delete data from table t_document
                        Document::destroy($documentId);
                    }
                }
    
                // Created Log CA Detail
                user_log_create("Revised (Cash Advance Report Detail).", "Cash Advance Report", $report_cash_advance_detail_id);
            }
        });
        
        return new JsonResponse([
            'Cash Advance Report has been revised.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function cash_advance_report_execute(Request $request)
    {
        DB::transaction(function () use ($request) {
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
    
                    $documentOriginalName =  replace_special_characters($uploadedFile->getClientOriginalName());
                    $documentFileName =  $report_cash_advance_id . '-' . replace_special_characters($uploadedFile->getClientOriginalName());
                    $documentDirName  =  $uploadPath;
                    $documentFileType = $uploadedFile->getMimeType();
                    $documentFileSize = $uploadedFile->getSize();
    
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $uploadedFile, $report_cash_advance_id . '-' . replace_special_characters($uploadedFile->getClientOriginalName()));
    
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
                        MCashAdvanceProofOfDocument::create([
                            'CASH_ADVANCE_PROOF_OF_DOCUMENT_REPORT_CASH_ADVANCE_ID' => $report_cash_advance_id,
                            'CASH_ADVANCE_PROOF_OF_DOCUMENT_REPORT_CASH_ADVANCE_DOCUMENT_ID' => $document,
                            'CASH_ADVANCE_PROOF_OF_DOCUMENT_CREATED_DATE' => now(),
                            'CASH_ADVANCE_PROOF_OF_DOCUMENT_CREATED_BY' => $userId,
                        ]);
                    }
                }
            }
    
            // Created Log CA Detail
            user_log_create("Execute (Cash Advance Report).", "Cash Advance Report", $report_cash_advance_id);
        });
        
        return new JsonResponse([
            'Cash Advance Report has been execute.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}