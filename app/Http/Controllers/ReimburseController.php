<?php

namespace App\Http\Controllers;

use App\Models\COA;
use App\Models\Reimburse;
use App\Models\ReimburseDetail;
use App\Models\Document;
use App\Models\MReimburseDocument;
use App\Models\Relation;
use App\Models\TDocument;
use App\Models\TPerson;
use App\Models\TRelationOffice;
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
        $reimburse_requested_by = $searchQuery->reimburse_requested_by;
        $reimburse_used_by = $searchQuery->reimburse_used_by;
        $reimburse_start_date = $searchQuery->reimburse_start_date;
        $reimburse_end_date = $searchQuery->reimburse_end_date;
        $status = $searchQuery->status;
        $status_type = $searchQuery->status_type;

        $data = Reimburse::orderBy('REIMBURSE_ID', 'desc');
        
        if ($searchQuery) {
            if ($searchQuery->input('reimburse_requested_by')) {
                $data->whereHas('person',
                function($query) use($reimburse_requested_by)
                {
                    $query->where('PERSON_FIRST_NAME', 'like', '%'. $reimburse_requested_by .'%');
                });
            }

            if ($searchQuery->input('reimburse_used_by')) {
                $data->whereHas('person_used_by',
                function($query) use($reimburse_used_by)
                {
                    $query->where('PERSON_FIRST_NAME', 'like', '%'. $reimburse_used_by .'%');
                });
            }

            if (
                $searchQuery->input('reimburse_start_date') &&
                $searchQuery->input('reimburse_end_date')
            ) {
                $data->whereBetween('REIMBURSE_REQUESTED_DATE', [$reimburse_start_date, $reimburse_end_date]);
            }

            if ($searchQuery->input('reimburse_division')) {
                $data->where('REIMBURSE_DIVISION', 'like', '%'. $searchQuery->reimburse_division .'%');
            }

            if ($status == 1 && $status_type == "Approve1") {
                $data->where('REIMBURSE_FIRST_APPROVAL_STATUS', 1);
            } else if ($status == 2 && $status_type == "Approve1") {
                $data->where('REIMBURSE_FIRST_APPROVAL_STATUS', 2);
            } else if ($status == 2 && $status_type == "Approve2") {
                $data->where('REIMBURSE_SECOND_APPROVAL_STATUS', 2);
            } else if ($status == 5 && $status_type == "Pending Report") {
                $data->where('REIMBURSE_SECOND_APPROVAL_STATUS', 5);
            } else if ($status == 3 && $status_type == "Need Revision") {
                $data->where('REIMBURSE_FIRST_APPROVAL_STATUS', 3)
                    ->orWhere('REIMBURSE_SECOND_APPROVAL_STATUS', 3)
                    ->orWhere('REIMBURSE_THIRD_APPROVAL_STATUS', 3);
            } else if ($status == 4 && $status_type == "Reject") {
                $data->where('REIMBURSE_FIRST_APPROVAL_STATUS', 4)
                ->orWhere('REIMBURSE_SECOND_APPROVAL_STATUS', 4)
                ->orWhere('REIMBURSE_THIRD_APPROVAL_STATUS', 4);
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

    public function index() 
    {
        $data = [
            'relations' => Relation::all(),
            'coa' => COA::all(),
            'persons' => TPerson::all(),
            'office' => TRelationOffice::all()
        ];

        return Inertia::render('Reimburse/Reimburse', $data);
    }

    // public function getReimburseNumber()
    // {
    //     $data = 
    //         Reimburse::where('REIMBURSE_FIRST_APPROVAL_STATUS', 1)
    //                     ->orderBy('REIMBURSE_ID', 'desc')
    //                     ->get();

    //     return response()->json($data);
    // }

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
        $user_id = Auth::user()->id;
        $person = TPerson::find($request->reimburse_first_approval_by['value']);

        $total_amount = 0;

        foreach ($request->ReimburseDetail as $value) {
            $total_amount += $value['reimburse_detail_amount'];
        }

        $reimburse_number = $this->getReimburseNumber();
        $reimburse_used_by = $request->reimburse_used_by['value'];
        $reimburse_requested_by = $user_id;
        $reimburse_division = 'IT';
        $reimburse_office = $request->reimburse_office['value'];
        $reimburse_requested_date = now();
        $reimburse_first_approval_by = $request->reimburse_first_approval_by['value'];
        $reimburse_first_approval_user = $person->PERSON_FIRST_NAME;
        $reimburse_first_approval_status = 1;
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
            'REIMBURSE_OFFICE' => $reimburse_office,
            'REIMBURSE_REQUESTED_DATE' => $reimburse_requested_date,
            'REIMBURSE_FIRST_APPROVAL_BY' => $reimburse_first_approval_by,
            'REIMBURSE_FIRST_APPROVAL_USER' => $reimburse_first_approval_user,
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

        foreach ($request->ReimburseDetail as $rd) {
            $reimburse_detail_date = $rd['reimburse_detail_date'];
            $reimburse_detail_purpose = $rd['reimburse_detail_purpose'];
            $reimburse_detail_location = $rd['reimburse_detail_location'];
            $reimburse_detail_relation_organization_id = $rd['reimburse_detail_relation_organization_id']['value'];
            $reimburse_detail_relation_name = $rd['reimburse_detail_relation_name'];
            $reimburse_detail_relation_position = $rd['reimburse_detail_relation_position'];
            $reimburse_detail_amount = $rd['reimburse_detail_amount'];
            
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
            $files = $request->file('ReimburseDetail');
            if (is_array($files) && !empty($files)) {
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

                    $document = TDocument::create([
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

        $user_id = Auth::user()->id;
        
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
}