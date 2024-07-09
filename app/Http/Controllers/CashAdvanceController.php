<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\CashAdvanceDetail;
use App\Models\Document;
use App\Models\ReportCashAdvance;
use App\Models\ReportCashAdvanceDetail;
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
        $data = CashAdvance::orderBy('EXPENSES_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('EXPENSES_NUMBER')) {
                $data->where('EXPENSES_NUMBER', 'like', '%'.$searchQuery->EXPENSES_NUMBER.'%');
            }
        }

        return $data->paginate($dataPerPage);
    }

    public function getReportCAData($dataPerPage = 2, $searchQuery = null)
    {
        $data = CashAdvance::orderBy('EXPENSES_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('EXPENSES_NUMBER')) {
                $data->where('EXPENSES_NUMBER', 'like', '%'.$searchQuery->EXPENSES_NUMBER.'%');
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

    public function getCAById(string $id) 
    {
        $data = CashAdvance::findOrFail($id);
        return response()->json($data);
    }

    public function index() 
    {
        $data = [
            'users' => User::where('role_id', 2)->get()
        ];

        return Inertia::render('CA/CashAdvance', $data);
    }

    public function getCANumber()
    {
        $data = 
            CashAdvance::where('EXPENSES_TYPE', 1)
                            ->where('FIRST_APPROVAL_STATUS', 1)
                            ->orderBy('EXPENSES_ID', 'desc')
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

    public function getExpensesNumber($expenses_type)
    {
        if ($expenses_type == 1) {
            $code = 'CA/';
            $start_char = 10;
            $start_char_2 = 3;
        } else {
            $code = 'RMBS/';
            $start_char = 12;
            $start_char_2 = 5;
        }
        
        $year_month = date('Y/n').'/';

        $queries = DB::select('SELECT MAX(EXPENSES_NUMBER) AS max_number FROM t_cash_advance WHERE EXPENSES_TYPE = ?', [$expenses_type]);

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

        $expenses_number = $code . $year_month . $counting;

        return $expenses_number;
    }

    public function download($expenses_detail_id)
    {
        $CashAdvanceDetail = CashAdvanceDetail::find($expenses_detail_id);
        
        // $filePath = public_path('/storage/documents/CA/0/11/11-List-Asuransi--2-Unit-Dumptruck.pdf');
        $filePath = public_path('/storage/documents/CA/0/' . $expenses_detail_id . '/'. $CashAdvanceDetail->document->DOCUMENT_FILENAME);
        
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
        
        $total_pengajuan = 0;

        foreach ($request->CashAdvanceDetail as $value) {
            $total_pengajuan += $value['jumlah'];
        }
        
        $expenses_number = $this->getExpensesNumber(1);
        $expenses_type = 1;
        $used_by = $request->nama_pemohon;
        $expenses_requested_by = auth()->user()->id;
        $division = 'IT';
        $expenses_requested_date = now();
        $first_approval_by = $request->nama_pemberi_approval;
        $first_approval_status = 0;
        $expenses_request_note = $request->catatan;
        $delivery_method = $request->metode_pengiriman;
        $expenses_total_amount = $total_pengajuan;

        // Insert CA
        $cash_advance = CashAdvance::create([
            'EXPENSES_NUMBER' => $expenses_number,
            'EXPENSES_TYPE' => $expenses_type,
            'USED_BY' => $used_by,
            'EXPENSES_REQUESTED_BY' => $expenses_requested_by,
            'DIVISION' => $division,
            'EXPENSES_REQUESTED_DATE' => $expenses_requested_date,
            'FIRST_APPROVAL_BY' => $first_approval_by,
            'FIRST_APPROVAL_STATUS' => $first_approval_status,
            'EXPENSES_REQUEST_NOTE' => $expenses_request_note,
            'DELIVERY_METHOD' => $delivery_method,
            'EXPENSES_TOTAL_AMOUNT' => $expenses_total_amount
        ])->EXPENSES_ID;

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

        // Get new id data CA
        // $cash_advance = CashAdvance::orderBy('EXPENSES_ID', 'desc')->limit(1)->get('expenses_id');
        
        // foreach ($cash_advance as $ca) {
        //     $expenses_id = $ca['expenses_id'];
        // }

        foreach ($request->CashAdvanceDetail as $key => $cad) {
            $expenses_detail_start_date = $cad['tanggal_awal'];
            $expenses_detail_end_date = $cad['tanggal_akhir'];
            $expenses_detail_purpose = $cad['peruntukan'];
            $expenses_detail_location = $cad['tempat'];
            $relation_organization_id = $cad['perusahaan'];
            $expenses_detail_relation_name = $cad['nama'];
            $expenses_detail_relation_position = $cad['posisi'];
            $expenses_detail_amount = $cad['jumlah'];
            
            // Insert CA Detail
            $CashAdvanceDetail = CashAdvanceDetail::create([
                'EXPENSES_ID' => $cash_advance,
                'EXPENSES_DETAIL_START_DATE' => $expenses_detail_start_date,
                'EXPENSES_DETAIL_END_DATE' => $expenses_detail_end_date,
                'EXPENSES_DETAIL_PURPOSE' => $expenses_detail_purpose,
                'EXPENSES_DETAIL_LOCATION' => $expenses_detail_location,
                'RELATION_ORGANIZATION_ID' => $relation_organization_id,
                'EXPENSES_DETAIL_RELATION_NAME' => $expenses_detail_relation_name,
                'EXPENSES_DETAIL_RELATION_POSITION' => $expenses_detail_relation_position,
                'EXPENSES_DETAIL_AMOUNT' => $expenses_detail_amount
            ]);

            // Get data expenses detail id
            $expenses_detail_id = $CashAdvanceDetail->EXPENSES_DETAIL_ID;

            // Start process file upload
            $file = $request->file('CashAdvanceDetail');

            if ($file) {
                $parentDir = ((floor(($expenses_detail_id) / 1000)) * 1000) . '/';
                $CAId = $expenses_detail_id . '/';
                $typeDir = '';
                $uploadPath = 'documents/' . 'CA/'. $parentDir . $CAId . $typeDir;

                $userId = Auth::user()->id;
                $documentOriginalName =  $this->RemoveSpecialChar($file[$key]['dokumen']->getClientOriginalName());
                $documentFileName =  $expenses_detail_id . '-' . $this->RemoveSpecialChar($file[$key]['dokumen']->getClientOriginalName());
                $documentDirName =  $uploadPath;
                $documentFileType = $file[$key]['dokumen']->getMimeType();
                $documentFileSize = $file[$key]['dokumen']->getSize();

                Storage::makeDirectory($uploadPath, 0777, true, true);
                Storage::disk('public')->putFileAs($uploadPath, $file[$key]['dokumen'], $expenses_detail_id . '-' . $this->RemoveSpecialChar($file[$key]['dokumen']->getClientOriginalName()));

                $document = Document::create([
                    'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                    'DOCUMENT_FILENAME'               => $documentFileName,
                    'DOCUMENT_DIRNAME'                => $documentDirName,
                    'DOCUMENT_FILETYPE'               => $documentFileType,
                    'DOCUMENT_FILESIZE'               => $documentFileSize,
                    'DOCUMENT_CREATED_BY'             => $userId
                ])->DOCUMENT_ID;
                    
                if ($document) {
                    CashAdvanceDetail::where('EXPENSES_DETAIL_ID', $CashAdvanceDetail->EXPENSES_DETAIL_ID)
                    ->update([
                        'EXPENSES_DETAIL_DOCUMENT_ID' => $document
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
                    "id"          => $expenses_detail_id
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
        $expenses_id = $request->EXPENSES_ID;
        $expenses_updated_date = date('Y-m-d H:i:s');
        $first_approval_change_status_date = date('Y-m-d H:i:s');
        $first_approval_status = $request->FIRST_APPROVAL_STATUS;

        CashAdvance::where('EXPENSES_ID', $expenses_id)->update([
            'EXPENSES_UPDATED_DATE' => $expenses_updated_date,
            'FIRST_APPROVAL_CHANGE_STATUS_DATE' => $first_approval_change_status_date,
            'FIRST_APPROVAL_STATUS' => $first_approval_status
        ]);

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Approve (Cash Advance).",
                "module"      => "Cash Advance",
                "id"          => $expenses_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        foreach ($request->cash_advance_detail as $cad) {
            $expenses_detail_id = $cad['EXPENSES_DETAIL_ID'];
            $expenses_detail_status = $cad['EXPENSES_DETAIL_STATUS'];
            $expenses_detail_note = $cad['EXPENSES_DETAIL_NOTE'];

            CashAdvanceDetail::where('EXPENSES_DETAIL_ID', $expenses_detail_id)->update([
                'EXPENSES_DETAIL_STATUS' => $expenses_detail_status,
                'EXPENSES_DETAIL_NOTE' => $expenses_detail_note
            ]);

            // Created Log CA Detail
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Approve (Cash Advance Detail).",
                    "module"      => "Cash Advance",
                    "id"          => $expenses_detail_id
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
        
        $expenses_id = $request->EXPENSES_ID;

        $CountRequestDataById = sizeof($request->cash_advance_detail);
        $CountCashAdvanceDetail = CashAdvanceDetail::where('EXPENSES_ID', $expenses_id)->count();

        $total_pengajuan = 0;

        foreach ($request->cash_advance_detail as $value) {
            $total_pengajuan += $value['EXPENSES_DETAIL_AMOUNT'];
        }

        $expenses_total_amount = $total_pengajuan;
        $first_approval_status = 0;
        $expenses_request_note = $request->EXPENSES_REQUEST_NOTE;

        CashAdvance::where('EXPENSES_ID', $expenses_id)->update([
            'FIRST_APPROVAL_STATUS' => $first_approval_status,
            'EXPENSES_REQUEST_NOTE' => $expenses_request_note,
            'EXPENSES_TOTAL_AMOUNT' => $expenses_total_amount
        ]);

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Revised (Cash Advance).",
                "module"      => "Cash Advance",
                "id"          => $expenses_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        if ($CountRequestDataById === $CountCashAdvanceDetail) {
            foreach ($request->cash_advance_detail as $cad) {
                $expenses_detail_id = $cad['EXPENSES_DETAIL_ID'];
                $expenses_detail_date = $cad['EXPENSES_DETAIL_DATE'];
                $expenses_detail_purpose = $cad['EXPENSES_DETAIL_PURPOSE'];
                $expenses_detail_location = $cad['EXPENSES_DETAIL_LOCATION'];
                $relation_organization_id = $cad['RELATION_ORGANIZATION_ID'];
                $expenses_detail_relation_name = $cad['EXPENSES_DETAIL_RELATION_NAME'];
                $expenses_detail_relation_position = $cad['EXPENSES_DETAIL_RELATION_POSITION'];
                $expenses_detail_amount = $cad['EXPENSES_DETAIL_AMOUNT'];
                $expenses_detail_status = null;
                
                CashAdvanceDetail::where('EXPENSES_DETAIL_ID', $expenses_detail_id)->update([
                    'EXPENSES_DETAIL_DATE' => $expenses_detail_date,
                    'EXPENSES_DETAIL_PURPOSE' => $expenses_detail_purpose,
                    'EXPENSES_DETAIL_LOCATION' => $expenses_detail_location,
                    'RELATION_ORGANIZATION_ID' => $relation_organization_id,
                    'EXPENSES_DETAIL_RELATION_NAME' => $expenses_detail_relation_name,
                    'EXPENSES_DETAIL_RELATION_POSITION' => $expenses_detail_relation_position,
                    'EXPENSES_DETAIL_AMOUNT' => $expenses_detail_amount,
                    'EXPENSES_DETAIL_STATUS' => $expenses_detail_status
                ]);
    
                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Cash Advance Detail).",
                        "module"      => "Cash Advance",
                        "id"          => $expenses_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        } else {
            CashAdvanceDetail::where('EXPENSES_ID', $expenses_id)->delete();

            foreach ($request->cash_advance_detail as $cad) {
                $expenses_detail_id = $cad['EXPENSES_DETAIL_ID'];
                $expenses_detail_date = $cad['EXPENSES_DETAIL_DATE'];
                $expenses_detail_purpose = $cad['EXPENSES_DETAIL_PURPOSE'];
                $expenses_detail_location = $cad['EXPENSES_DETAIL_LOCATION'];
                $relation_organization_id = $cad['RELATION_ORGANIZATION_ID'];
                $expenses_detail_relation_name = $cad['EXPENSES_DETAIL_RELATION_NAME'];
                $expenses_detail_relation_position = $cad['EXPENSES_DETAIL_RELATION_POSITION'];
                $expenses_detail_amount = $cad['EXPENSES_DETAIL_AMOUNT'];
                
                CashAdvanceDetail::create([
                    'EXPENSES_ID' => $expenses_id,
                    'EXPENSES_DETAIL_DATE' => $expenses_detail_date,
                    'EXPENSES_DETAIL_PURPOSE' => $expenses_detail_purpose,
                    'EXPENSES_DETAIL_LOCATION' => $expenses_detail_location,
                    'RELATION_ORGANIZATION_ID' => $relation_organization_id,
                    'EXPENSES_DETAIL_RELATION_NAME' => $expenses_detail_relation_name,
                    'EXPENSES_DETAIL_RELATION_POSITION' => $expenses_detail_relation_position,
                    'EXPENSES_DETAIL_AMOUNT' => $expenses_detail_amount
                ]);
    
                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Cash Advance Detail).",
                        "module"      => "Cash Advance",
                        "id"          => $expenses_detail_id
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

    public function report_cash_advance(Request $request)
    {
        // dd($request->file('refund_proof'));
        
        $expenses_id = $request->expenses_number;
        $report_cash_advance_requested_by = $request->nama_pengguna;
        $report_cash_advance_requested_date = now();
        $first_approval_by = $request->nama_pemberi_approval;
        $first_approval_status = 0;
        $report_cash_advance_request_note = $request->catatan;
        $report_cash_advance_refund_type = $request->refund_type;
        $refund_proof = $request->file('refund_proof')[0];

        // Insert Report CA
        $report_cash_advance = ReportCashAdvance::create([
            'EXPENSES_ID' => $expenses_id,
            'REPORT_CASH_ADVANCE_REQUESTED_BY' => $report_cash_advance_requested_by,
            'REPORT_CASH_ADVANCE_REQUESTED_DATE' => $report_cash_advance_requested_date,
            'FIRST_APPROVAL_BY' => $first_approval_by,
            'FIRST_APPROVAL_STATUS' => $first_approval_status,
            'REPORT_CASH_ADVANCE_REQUEST_NOTE' => $report_cash_advance_request_note,
            'REPORT_CASH_ADVANCE_REFUND_TYPE' => $report_cash_advance_refund_type
        ])->REPORT_CASH_ADVANCE_ID;

        if($refund_proof) {
            $parentDir = ((floor(($report_cash_advance) / 1000)) * 1000) . '/';
            $CAId = $report_cash_advance . '/';
            $typeDir = '';
            $uploadPath = 'documents/' . 'Report CA/'. $parentDir . $CAId . $typeDir;

            $userId = Auth::user()->id;
            $documentOriginalName =  $this->RemoveSpecialChar($refund_proof->getClientOriginalName());
            $documentFileName =  $report_cash_advance . '-' . $this->RemoveSpecialChar($refund_proof->getClientOriginalName());
            $documentDirName =  $uploadPath;
            $documentFileType = $refund_proof->getMimeType();
            $documentFileSize = $refund_proof->getSize();

            Storage::makeDirectory($uploadPath, 0777, true, true);
            Storage::disk('public')->putFileAs($uploadPath, $refund_proof, $report_cash_advance . '-' . $this->RemoveSpecialChar($refund_proof->getClientOriginalName()));

            $document = Document::create([
                'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                'DOCUMENT_FILENAME'               => $documentFileName,
                'DOCUMENT_DIRNAME'                => $documentDirName,
                'DOCUMENT_FILETYPE'               => $documentFileType,
                'DOCUMENT_FILESIZE'               => $documentFileSize,
                'DOCUMENT_CREATED_BY'             => $userId
            ])->DOCUMENT_ID;
                
            if ($document) {
                ReportCashAdvance::where('REPORT_CASH_ADVANCE_ID', $report_cash_advance)
                ->update([
                    'REPORT_CASH_ADVANCE_REFUND_PROOF' => $document
                ]);
            }
        }

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
            $report_cash_advance_detail_date = $cad['tanggalKegiatan'];
            $report_cash_advance_detail_purpose = $cad['peruntukan'];
            $report_cash_advance_detail_location = $cad['tempat'];
            $relation_organization_id = $cad['perusahaan'];
            $report_cash_advance_detail_relation_name = $cad['nama'];
            $report_cash_advance_detail_relation_position = $cad['posisi'];
            $report_cash_advance_detail_amount = $cad['jumlah'];

            $report_cash_advance_detail = ReportCashAdvanceDetail::create([
                'REPORT_CASH_ADVANCE_ID' => $report_cash_advance,
                'REPORT_CASH_ADVANCE_DETAIL_DATE' => $report_cash_advance_detail_date,
                'REPORT_CASH_ADVANCE_DETAIL_PURPOSE' => $report_cash_advance_detail_purpose,
                'REPORT_CASH_ADVANCE_DETAIL_LOCATION' => $report_cash_advance_detail_location,
                'RELATION_ORGANIZATION_ID' => $relation_organization_id,
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

        return new JsonResponse([
            'New Report Cash Advance has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}