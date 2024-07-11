<?php

namespace App\Http\Controllers;

use App\Models\OtherExpenses;
use App\Models\OtherExpensesDetail;
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

class OtherExpensesController extends Controller
{
    public function getOtherExpensesData($dataPerPage = 2, $searchQuery = null)
    {
        $data = OtherExpenses::orderBy('OTHER_EXPENSES_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('OTHER_EXPENSES_NUMBER')) {
                $data->where('OTHER_EXPENSES_NUMBER', 'like', '%'.$searchQuery->OTHER_EXPENSES_NUMBER.'%');
            }
        }

        return $data->paginate($dataPerPage);
    }

    public function getReportCAData($dataPerPage = 2, $searchQuery = null)
    {
        $data = OtherExpenses::orderBy('OTHER_EXPENSES_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('OTHER_EXPENSES_NUMBER')) {
                $data->where('OTHER_EXPENSES_NUMBER', 'like', '%'.$searchQuery->OTHER_EXPENSES_NUMBER.'%');
            }
        }

        return $data->paginate($dataPerPage);
    }

    // public function getOtherExpenses()
    // {
    //     $data = $this->getOtherExpensesData(10);
    //     return response()->json($data);
    // }

    public function getOtherExpenses(Request $request)
    {
        $data = $this->getOtherExpensesData(10, $request);
        return response()->json($data);
    }

    public function getOtherExpensesById(string $id) 
    {
        $data = OtherExpenses::findOrFail($id);
        return response()->json($data);
    }

    public function index() 
    {
        $data = [
            'users' => User::where('role_id', 2)->get()
        ];

        return Inertia::render('OtherExpenses/OtherExpenses', $data);
    }

    public function getOtherExpensesNumber()
    {
        $data = 
            OtherExpenses::where('OTHER_EXPENSES_FIRST_APPROVAL_STATUS', 1)
                        ->orderBy('OTHER_EXPENSES_ID', 'desc')
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
        // if ($other_expenses_type == 1) {
        //     $code = 'CA/';
        //     $start_char = 10;
        //     $start_char_2 = 3;
        // } else {
        //     $code = 'RMBS/';
        //     $start_char = 12;
        //     $start_char_2 = 5;
        // }

            $code = 'OE/';
            $start_char = 10;
            $start_char_2 = 3;
        
        $year_month = date('Y/n').'/';

        $queries = DB::select('SELECT MAX(OTHER_EXPENSES_NUMBER) AS max_number FROM t_other_expenses');

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

        $other_expenses_number = $code . $year_month . $counting;

        return $other_expenses_number;
    }

    public function download($other_expenses_detail_id)
    {
        $OtherExpensesDetail = OtherExpensesDetail::find($other_expenses_detail_id);
        
        // $filePath = public_path('/storage/documents/CA/0/11/11-List-Asuransi--2-Unit-Dumptruck.pdf');
        $filePath = public_path('/storage/documents/CA/0/' . $other_expenses_detail_id . '/'. $OtherExpensesDetail->document->DOCUMENT_FILENAME);
        
        $headers = [
            'filename' => $OtherExpensesDetail->document->DOCUMENT_FILENAME
        ];

        if (file_exists($filePath)) {
            return response()->download($filePath, $OtherExpensesDetail->document->DOCUMENT_FILENAME, $headers);
        } else {
            abort(404, 'File not found');
        }
    }

    public function store(Request $request)
    {
        // dd($request);

        $user_id = auth()->user()->id;
        
        $total_amount = 0;

        foreach ($request->OtherExpensesDetail as $value) {
            $total_amount += $value['other_expenses_detail_amount'];
        }
        
        $other_expenses_number = $this->getExpensesNumber();
        $other_expenses_used_by = $request->other_expenses_used_by;
        $other_expenses_requested_by = $user_id;
        $other_expenses_division = 'IT';
        $other_expenses_requested_date = now();
        $other_expenses_first_approval_by = $request->other_expenses_first_approval_by;
        $other_expenses_first_approval_status = 0;
        $other_expenses_request_note = $request->other_expenses_request_note;
        $other_expenses_delivery_method_transfer = $request->other_expenses_delivery_method_transfer;
        $other_expenses_transfer_amount = $request->other_expenses_transfer_amount;
        $other_expenses_delivery_method_cash = $request->other_expenses_delivery_method_cash;
        $other_expenses_cash_amount = $request->other_expenses_cash_amount;
        $other_expenses_total_amount = $total_amount;
        $other_expenses_created_at = now();
        $other_expenses_created_by = $user_id;

        // Insert CA
        $other_expenses = OtherExpenses::create([
            'OTHER_EXPENSES_NUMBER' => $other_expenses_number,
            'OTHER_EXPENSES_USED_BY' => $other_expenses_used_by,
            'OTHER_EXPENSES_REQUESTED_BY' => $other_expenses_requested_by,
            'OTHER_EXPENSES_DIVISION' => $other_expenses_division,
            'OTHER_EXPENSES_REQUESTED_DATE' => $other_expenses_requested_date,
            'OTHER_EXPENSES_FIRST_APPROVAL_BY' => $other_expenses_first_approval_by,
            'OTHER_EXPENSES_FIRST_APPROVAL_STATUS' => $other_expenses_first_approval_status,
            'OTHER_EXPENSES_REQUEST_NOTE' => $other_expenses_request_note,
            'OTHER_EXPENSES_DELIVERY_METHOD_TRANSFER' => $other_expenses_delivery_method_transfer,
            'OTHER_EXPENSES_TRANSFER_AMOUNT' => $other_expenses_transfer_amount,
            'OTHER_EXPENSES_DELIVERY_METHOD_CASH' => $other_expenses_delivery_method_cash,
            'OTHER_EXPENSES_CASH_AMOUNT' => $other_expenses_cash_amount,
            'OTHER_EXPENSES_TOTAL_AMOUNT' => $other_expenses_total_amount,
            'OTHER_EXPENSES_CREATED_AT' => $other_expenses_created_at,
            'OTHER_EXPENSES_CREATED_BY' => $other_expenses_created_by
        ])->OTHER_EXPENSES_ID;

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Other Expenses).",
                "module"      => "Other Expenses",
                "id"          => $other_expenses
            ]),
            'action_by'  => Auth::user()->email
        ]);

        foreach ($request->OtherExpensesDetail as $key => $cad) {
            $other_expenses_detail_date = $cad['other_expenses_detail_date'];
            $other_expenses_detail_purpose = $cad['other_expenses_detail_purpose'];
            $other_expenses_detail_location = $cad['other_expenses_detail_location'];
            $other_expenses_detail_relation_organization_id = $cad['other_expenses_detail_relation_organization_id'];
            $other_expenses_detail_relation_name = $cad['other_expenses_detail_relation_name'];
            $other_expenses_detail_relation_position = $cad['other_expenses_detail_relation_position'];
            $other_expenses_detail_amount = $cad['other_expenses_detail_amount'];
            
            // Insert CA Detail
            $OtherExpensesDetail = OtherExpensesDetail::create([
                'OTHER_EXPENSES_ID' => $other_expenses,
                'OTHER_EXPENSES_DETAIL_DATE' => $other_expenses_detail_date,
                'OTHER_EXPENSES_DETAIL_PURPOSE' => $other_expenses_detail_purpose,
                'OTHER_EXPENSES_DETAIL_LOCATION' => $other_expenses_detail_location,
                'OTHER_EXPENSES_DETAIL_RELATION_ORGANIZATION_ID' => $other_expenses_detail_relation_organization_id,
                'OTHER_EXPENSES_DETAIL_RELATION_NAME' => $other_expenses_detail_relation_name,
                'OTHER_EXPENSES_DETAIL_RELATION_POSITION' => $other_expenses_detail_relation_position,
                'OTHER_EXPENSES_DETAIL_AMOUNT' => $other_expenses_detail_amount
            ]);

            // Get data expenses detail id
            $other_expenses_detail_id = $OtherExpensesDetail->OTHER_EXPENSES_DETAIL_ID;

            // Start process file upload
            $file = $request->file('OtherExpensesDetail');

            if ($file) {
                $parentDir = ((floor(($other_expenses_detail_id) / 1000)) * 1000) . '/';
                $CAId = $other_expenses_detail_id . '/';
                $typeDir = '';
                $uploadPath = 'documents/' . 'CA/'. $parentDir . $CAId . $typeDir;

                $userId = Auth::user()->id;
                $documentOriginalName =  $this->RemoveSpecialChar($file[$key]['other_expenses_detail_document_id']->getClientOriginalName());
                $documentFileName =  $other_expenses_detail_id . '-' . $this->RemoveSpecialChar($file[$key]['other_expenses_detail_document_id']->getClientOriginalName());
                $documentDirName =  $uploadPath;
                $documentFileType = $file[$key]['other_expenses_detail_document_id']->getMimeType();
                $documentFileSize = $file[$key]['other_expenses_detail_document_id']->getSize();

                Storage::makeDirectory($uploadPath, 0777, true, true);
                Storage::disk('public')->putFileAs($uploadPath, $file[$key]['other_expenses_detail_document_id'], $other_expenses_detail_id . '-' . $this->RemoveSpecialChar($file[$key]['other_expenses_detail_document_id']->getClientOriginalName()));

                $document = Document::create([
                    'DOCUMENT_ORIGINAL_NAME'          => $documentOriginalName,
                    'DOCUMENT_FILENAME'               => $documentFileName,
                    'DOCUMENT_DIRNAME'                => $documentDirName,
                    'DOCUMENT_FILETYPE'               => $documentFileType,
                    'DOCUMENT_FILESIZE'               => $documentFileSize,
                    'DOCUMENT_CREATED_BY'             => $userId
                ])->DOCUMENT_ID;
                    
                if ($document) {
                    OtherExpensesDetail::where('OTHER_EXPENSES_DETAIL_ID', $OtherExpensesDetail->OTHER_EXPENSES_DETAIL_ID)
                    ->update([
                        'OTHER_EXPENSES_DETAIL_DOCUMENT_ID' => $document
                    ]);
                }
            }
            // End process file upload

            // Created Log CA Detail
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Created (Other Expenses Detail).",
                    "module"      => "Other Expenses",
                    "id"          => $other_expenses_detail_id
                ]),
                'action_by'  => Auth::user()->email
            ]);
        }

        return new JsonResponse([
            'New Other Expenses has been added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function approve(Request $request)
    {
        $other_expenses_id = $request->OTHER_EXPENSES_ID;
        $other_expenses_first_approval_change_status_date = date('Y-m-d H:i:s');
        $other_expenses_first_approval_status = $request->OTHER_EXPENSES_FIRST_APPROVAL_STATUS;

        OtherExpenses::where('OTHER_EXPENSES_ID', $other_expenses_id)->update([
            'OTHER_EXPENSES_FIRST_APPROVAL_CHANGE_STATUS_DATE' => $other_expenses_first_approval_change_status_date,
            'OTHER_EXPENSES_FIRST_APPROVAL_STATUS' => $other_expenses_first_approval_status
        ]);

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Approve (Other Expenses).",
                "module"      => "Other Expenses",
                "id"          => $other_expenses_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        foreach ($request->other_expenses_detail as $cad) {
            $other_expenses_detail_id = $cad['OTHER_EXPENSES_DETAIL_ID'];
            $other_expenses_detail_status = $cad['OTHER_EXPENSES_DETAIL_STATUS'];
            $other_expenses_detail_note = $cad['OTHER_EXPENSES_DETAIL_NOTE'];

            OtherExpensesDetail::where('OTHER_EXPENSES_DETAIL_ID', $other_expenses_detail_id)->update([
                'OTHER_EXPENSES_DETAIL_STATUS' => $other_expenses_detail_status,
                'OTHER_EXPENSES_DETAIL_NOTE' => $other_expenses_detail_note
            ]);

            // Created Log CA Detail
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Approve (Other Expenses Detail).",
                    "module"      => "Other Expenses",
                    "id"          => $other_expenses_detail_id
                ]),
                'action_by'  => Auth::user()->email
            ]);
        }

        return new JsonResponse([
            'Other Expenses has been approved.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function revised(Request $request)
    {
        // dd($request);

        $user_id = auth()->user()->id;
        
        $other_expenses_id = $request->OTHER_EXPENSES_ID;

        $CountRequestDataById = sizeof($request->other_expenses_detail);
        $CountOtherExpensesDetail = OtherExpensesDetail::where('OTHER_EXPENSES_ID', $other_expenses_id)->count();

        $total_amount = 0;

        foreach ($request->other_expenses_detail as $value) {
            $total_amount += $value['OTHER_EXPENSES_DETAIL_AMOUNT'];
        }

        $other_expenses_total_amount = $total_amount;
        $other_expenses_first_approval_status = 0;
        $other_expenses_request_note = $request->OTHER_EXPENSES_REQUEST_NOTE;
        $other_expenses_delivery_method_transfer = $request->OTHER_EXPENSES_DELIVERY_METHOD_TRANSFER;
        $other_expenses_transfer_amount = $request->OTHER_EXPENSES_TRANSFER_AMOUNT;
        $other_expenses_delivery_method_cash = $request->OTHER_EXPENSES_DELIVERY_METHOD_CASH;
        $other_expenses_cash_amount = $request->OTHER_EXPENSES_CASH_AMOUNT;
        $other_expenses_updated_at = now();
        $other_expenses_updated_by = $user_id;

        OtherExpenses::where('OTHER_EXPENSES_ID', $other_expenses_id)->update([
            'OTHER_EXPENSES_FIRST_APPROVAL_STATUS' => $other_expenses_first_approval_status,
            'OTHER_EXPENSES_REQUEST_NOTE' => $other_expenses_request_note,
            // 'OTHER_EXPENSES_DELIVERY_METHOD_TRANSFER' => $other_expenses_delivery_method_transfer,
            // 'OTHER_EXPENSES_TRANSFER_AMOUNT' => $other_expenses_transfer_amount,
            // 'OTHER_EXPENSES_DELIVERY_METHOD_CASH' => $other_expenses_delivery_method_cash,
            // 'OTHER_EXPENSES_CASH_AMOUNT' => $other_expenses_cash_amount,
            'OTHER_EXPENSES_TOTAL_AMOUNT' => $other_expenses_total_amount,
            'OTHER_EXPENSES_UPDATED_AT' => $other_expenses_updated_at,
            'OTHER_EXPENSES_UPDATED_BY' => $other_expenses_updated_by
        ]);

        // Created Log CA
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Revised (Other Expenses).",
                "module"      => "Other Expenses",
                "id"          => $other_expenses_id
            ]),
            'action_by'  => Auth::user()->email
        ]);

        if ($CountRequestDataById === $CountOtherExpensesDetail) {
            foreach ($request->other_expenses_detail as $cad) {
                $other_expenses_detail_id = $cad['OTHER_EXPENSES_DETAIL_ID'];
                $other_expenses_detail_date = $cad['OTHER_EXPENSES_DETAIL_DATE'];
                $other_expenses_detail_purpose = $cad['OTHER_EXPENSES_DETAIL_PURPOSE'];
                $other_expenses_detail_location = $cad['OTHER_EXPENSES_DETAIL_LOCATION'];
                $other_expenses_detail_relation_organization_id = $cad['OTHER_EXPENSES_DETAIL_RELATION_ORGANIZATION_ID'];
                $other_expenses_detail_relation_name = $cad['OTHER_EXPENSES_DETAIL_RELATION_NAME'];
                $other_expenses_detail_relation_position = $cad['OTHER_EXPENSES_DETAIL_RELATION_POSITION'];
                $other_expenses_detail_amount = $cad['OTHER_EXPENSES_DETAIL_AMOUNT'];
                $other_expenses_detail_status = null;
                
                OtherExpensesDetail::where('OTHER_EXPENSES_DETAIL_ID', $other_expenses_detail_id)->update([
                    'OTHER_EXPENSES_DETAIL_DATE' => $other_expenses_detail_date,
                    'OTHER_EXPENSES_DETAIL_PURPOSE' => $other_expenses_detail_purpose,
                    'OTHER_EXPENSES_DETAIL_LOCATION' => $other_expenses_detail_location,
                    'OTHER_EXPENSES_DETAIL_RELATION_ORGANIZATION_ID' => $other_expenses_detail_relation_organization_id,
                    'OTHER_EXPENSES_DETAIL_RELATION_NAME' => $other_expenses_detail_relation_name,
                    'OTHER_EXPENSES_DETAIL_RELATION_POSITION' => $other_expenses_detail_relation_position,
                    'OTHER_EXPENSES_DETAIL_AMOUNT' => $other_expenses_detail_amount,
                    'OTHER_EXPENSES_DETAIL_STATUS' => $other_expenses_detail_status
                ]);
    
                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Other Expenses Detail).",
                        "module"      => "Other Expenses",
                        "id"          => $other_expenses_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        } else {
            OtherExpensesDetail::where('OTHER_EXPENSES_ID', $other_expenses_id)->delete();

            foreach ($request->other_expenses_detail as $cad) {
                $other_expenses_detail_id = $cad['OTHER_EXPENSES_DETAIL_ID'];
                $other_expenses_detail_date = $cad['OTHER_EXPENSES_DETAIL_DATE'];
                $other_expenses_detail_end_date = $cad['OTHER_EXPENSES_DETAIL_END_DATE'];
                $other_expenses_detail_purpose = $cad['OTHER_EXPENSES_DETAIL_PURPOSE'];
                $other_expenses_detail_location = $cad['OTHER_EXPENSES_DETAIL_LOCATION'];
                $other_expenses_detail_relation_organization_id = $cad['RELATION_ORGANIZATION_ID'];
                $other_expenses_detail_relation_name = $cad['OTHER_EXPENSES_DETAIL_RELATION_NAME'];
                $other_expenses_detail_relation_position = $cad['OTHER_EXPENSES_DETAIL_RELATION_POSITION'];
                $other_expenses_detail_amount = $cad['OTHER_EXPENSES_DETAIL_AMOUNT'];
                
                OtherExpensesDetail::create([
                    'OTHER_EXPENSES_ID' => $other_expenses_id,
                    'OTHER_EXPENSES_DETAIL_DATE' => $other_expenses_detail_date,
                    'OTHER_EXPENSES_DETAIL_PURPOSE' => $other_expenses_detail_purpose,
                    'OTHER_EXPENSES_DETAIL_LOCATION' => $other_expenses_detail_location,
                    'OTHER_EXPENSES_DETAIL_RELATION_ORGANIZATION_ID' => $other_expenses_detail_relation_organization_id,
                    'OTHER_EXPENSES_DETAIL_RELATION_NAME' => $other_expenses_detail_relation_name,
                    'OTHER_EXPENSES_DETAIL_RELATION_POSITION' => $other_expenses_detail_relation_position,
                    'OTHER_EXPENSES_DETAIL_AMOUNT' => $other_expenses_detail_amount
                ]);
    
                // Created Log CA Detail
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Revised (Other Expenses Detail).",
                        "module"      => "Other Expenses",
                        "id"          => $other_expenses_detail_id
                    ]),
                    'action_by'  => Auth::user()->email
                ]);
            }
        }

        return new JsonResponse([
            'Other Expenses has been revised.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    // public function report_cash_advance(Request $request)
    // {
    //     $user_id = auth()->user()->id;
        
    //     $report_other_expenses_id = $request->other_expenses_number;
    //     $report_other_expenses_requested_by = $user_id;
    //     $report_other_expenses_requested_date = now();
    //     $report_other_expenses_first_approval_by = $request->other_expenses_first_approval_by;
    //     $report_other_expenses_first_approval_status = 0;
    //     $report_other_expenses_request_note = $request->other_expenses_request_note;
    //     $report_other_expenses_refund_type = $request->refund_type;
    //     $report_refund_proof = $request->file('refund_proof')[0];

    //     // Insert Report CA
    //     $report_cash_advance = ReportOtherExpenses::create([
    //         'REPORT_OTHER_EXPENSES_ID' => $report_other_expenses_id,
    //         'REPORT_OTHER_EXPENSES_REQUESTED_BY' => $report_other_expenses_requested_by,
    //         'REPORT_OTHER_EXPENSES_REQUESTED_DATE' => $report_other_expenses_requested_date,
    //         'REPORT_OTHER_EXPENSES_FIRST_APPROVAL_BY' => $report_other_expenses_first_approval_by,
    //         'REPORT_OTHER_EXPENSES_FIRST_APPROVAL_STATUS' => $report_other_expenses_first_approval_status,
    //         'REPORT_OTHER_EXPENSES_REQUEST_NOTE' => $report_other_expenses_request_note,
    //         'REPORT_OTHER_EXPENSES_REFUND_TYPE' => $report_other_expenses_refund_type
    //     ])->REPORT_OTHER_EXPENSES_ID;

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
    //             ReportOtherExpenses::where('REPORT_OTHER_EXPENSES_ID', $report_cash_advance)
    //             ->update([
    //                 'REPORT_OTHER_EXPENSES_REFUND_PROOF' => $document
    //             ]);
    //         }
    //     }

    //     // Created Log Report CA
    //     UserLog::create([
    //         'created_by' => Auth::user()->id,
    //         'action'     => json_encode([
    //             "description" => "Created (Report OtherExpenses).",
    //             "module"      => "Report OtherExpenses",
    //             "id"          => $report_cash_advance
    //         ]),
    //         'action_by'  => Auth::user()->email
    //     ]);

    //     foreach ($request->OtherExpensesDetail as $key => $cad) {
    //         $report_other_expenses_detail_date = $cad['other_expenses_detail_date'];
    //         $report_other_expenses_detail_end_date = $cad['other_expenses_detail_end_date'];
    //         $report_other_expenses_detail_purpose = $cad['other_expenses_detail_purpose'];
    //         $report_other_expenses_detail_location = $cad['other_expenses_detail_location'];
    //         $other_expenses_detail_relation_organization_id = $cad['other_expenses_detail_relation_organization_id'];
    //         $report_other_expenses_detail_relation_name = $cad['other_expenses_detail_relation_name'];
    //         $report_other_expenses_detail_relation_position = $cad['other_expenses_detail_start_relation_position'];
    //         $report_other_expenses_detail_amount = $cad['other_expenses_detail_amount'];

    //         $report_other_expenses_detail = ReportOtherExpensesDetail::create([
    //             'REPORT_OTHER_EXPENSES_ID' => $report_cash_advance,
    //             'REPORT_OTHER_EXPENSES_DETAIL_START_DATE' => $report_other_expenses_detail_date,
    //             'REPORT_OTHER_EXPENSES_DETAIL_END_DATE' => $report_other_expenses_detail_end_date,
    //             'REPORT_OTHER_EXPENSES_DETAIL_PURPOSE' => $report_other_expenses_detail_purpose,
    //             'REPORT_OTHER_EXPENSES_DETAIL_LOCATION' => $report_other_expenses_detail_location,
    //             'REPORT_OTHER_EXPENSES_DETAIL_RELATION_ORGANIZATION_ID' => $other_expenses_detail_relation_organization_id,
    //             'REPORT_OTHER_EXPENSES_DETAIL_RELATION_NAME' => $report_other_expenses_detail_relation_name,
    //             'REPORT_OTHER_EXPENSES_DETAIL_RELATION_POSITION' => $report_other_expenses_detail_relation_position,
    //             'REPORT_OTHER_EXPENSES_DETAIL_AMOUNT' => $report_other_expenses_detail_amount
    //         ])->REPORT_OTHER_EXPENSES_DETAIL_ID;

    //         // Created Log Report CA Detail
    //         UserLog::create([
    //             'created_by' => Auth::user()->id,
    //             'action'     => json_encode([
    //                 "description" => "Created (Report OtherExpenses Detail).",
    //                 "module"      => "Report OtherExpenses Detail",
    //                 "id"          => $report_other_expenses_detail
    //             ]),
    //             'action_by'  => Auth::user()->email
    //         ]);
    //     }

    //     return new JsonResponse([
    //         'New Report OtherExpenses has been added.'
    //     ], 201, [
    //         'X-Inertia' => true
    //     ]);
    // }
}