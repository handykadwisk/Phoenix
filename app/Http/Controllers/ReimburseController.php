<?php

namespace App\Http\Controllers;

use App\Models\Reimburse;
use App\Models\ReimburseDetail;
use App\Models\Document;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ReimburseController extends Controller
{
    public function getReimburseData($dataPerPage = 2, $searchQuery = null)
    {
        $data = Reimburse::orderBy('REIMBURSE_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('REIMBURSE_NUMBER')) {
                $data->where('REIMBURSE_NUMBER', 'like', '%'.$searchQuery->REIMBURSE_NUMBER.'%');
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

    // public function getReimburse()
    // {
    //     $data = $this->getReimburseData(10);
    //     return response()->json($data);
    // }

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

    public function index() 
    {
        $data = [
            'users' => User::where('role_id', 2)->get()
        ];

        return Inertia::render('Reimburse/Reimburse', $data);
    }

    public function getReimburseNumber()
    {
        $data = 
            Reimburse::where('REIMBURSE_FIRST_APPROVAL_STATUS', 1)
                        ->orderBy('REIMBURSE_ID', 'desc')
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

    public function getExpensesNumber()
    {
        // if ($reimburse_type == 1) {
        //     $code = 'CA/';
        //     $start_char = 10;
        //     $start_char_2 = 3;
        // } else {
        //     $code = 'RMBS/';
        //     $start_char = 12;
        //     $start_char_2 = 5;
        // }

            $code = 'RMBS/';
            $start_char = 12;
            $start_char_2 = 5;
        
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

    public function download($reimburse_detail_id)
    {
        $ReimburseDetail = ReimburseDetail::find($reimburse_detail_id);
        
        // $filePath = public_path('/storage/documents/CA/0/11/11-List-Asuransi--2-Unit-Dumptruck.pdf');
        $filePath = public_path('/storage/documents/CA/0/' . $reimburse_detail_id . '/'. $ReimburseDetail->document->DOCUMENT_FILENAME);
        
        $headers = [
            'filename' => $ReimburseDetail->document->DOCUMENT_FILENAME
        ];

        if (file_exists($filePath)) {
            return response()->download($filePath, $ReimburseDetail->document->DOCUMENT_FILENAME, $headers);
        } else {
            abort(404, 'File not found');
        }
    }

    public function store(Request $request)
    {
        // dd($request);

        $user_id = auth()->user()->id;
        
        $total_amount = 0;

        foreach ($request->ReimburseDetail as $value) {
            $total_amount += $value['reimburse_detail_amount'];
        }
        
        $reimburse_number = $this->getExpensesNumber();
        $reimburse_used_by = $request->reimburse_used_by;
        $reimburse_requested_by = $user_id;
        $reimburse_division = 'IT';
        $reimburse_requested_date = now();
        $reimburse_first_approval_by = $request->reimburse_first_approval_by;
        $reimburse_first_approval_status = 0;
        $reimburse_request_note = $request->reimburse_request_note;
        $reimburse_delivery_method_transfer = $request->reimburse_delivery_method_transfer;
        $reimburse_transfer_amount = $request->reimburse_transfer_amount;
        $reimburse_delivery_method_cash = $request->reimburse_delivery_method_cash;
        $reimburse_cash_amount = $request->reimburse_cash_amount;
        $reimburse_total_amount = $total_amount;
        $reimburse_created_at = now();
        $reimburse_created_by = $user_id;

        // Insert CA
        $reimburse = Reimburse::create([
            'REIMBURSE_NUMBER' => $reimburse_number,
            'REIMBURSE_USED_BY' => $reimburse_used_by,
            'REIMBURSE_REQUESTED_BY' => $reimburse_requested_by,
            'REIMBURSE_DIVISION' => $reimburse_division,
            'REIMBURSE_REQUESTED_DATE' => $reimburse_requested_date,
            'REIMBURSE_FIRST_APPROVAL_BY' => $reimburse_first_approval_by,
            'REIMBURSE_FIRST_APPROVAL_STATUS' => $reimburse_first_approval_status,
            'REIMBURSE_REQUEST_NOTE' => $reimburse_request_note,
            'REIMBURSE_DELIVERY_METHOD_TRANSFER' => $reimburse_delivery_method_transfer,
            'REIMBURSE_TRANSFER_AMOUNT' => $reimburse_transfer_amount,
            'REIMBURSE_DELIVERY_METHOD_CASH' => $reimburse_delivery_method_cash,
            'REIMBURSE_CASH_AMOUNT' => $reimburse_cash_amount,
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

        foreach ($request->ReimburseDetail as $key => $cad) {
            $reimburse_detail_date = $cad['reimburse_detail_date'];
            $reimburse_detail_purpose = $cad['reimburse_detail_purpose'];
            $reimburse_detail_location = $cad['reimburse_detail_location'];
            $reimburse_detail_relation_organization_id = $cad['reimburse_detail_relation_organization_id'];
            $reimburse_detail_relation_name = $cad['reimburse_detail_relation_name'];
            $reimburse_detail_relation_position = $cad['reimburse_detail_relation_position'];
            $reimburse_detail_amount = $cad['reimburse_detail_amount'];
            
            // Insert CA Detail
            $ReimburseDetail = ReimburseDetail::create([
                'REIMBURSE_ID' => $reimburse,
                'REIMBURSE_DETAIL_DATE' => $reimburse_detail_date,
                'REIMBURSE_DETAIL_PURPOSE' => $reimburse_detail_purpose,
                'REIMBURSE_DETAIL_LOCATION' => $reimburse_detail_location,
                'REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID' => $reimburse_detail_relation_organization_id,
                'REIMBURSE_DETAIL_RELATION_NAME' => $reimburse_detail_relation_name,
                'REIMBURSE_DETAIL_RELATION_POSITION' => $reimburse_detail_relation_position,
                'REIMBURSE_DETAIL_AMOUNT' => $reimburse_detail_amount
            ]);

            // Get data expenses detail id
            $reimburse_detail_id = $ReimburseDetail->REIMBURSE_DETAIL_ID;

            // Start process file upload
            $file = $request->file('ReimburseDetail');

            if ($file) {
                $parentDir = ((floor(($reimburse_detail_id) / 1000)) * 1000) . '/';
                $CAId = $reimburse_detail_id . '/';
                $typeDir = '';
                $uploadPath = 'documents/' . 'Reimburse/'. $parentDir . $CAId . $typeDir;

                $userId = Auth::user()->id;
                $documentOriginalName =  $this->RemoveSpecialChar($file[$key]['reimburse_detail_document_id']->getClientOriginalName());
                $documentFileName =  $reimburse_detail_id . '-' . $this->RemoveSpecialChar($file[$key]['reimburse_detail_document_id']->getClientOriginalName());
                $documentDirName =  $uploadPath;
                $documentFileType = $file[$key]['reimburse_detail_document_id']->getMimeType();
                $documentFileSize = $file[$key]['reimburse_detail_document_id']->getSize();

                Storage::makeDirectory($uploadPath, 0777, true, true);
                Storage::disk('public')->putFileAs($uploadPath, $file[$key]['reimburse_detail_document_id'], $reimburse_detail_id . '-' . $this->RemoveSpecialChar($file[$key]['reimburse_detail_document_id']->getClientOriginalName()));

                $document = Document::create([
                    'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                    'DOCUMENT_FILENAME'               => $documentFileName,
                    'DOCUMENT_DIRNAME'                => $documentDirName,
                    'DOCUMENT_FILETYPE'               => $documentFileType,
                    'DOCUMENT_FILESIZE'               => $documentFileSize,
                    'DOCUMENT_CREATED_BY'             => $userId
                ])->DOCUMENT_ID;
                    
                if ($document) {
                    ReimburseDetail::where('REIMBURSE_DETAIL_ID', $ReimburseDetail->REIMBURSE_DETAIL_ID)
                    ->update([
                        'REIMBURSE_DETAIL_DOCUMENT_ID' => $document
                    ]);
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
    }

    public function approve(Request $request)
    {
        $reimburse_id = $request->REIMBURSE_ID;
        $reimburse_first_approval_change_status_date = date('Y-m-d H:i:s');
        $reimburse_first_approval_status = $request->REIMBURSE_FIRST_APPROVAL_STATUS;

        Reimburse::where('REIMBURSE_ID', $reimburse_id)->update([
            'REIMBURSE_FIRST_APPROVAL_CHANGE_STATUS_DATE' => $reimburse_first_approval_change_status_date,
            'REIMBURSE_FIRST_APPROVAL_STATUS' => $reimburse_first_approval_status
        ]);

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

        foreach ($request->reimburse_detail as $cad) {
            $reimburse_detail_id = $cad['REIMBURSE_DETAIL_ID'];
            $reimburse_detail_status = $cad['REIMBURSE_DETAIL_STATUS'];
            $reimburse_detail_note = $cad['REIMBURSE_DETAIL_NOTE'];

            ReimburseDetail::where('REIMBURSE_DETAIL_ID', $reimburse_detail_id)->update([
                'REIMBURSE_DETAIL_STATUS' => $reimburse_detail_status,
                'REIMBURSE_DETAIL_NOTE' => $reimburse_detail_note
            ]);

            // Created Log CA Detail
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Approve (Reimburse Detail).",
                    "module"      => "Reimburse",
                    "id"          => $reimburse_detail_id
                ]),
                'action_by'  => Auth::user()->email
            ]);
        }

        return new JsonResponse([
            'Reimburse has been approved.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function revised(Request $request)
    {
        // dd($request);

        $user_id = auth()->user()->id;
        
        $reimburse_id = $request->REIMBURSE_ID;

        $CountRequestDataById = sizeof($request->reimburse_detail);
        $CountReimburseDetail = ReimburseDetail::where('REIMBURSE_ID', $reimburse_id)->count();

        $total_amount = 0;

        foreach ($request->reimburse_detail as $value) {
            $total_amount += $value['REIMBURSE_DETAIL_AMOUNT'];
        }

        $reimburse_total_amount = $total_amount;
        $reimburse_first_approval_status = 0;
        $reimburse_request_note = $request->REIMBURSE_REQUEST_NOTE;
        $reimburse_delivery_method_transfer = $request->REIMBURSE_DELIVERY_METHOD_TRANSFER;
        $reimburse_transfer_amount = $request->REIMBURSE_TRANSFER_AMOUNT;
        $reimburse_delivery_method_cash = $request->REIMBURSE_DELIVERY_METHOD_CASH;
        $reimburse_cash_amount = $request->REIMBURSE_CASH_AMOUNT;
        $reimburse_updated_at = now();
        $reimburse_updated_by = $user_id;

        Reimburse::where('REIMBURSE_ID', $reimburse_id)->update([
            'REIMBURSE_FIRST_APPROVAL_STATUS' => $reimburse_first_approval_status,
            'REIMBURSE_REQUEST_NOTE' => $reimburse_request_note,
            // 'REIMBURSE_DELIVERY_METHOD_TRANSFER' => $reimburse_delivery_method_transfer,
            // 'REIMBURSE_TRANSFER_AMOUNT' => $reimburse_transfer_amount,
            // 'REIMBURSE_DELIVERY_METHOD_CASH' => $reimburse_delivery_method_cash,
            // 'REIMBURSE_CASH_AMOUNT' => $reimburse_cash_amount,
            'REIMBURSE_TOTAL_AMOUNT' => $reimburse_total_amount,
            'REIMBURSE_UPDATED_AT' => $reimburse_updated_at,
            'REIMBURSE_UPDATED_BY' => $reimburse_updated_by
        ]);

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Revised (Reimburse).",
                "module"      => "Reimburse",
                "id"          => $reimburse_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        if ($CountRequestDataById === $CountReimburseDetail) {
            foreach ($request->reimburse_detail as $cad) {
                $reimburse_detail_id = $cad['REIMBURSE_DETAIL_ID'];
                $reimburse_detail_date = $cad['REIMBURSE_DETAIL_DATE'];
                $reimburse_detail_purpose = $cad['REIMBURSE_DETAIL_PURPOSE'];
                $reimburse_detail_location = $cad['REIMBURSE_DETAIL_LOCATION'];
                $reimburse_detail_relation_organization_id = $cad['REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID'];
                $reimburse_detail_relation_name = $cad['REIMBURSE_DETAIL_RELATION_NAME'];
                $reimburse_detail_relation_position = $cad['REIMBURSE_DETAIL_RELATION_POSITION'];
                $reimburse_detail_amount = $cad['REIMBURSE_DETAIL_AMOUNT'];
                $reimburse_detail_status = null;
                
                ReimburseDetail::where('REIMBURSE_DETAIL_ID', $reimburse_detail_id)->update([
                    'REIMBURSE_DETAIL_DATE' => $reimburse_detail_date,
                    'REIMBURSE_DETAIL_PURPOSE' => $reimburse_detail_purpose,
                    'REIMBURSE_DETAIL_LOCATION' => $reimburse_detail_location,
                    'REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID' => $reimburse_detail_relation_organization_id,
                    'REIMBURSE_DETAIL_RELATION_NAME' => $reimburse_detail_relation_name,
                    'REIMBURSE_DETAIL_RELATION_POSITION' => $reimburse_detail_relation_position,
                    'REIMBURSE_DETAIL_AMOUNT' => $reimburse_detail_amount,
                    'REIMBURSE_DETAIL_STATUS' => $reimburse_detail_status
                ]);
    
                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Reimburse Detail).",
                        "module"      => "Reimburse",
                        "id"          => $reimburse_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        } else {
            ReimburseDetail::where('REIMBURSE_ID', $reimburse_id)->delete();

            foreach ($request->reimburse_detail as $cad) {
                $reimburse_detail_id = $cad['REIMBURSE_DETAIL_ID'];
                $reimburse_detail_date = $cad['REIMBURSE_DETAIL_DATE'];
                $reimburse_detail_end_date = $cad['REIMBURSE_DETAIL_END_DATE'];
                $reimburse_detail_purpose = $cad['REIMBURSE_DETAIL_PURPOSE'];
                $reimburse_detail_location = $cad['REIMBURSE_DETAIL_LOCATION'];
                $reimburse_detail_relation_organization_id = $cad['RELATION_ORGANIZATION_ID'];
                $reimburse_detail_relation_name = $cad['REIMBURSE_DETAIL_RELATION_NAME'];
                $reimburse_detail_relation_position = $cad['REIMBURSE_DETAIL_RELATION_POSITION'];
                $reimburse_detail_amount = $cad['REIMBURSE_DETAIL_AMOUNT'];
                
                ReimburseDetail::create([
                    'REIMBURSE_ID' => $reimburse_id,
                    'REIMBURSE_DETAIL_DATE' => $reimburse_detail_date,
                    'REIMBURSE_DETAIL_PURPOSE' => $reimburse_detail_purpose,
                    'REIMBURSE_DETAIL_LOCATION' => $reimburse_detail_location,
                    'REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID' => $reimburse_detail_relation_organization_id,
                    'REIMBURSE_DETAIL_RELATION_NAME' => $reimburse_detail_relation_name,
                    'REIMBURSE_DETAIL_RELATION_POSITION' => $reimburse_detail_relation_position,
                    'REIMBURSE_DETAIL_AMOUNT' => $reimburse_detail_amount
                ]);
    
                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Reimburse Detail).",
                        "module"      => "Reimburse",
                        "id"          => $reimburse_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        }

        return new JsonResponse([
            'Reimburse has been revised.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    // public function report_cash_advance(Request $request)
    // {
    //     $user_id = auth()->user()->id;
        
    //     $report_reimburse_id = $request->reimburse_number;
    //     $report_reimburse_requested_by = $user_id;
    //     $report_reimburse_requested_date = now();
    //     $report_reimburse_first_approval_by = $request->reimburse_first_approval_by;
    //     $report_reimburse_first_approval_status = 0;
    //     $report_reimburse_request_note = $request->reimburse_request_note;
    //     $report_reimburse_refund_type = $request->refund_type;
    //     $report_refund_proof = $request->file('refund_proof')[0];

    //     // Insert Report CA
    //     $report_cash_advance = ReportReimburse::create([
    //         'REPORT_REIMBURSE_ID' => $report_reimburse_id,
    //         'REPORT_REIMBURSE_REQUESTED_BY' => $report_reimburse_requested_by,
    //         'REPORT_REIMBURSE_REQUESTED_DATE' => $report_reimburse_requested_date,
    //         'REPORT_REIMBURSE_FIRST_APPROVAL_BY' => $report_reimburse_first_approval_by,
    //         'REPORT_REIMBURSE_FIRST_APPROVAL_STATUS' => $report_reimburse_first_approval_status,
    //         'REPORT_REIMBURSE_REQUEST_NOTE' => $report_reimburse_request_note,
    //         'REPORT_REIMBURSE_REFUND_TYPE' => $report_reimburse_refund_type
    //     ])->REPORT_REIMBURSE_ID;

    //     if($report_refund_proof) {
    //         $parentDir = ((floor(($report_cash_advance) / 1000)) * 1000) . '/';
    //         $CAId = $report_cash_advance . '/';
    //         $typeDir = '';
    //         $uploadPath = 'documents/' . 'Report CA/'. $parentDir . $CAId . $typeDir;

    //         $userId = Auth::user()->id;
    //         $documentOriginalName =  $this->RemoveSpecialChar($report_refund_proof->getClientOriginalName());
    //         $documentFileName =  $report_cash_advance . '-' . $this->RemoveSpecialChar($report_refund_proof->getClientOriginalName());
    //         $documentDirName =  $uploadPath;
    //         $documentFileType = $report_refund_proof->getMimeType();
    //         $documentFileSize = $report_refund_proof->getSize();

    //         Storage::makeDirectory($uploadPath, 0777, true, true);
    //         Storage::disk('public')->putFileAs($uploadPath, $report_refund_proof, $report_cash_advance . '-' . $this->RemoveSpecialChar($report_refund_proof->getClientOriginalName()));

    //         $document = Document::create([
    //             'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
    //             'DOCUMENT_FILENAME'               => $documentFileName,
    //             'DOCUMENT_DIRNAME'                => $documentDirName,
    //             'DOCUMENT_FILETYPE'               => $documentFileType,
    //             'DOCUMENT_FILESIZE'               => $documentFileSize,
    //             'DOCUMENT_CREATED_BY'             => $userId
    //         ])->DOCUMENT_ID;
                
    //         if ($document) {
    //             ReportReimburse::where('REPORT_REIMBURSE_ID', $report_cash_advance)
    //             ->update([
    //                 'REPORT_REIMBURSE_REFUND_PROOF' => $document
    //             ]);
    //         }
    //     }

    //     // Created Log Report CA
    //     UserLog::create([
    //         'created_by' => Auth::user()->id,
    //         'action'     => json_encode([
    //             "description" => "Created (Report Reimburse).",
    //             "module"      => "Report Reimburse",
    //             "id"          => $report_cash_advance
    //         ]),
    //         'action_by'  => Auth::user()->email
    //     ]);

    //     foreach ($request->ReimburseDetail as $key => $cad) {
    //         $report_reimburse_detail_date = $cad['reimburse_detail_date'];
    //         $report_reimburse_detail_end_date = $cad['reimburse_detail_end_date'];
    //         $report_reimburse_detail_purpose = $cad['reimburse_detail_purpose'];
    //         $report_reimburse_detail_location = $cad['reimburse_detail_location'];
    //         $reimburse_detail_relation_organization_id = $cad['reimburse_detail_relation_organization_id'];
    //         $report_reimburse_detail_relation_name = $cad['reimburse_detail_relation_name'];
    //         $report_reimburse_detail_relation_position = $cad['reimburse_detail_start_relation_position'];
    //         $report_reimburse_detail_amount = $cad['reimburse_detail_amount'];

    //         $report_reimburse_detail = ReportReimburseDetail::create([
    //             'REPORT_REIMBURSE_ID' => $report_cash_advance,
    //             'REPORT_REIMBURSE_DETAIL_START_DATE' => $report_reimburse_detail_date,
    //             'REPORT_REIMBURSE_DETAIL_END_DATE' => $report_reimburse_detail_end_date,
    //             'REPORT_REIMBURSE_DETAIL_PURPOSE' => $report_reimburse_detail_purpose,
    //             'REPORT_REIMBURSE_DETAIL_LOCATION' => $report_reimburse_detail_location,
    //             'REPORT_REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID' => $reimburse_detail_relation_organization_id,
    //             'REPORT_REIMBURSE_DETAIL_RELATION_NAME' => $report_reimburse_detail_relation_name,
    //             'REPORT_REIMBURSE_DETAIL_RELATION_POSITION' => $report_reimburse_detail_relation_position,
    //             'REPORT_REIMBURSE_DETAIL_AMOUNT' => $report_reimburse_detail_amount
    //         ])->REPORT_REIMBURSE_DETAIL_ID;

    //         // Created Log Report CA Detail
    //         UserLog::create([
    //             'created_by' => Auth::user()->id,
    //             'action'     => json_encode([
    //                 "description" => "Created (Report Reimburse Detail).",
    //                 "module"      => "Report Reimburse Detail",
    //                 "id"          => $report_reimburse_detail
    //             ]),
    //             'action_by'  => Auth::user()->email
    //         ]);
    //     }

    //     return new JsonResponse([
    //         'New Report Reimburse has been added.'
    //     ], 201, [
    //         'X-Inertia' => true
    //     ]);
    // }
}