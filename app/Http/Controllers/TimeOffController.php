<?php

namespace App\Http\Controllers;

use App\Mail\SendEmail;
use App\Models\Document;
use App\Models\RGrade;
use App\Models\RTimeOffType;
use App\Models\TCompanyStructure;
use App\Models\TEmployee;
use App\Models\TimeOff;
use App\Models\TimeOffMaster;
use App\Models\UserLog;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Nette\Schema\Elements\Structure;
use Illuminate\Support\Str;

class TimeOffController extends Controller
{
    public function RemoveSpecialChar($str)
    {
        $replace = Str::of($str)->replace(
            [
                '',
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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $url= URL::to('reviewTimeOff/401');
        // $emailForReject = [
        //         'subject' => 'Request Time Off Status',
        //         'title' => 'Your request time off on  has been rejected. ',
        //         'note_approver' => '',
        //         'time_off_type' => '',
        //         'date' => '',
        //         'email_to' => '',
        //         'url' => $url
        //     ];
        // return view('emails/sendemail', ['data'=> $emailForReject]);
        return Inertia::render('TimeOff/Index', [
            'timeOffTipes' => RTimeOffType::where('TIME_OFF_TYPE_IS_ACTIVE', 0)->where('IS_SHOW', '<>', 0)->get()
        ]);
    }

    function getSubtitute(Request $request) {
        $data = TEmployee::where('DIVISION_ID', $request->divisionId)
                ->where('EMPLOYEE_ID', "<>", $request->employeeId)
                ->where('EMPLOYEE_IS_DELETED', '=', '0')
                ->get();
        
        return response()->json($data);

    }

    function getRequestTo(Request $request) {
        $loggedIn = Auth::user();
        $employee = TEmployee::find($loggedIn["employee_id"]);
        $personGradeLevel = DB::table('t_company_structure AS cs')
                            ->leftJoin('r_grade AS g', 'cs.COMPANY_GRADE_ID', '=', 'g.GRADE_ID')
                            ->where("COMPANY_STRUCTURE_ID", $employee['STRUCTURE_ID'])
                            ->where("COMPANY_ID", $employee['COMPANY_ID'])->first(); // query ke tabel structure berdasarkan structure_id dan organization_id
        $getMaxGradeLevel = RGrade::orderBy('GRADE_LEVEL', 'desc')->first();

        $getUpperLevelPerson = DB::table('t_employee AS e')
            ->leftJoin('t_company_structure AS cs', 'e.STRUCTURE_ID', '=', 'cs.COMPANY_STRUCTURE_ID')
            ->leftJoin('r_grade AS g', 'cs.COMPANY_GRADE_ID', '=', 'g.GRADE_ID')
            ->where('e.COMPANY_ID', '=', $employee['COMPANY_ID'])
            ->where('e.DIVISION_ID', '=', $employee['DIVISION_ID'])
            ->where('e.EMPLOYEE_IS_DELETED', '=', 0)
            ->where('g.GRADE_LEVEL', '>', (int)$personGradeLevel->GRADE_LEVEL)
            ->orderBy('g.GRADE_LEVEL', 'desc')
            ->first();
            if (!$getUpperLevelPerson) {
                $upperData =  DB::table('t_employee AS e')
                    ->leftJoin('t_company_structure AS cs', 'e.STRUCTURE_ID', '=', 'cs.COMPANY_STRUCTURE_ID')
                    ->leftJoin('r_grade AS g', 'cs.COMPANY_GRADE_ID', '=', 'g.GRADE_ID')
                    ->where('e.COMPANY_ID', '=', $employee['COMPANY_ID'])
                    ->where('e.EMPLOYEE_IS_DELETED', '=', 0)
                    ->where('g.GRADE_LEVEL', '=', (int)$getMaxGradeLevel['GRADE_LEVEL'])
                    ->orderBy('g.GRADE_LEVEL', 'desc')
                    ->get();

                if ($upperData->isEmpty()) {
                    $dataResult = DB::table('t_employee AS e')
                        ->leftJoin('t_company_structure AS cs', 'e.STRUCTURE_ID', '=', 'cs.COMPANY_STRUCTURE_ID')
                        ->leftJoin('r_grade AS g', 'cs.COMPANY_GRADE_ID', '=', 'g.GRADE_ID')
                        ->where('e.COMPANY_ID', '=', $employee['COMPANY_ID'])                        
                        ->whereNull('g.GRADE_LEVEL')
                        ->where('e.EMPLOYEE_IS_DELETED', '=', 0)
                        ->orderBy('g.GRADE_LEVEL', 'desc')
                        ->get();
                } else {
                    $dataResult = $upperData;
                }
            } else {
                $dataResult = DB::table('t_employee AS e')
                    ->leftJoin('t_company_structure AS cs', 'e.STRUCTURE_ID', '=', 'cs.COMPANY_STRUCTURE_ID')
                    ->leftJoin('r_grade AS g', 'cs.COMPANY_GRADE_ID', '=', 'g.GRADE_ID')
                    ->where('e.COMPANY_ID', '=', $employee['COMPANY_ID'])
                    ->where('e.DIVISION_ID', '=', $employee['DIVISION_ID'])
                    ->where('g.GRADE_LEVEL', '=', (int)$getUpperLevelPerson->GRADE_LEVEL)
                    ->where('e.EMPLOYEE_IS_DELETED', '=', 0)
                    ->orderBy('g.GRADE_LEVEL', 'desc')
                    ->get();
            }
        
        return response()->json($dataResult);

    }

    function getTimeOffAvailable(Request $request) {

        $loggedIn = Auth::user();
        $employee = TEmployee::find($loggedIn["employee_id"]);
        
        $curentTime = Carbon::now()->format('Y-m-d');        

        if (!$employee) {
            $data = 0;
        } else {
            if (!$employee['EMPLOYEE_HIRE_DATE']) {
                $data = 0;
            } else {
                if ($curentTime > date('Y-m-d', strtotime("+12 months", strtotime($employee['EMPLOYEE_HIRE_DATE'])))) {
                    $hireDate = date('Y-m-d', strtotime("+12 months", strtotime($employee['EMPLOYEE_HIRE_DATE']))); 
                    $splitHireDate = explode("-", $hireDate);
                    $splitToday = explode("-", $curentTime);
                    
                    // ambil tahun
                    if ((int)$splitToday[0] < (int)$splitHireDate[0]) {
                        $data = 0;
                    } else {
                        if ((int)$splitToday[0] == (int)$splitHireDate[0]) {
                            $data = 12 - (int)$splitHireDate[1] + 1;
                        } else {
                            $data = 12;
                        }
                    }                    
                } else {
                    $data =0;
                }
            }
        }        
        return response()->json($data);
    }

    function getTimeOffUsed(Request $request) {

        $loggedIn = Auth::user();
        $employee = TEmployee::find($loggedIn["employee_id"]);
        $curentTime = Carbon::now()->format('Y-m-d');
        $splitToday = explode("-", $curentTime);
        // dd($employee);
        $firstDate = $splitToday[0]."-01-01"; // date("Y-m-t", strtotime($splitToday[0]."-01-01"));
        $endDate = $splitToday[0]."-12-31"; //date("Y-m-t", strtotime($splitToday[0]."-12-31"));
        // dd($endDate);

        $data = DB::table('t_request_time_off_master AS rtom')
            ->leftJoin('t_request_time_off AS rto', 'rtom.REQUEST_TIME_OFF_MASTER_ID', '=', 'rto.REQUEST_TIME_OFF_MASTER_ID')
            ->where("rtom.EMPLOYEE_ID", $employee['EMPLOYEE_ID'])
            ->where("rtom.IS_REDUCE_LEAVE", 1)
            ->where("rtom.STATUS", 2)
            ->where('rto.DATE_OF_LEAVE', '>=', $firstDate)
            ->where('rto.DATE_OF_LEAVE', '<=', $endDate)->count();
        return response()->json($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function getEmployeeById($id)
    {
        return TEmployee::find($id);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $document_id = "";
            $arrReqTimeOff =[];
            
            $contentFile = $request->file();
            if ($contentFile) {
                $file = $contentFile["FILE_ID"];
                // Create Folder For Person Document
                $parentDir = ((floor(($request->EMPLOYEE_ID)/1000))*1000).'/';
                $employeeId = $request->EMPLOYEE_ID . '/';
                $typeDir = "";
                $uploadPath = 'documents/' . 'TimeOff/'. $parentDir . $employeeId . $typeDir;

                // get Data Document
                $documentOriginalName = $this->RemoveSpecialChar($file->getClientOriginalName());
                $documentFileName = $this->RemoveSpecialChar($file->getClientOriginalName());
                $documentDirName = $uploadPath;
                $documentFileType = $file->getClientMimeType();
                $documentFileSize = $file->getSize();

                // masukan data file ke database
                $document_id = Document::create([
                    'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                    'DOCUMENT_FILENAME'             => "",
                    'DOCUMENT_DIRNAME'              => $documentDirName,
                    'DOCUMENT_FILETYPE'             => $documentFileType,
                    'DOCUMENT_FILESIZE'             => $documentFileSize,
                    'DOCUMENT_CREATED_BY'           => Auth::user()->id
                ])->DOCUMENT_ID;

                if($document_id){
                    // update file name "DOCUMENT_ID - FILENAME"
                    Document::where('DOCUMENT_ID', $document_id)->update([
                        'DOCUMENT_FILENAME'             => $document_id."-".$documentOriginalName,
                    ]);

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $file, $document_id . "-" . $this->RemoveSpecialChar($file->getClientOriginalName()));
                }
            }

            $timeOffMaster = TimeOffMaster::create([
                'EMPLOYEE_ID'               => $request->EMPLOYEE_ID,
                'IS_REDUCE_LEAVE'           => $request->IS_REDUCE_LEAVE,
                'TIME_OFF_TYPE_ID'          => $request->TIME_OFF_TYPE_ID,
                'SUBSTITUTE_PIC'            => $request->SUBSTITUTE_PIC,
                'SECOND_SUBSTITUTE_PIC'     => $request->SECOND_SUBSTITUTE_PIC,
                'FILE_ID'                   => $document_id,
                'DESCRIPTION'               => $request->DESCRIPTION,
                'REQUEST_DATE'              => Carbon::now()->format('Y-m-d'),//$request->REQUEST_DATE,
                'REQUEST_TO'                => $request->REQUEST_TO,
                'APPROVED_DATE'             => $request->APPROVED_DATE,
                'APPROVED_BY'               => $request->APPROVED_BY,
                'STATUS'                    => 0, // request
                'CREATED_BY'                => Auth::user()->id,
                'CREATED_DATE'              => now(),
                'REQUEST_NUMBER'            => "REQ-".sprintf('%04d', $request->EMPLOYEE_ID).Carbon::now()->format('YmdHis')
            ]);

            $date = [];
            if ($request->detail) {
                foreach ($request->detail as $key => $value) {
                    TimeOff::insert([
                        'REQUEST_TIME_OFF_MASTER_ID' => $timeOffMaster->REQUEST_TIME_OFF_MASTER_ID,
                        'DATE_OF_LEAVE'             => $value['DATE_OF_LEAVE'],
                    ]);
                    array_push($date, $value['DATE_OF_LEAVE']);
                }
            }

            $timeOffType = RTimeOffType::find($request->TIME_OFF_TYPE_ID);
            $employee = $this->getEmployeeById($request->EMPLOYEE_ID);
            $pic1 = $this->getEmployeeById($request->SUBSTITUTE_PIC);
            $requestTo = $this->getEmployeeById($request->REQUEST_TO);

            // email untuk PIC 1
            $emailForPic = [
                'subject' => 'Substitute PIC for '. $employee['EMPLOYEE_FIRST_NAME'],
                'title' => 'You were selected as a substitute PIC by '.$employee['EMPLOYEE_FIRST_NAME'],
                'time_off_type' => 'Time Off Type: '. $timeOffType['TIME_OFF_TYPE_NAME'],
                'date' => $date,
                'email_to' => $pic1['EMPLOYEE_EMAIL'],
                'url' => '',
                'note_approver' => ''
            ];
            $this->sendMail($emailForPic);

            // email untuk PIC 2
            if ($request->SECOND_SUBSTITUTE_PIC) {
                $pic2 = $this->getEmployeeById($request->SECOND_SUBSTITUTE_PIC);
                $emailForPic2 = [
                    'subject' => 'Substitute PIC for '. $employee['EMPLOYEE_FIRST_NAME'],
                    'title' => 'You were selected as a substitute PIC by '.$employee['EMPLOYEE_FIRST_NAME'],
                    'time_off_type' => 'Time Off Type: '. $timeOffType['TIME_OFF_TYPE_NAME'],
                    'date' => $date,
                    'email_to' => $pic2['EMPLOYEE_EMAIL'],
                    'url' => '',
                    'note_approver' => ''
                ];
                $this->sendMail($emailForPic2);
            }

            // email untuk Request To
            $url= URL::to('reviewTimeOff/'. $timeOffMaster->REQUEST_TIME_OFF_MASTER_ID);
            $emailForRequestTo = [
                'subject' => 'Request Time Off - '. $timeOffMaster->REQUEST_NUMBER,
                'title' => $employee['EMPLOYEE_FIRST_NAME']. ' applied for leave and asked '.$requestTo['EMPLOYEE_FIRST_NAME'].' for permission. ',
                'time_off_type' => 'Time Off Type: '. $timeOffType['TIME_OFF_TYPE_NAME'],
                'date' => $date,
                'email_to' => $requestTo['EMPLOYEE_EMAIL'],
                'url' => $url,
                'note_approver' => ''
            ];
            $this->sendMail($emailForRequestTo);

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Request Time Off.",
                    "module"      => "Time Off",
                    "id"          => $timeOffMaster->REQUEST_TIME_OFF_MASTER_ID
                ]),
                'action_by'  => Auth::user()->user_login
            ]);       
        }); 
        
        return new JsonResponse([
            "msg" => "Success Request Time Off"
        ], 201, [
            'X-Inertia' => true
        ]);
       
    }

    public function sendMail($data) {
        // echo $data['email_to']. " | ";
        // $data = [
        //     'subject' => 'Testing Kirim Email',
        //     'title' => 'Testing Kirim Email',
        //     'body' => 'Ini adalah email uji coba dari Tutorial Laravel: Send Email Via SMTP GMAIL @ qadrLabs.com'
        // ];

        // Mail::to('apianbaru@gmail.com')->send(new SendEmail($data));
        Mail::to($data['email_to'])->send(new SendEmail($data));

    }

    public function editRequestTimeOff(Request $request)
    {
        // dd($request);
        DB::transaction(function () use ($request) {     

            $timeOffMasterId = $request->REQUEST_TIME_OFF_MASTER_ID;

            TimeOffMaster::where('REQUEST_TIME_OFF_MASTER_ID', $timeOffMasterId)
                ->update([
                'IS_REDUCE_LEAVE'           => $request->IS_REDUCE_LEAVE,
                'TIME_OFF_TYPE_ID'          => $request->TIME_OFF_TYPE_ID,
                'SUBSTITUTE_PIC'            => $request->SUBSTITUTE_PIC,
                'SECOND_SUBSTITUTE_PIC'     => $request->SECOND_SUBSTITUTE_PIC,
                'DESCRIPTION'               => $request->DESCRIPTION,
                'REQUEST_TO'                => $request->REQUEST_TO,
                'UPDATED_BY'                => Auth::user()->id,
                'UPDATED_DATE'              => now(),
            ]);
            
            $date = [];
            if ($request->request_time_off) {
                TimeOff::where('REQUEST_TIME_OFF_MASTER_ID', $timeOffMasterId)->delete();
                foreach ($request->request_time_off as $key => $value) {
                    TimeOff::insert([
                        'REQUEST_TIME_OFF_MASTER_ID' => $timeOffMasterId,
                        'DATE_OF_LEAVE'             => $value['DATE_OF_LEAVE'],
                    ]);
                    array_push($date, $value['DATE_OF_LEAVE']);
                }
            }

            // Kirim Email
            
            $timeOffType = $request->time_off_type; // RTimeOffType::find($request->TIME_OFF_TYPE_ID);
            $employee = $request->employee; //$this->getEmployeeById($request->employee);
            $pic1 = $this->getEmployeeById($request->SUBSTITUTE_PIC);
            $requestTo = $this->getEmployeeById($request->REQUEST_TO);

            // email untuk PIC 1
            $emailForPic = [
                'subject' => 'Substitute PIC for '. $employee['EMPLOYEE_FIRST_NAME'],
                'title' => 'You were selected as a substitute PIC by '.$employee['EMPLOYEE_FIRST_NAME'],
                'time_off_type' => 'Time Off Type: '. $timeOffType['TIME_OFF_TYPE_NAME'],
                'date' => $date,
                'email_to' => $pic1['EMPLOYEE_EMAIL'],
                'url' => '',
                'note_approver' => ''
            ];
            $this->sendMail($emailForPic);

            // email untuk PIC 2
            if ($request->SECOND_SUBSTITUTE_PIC) {
                $pic2 = $this->getEmployeeById($request->SECOND_SUBSTITUTE_PIC);
                $emailForPic2 = [
                    'subject' => 'Substitute PIC for '. $employee['EMPLOYEE_FIRST_NAME'],
                    'title' => 'You were selected as a substitute PIC by '.$employee['EMPLOYEE_FIRST_NAME'],
                    'time_off_type' => 'Time Off Type: '. $timeOffType['TIME_OFF_TYPE_NAME'],
                    'date' => $date,
                    'email_to' => $pic2['EMPLOYEE_EMAIL'],
                    'url' => '',
                    'note_approver' => ''
                ];
                $this->sendMail($emailForPic2);
            }

            // email untuk Request To
            $url= URL::to('reviewTimeOff/'. $request->REQUEST_TIME_OFF_MASTER_ID);
            $emailForRequestTo = [
                'subject' => 'Edited Request Time Off - '. $request->REQUEST_NUMBER,
                'title' => $employee['EMPLOYEE_FIRST_NAME']. ' applied for leave and asked '.$requestTo['EMPLOYEE_FIRST_NAME'].' for permission. ',
                'time_off_type' => 'Time Off Type: '. $timeOffType['TIME_OFF_TYPE_NAME'],
                'date' => $date,
                'email_to' => $requestTo['EMPLOYEE_EMAIL'],
                'url' => $url,
                'note_approver' => ''
            ];
            $this->sendMail($emailForRequestTo);
            // end Kirim Email

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Edit Request Time Off.",
                    "module"      => "Time Off",
                    "id"          => $timeOffMasterId
                ]),
                'action_by'  => Auth::user()->user_login
            ]);       
        }); 
        
        return new JsonResponse([
            "msg" => "Success Edit Time Off"
        ], 201, [
            'X-Inertia' => true
        ]);
       
    }

    
    public function time_off_document_download($idDocument)
    {
        $detailDocument = Document::find($idDocument);
        // $filePath = public_path('/storage/documents/CA/0/11/11-List-Asuransi--2-Unit-Dumptruck.pdf');
        $filePath = public_path('/storage/' . $detailDocument->DOCUMENT_DIRNAME . $detailDocument->DOCUMENT_FILENAME);
        
        $headers = [
            'filename' => $detailDocument->DOCUMENT_FILENAME
        ];

        if (file_exists($filePath)) {
            return response()->download($filePath, $detailDocument->DOCUMENT_FILENAME, $headers);
        } else {
            abort(404, 'File not found');
        }
    }


    function reviewTimeOff($id= null) {
    // function reviewTimeOff(Request $request) {
        return Inertia::render('TimeOff/ReviewTimeOff', [
            // 'data' => TimeOffMaster::find($request->id),
            'data' => TimeOffMaster::find($id),
            'employees' => TEmployee::where('EMPLOYEE_IS_DELETED', '=', '0')->get(),
            'timeOffTipes' => RTimeOffType::where('TIME_OFF_TYPE_IS_ACTIVE', 0)->get()
        ]);
    }

    function listApproveTimeOff() {
        return Inertia::render('TimeOff/ReviewTimeOff', [
            // 'data' => TimeOffMaster::find($id),
            'employees' => TEmployee::where('EMPLOYEE_IS_DELETED', '=', '0')->get(),
            'timeOffTipes' => RTimeOffType::where('TIME_OFF_TYPE_IS_ACTIVE', 0)->get()
        ]);
    }

    function getRequestTimeOffById($id= null) {
        $data = TimeOffMaster::find($id);
        return response()->json($data);
        // return Inertia::render('TimeOff/ReviewTimeOff', [
        //     'data' => TimeOffMaster::find($id),
        //     'employees' => TEmployee::where('EMPLOYEE_IS_DELETED', '=', '0')->get(),
        //     'timeOffTipes' => RTimeOffType::where('TIME_OFF_TYPE_IS_ACTIVE', 0)->get()
        // ]);
    }

    function approveTimeOff(Request $request) {
        // dd($request);
        DB::transaction(function () use ($request) {
            $timeOffMasterId = TimeOffMaster::where('REQUEST_TIME_OFF_MASTER_ID', $request->REQUEST_TIME_OFF_MASTER_ID)
                ->update([
                    'APPROVED_DATE'             => now(),
                    'APPROVED_BY'               => Auth::user()->employee_id,
                    'STATUS'                    => 2, // approve
                    'NOTE'                      => $request->NOTE
                ]);

            $employee = $this->getEmployeeById($request->EMPLOYEE_ID);

            // email untuk Approved
            $emailForApprove = [
                'subject' => 'Request Time Off Status',
                'title' => 'Your request time off on '.$employee['REQUEST_DATE'].' has been approved. ',
                'note_approver' => $request->NOTE,
                'time_off_type' => '',
                'date' => '',
                'email_to' => $employee['EMPLOYEE_EMAIL'],
                'url' => ''
            ];
            $this->sendMail($emailForApprove);

        });

        return new JsonResponse([
            "msg" => "Success Approved"
        ], 201, [
            'X-Inertia' => true
        ]);

    }

    function rejectTimeOff(Request $request) {
        // dd($request->data);
        DB::transaction(function () use ($request) {
            $data = $request->data;
            $timeOffMasterId = TimeOffMaster::where('REQUEST_TIME_OFF_MASTER_ID', $data['REQUEST_TIME_OFF_MASTER_ID'])
                ->update([
                    'STATUS'                    => 1, //Reject
                    'NOTE'                      => $data['NOTE']
                ]);

            $employee = $this->getEmployeeById($data['EMPLOYEE_ID']);

            // email untuk Rejected
            $emailForReject = [
                'subject' => 'Request Time Off Status',
                'title' => 'Your request time off on '.$data['REQUEST_DATE'].' has been rejected. ',
                'note_approver' => $data['NOTE'],
                'time_off_type' => '',
                'date' => '',
                'email_to' => $employee['EMPLOYEE_EMAIL'],
                'url' => ''
            ];
            $this->sendMail($emailForReject);

        });

        return new JsonResponse([
            "msg" => "Success Rejected"
        ], 201, [
            'X-Inertia' => true
        ]);

    }

    function cancelTimeOff(Request $request) {
        // dd($request->data);
        DB::transaction(function () use ($request) {
            $data = $request->data;
            $timeOffMasterId = TimeOffMaster::where('REQUEST_TIME_OFF_MASTER_ID', $data['REQUEST_TIME_OFF_MASTER_ID'])
                ->update([
                    'IS_DELETED'                => 1, //YES
                ]);

            $requestTo = $this->getEmployeeById($data['REQUEST_TO']);
            
            // email untuk Rejected
            $emailForReject = [
                'subject' => 'Canceled Request Time Off',
                'title' => 'Request time off on number - '.$data['REQUEST_NUMBER'] .' has been canceled by '. $data['employee']['EMPLOYEE_FIRST_NAME'],
                'note_approver' => '',
                'time_off_type' => '',
                'date' => '',
                'email_to' => $requestTo['EMPLOYEE_EMAIL'],
                'url' => ''
            ];
            $this->sendMail($emailForReject);

        });

        return new JsonResponse([
            "msg" => "Success Canceled"
        ], 201, [
            'X-Inertia' => true
        ]);

    }

    public function getRequestTimeOffAgGrid(Request $request)
    {
        // dd($request);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sortModel = $request->input('sort');

        // $query = DB::table('t_policy as p')->leftJoin('t_relation as r', 'p.RELATION_ID', '=', 'r.RELATION_ORGANIZATION_ID');
        $query = TimeOffMaster::where('EMPLOYEE_ID', Auth::user()->employee_id)->where('IS_DELETED', '=', '0')->orderBy('REQUEST_TIME_OFF_MASTER_ID', 'desc');
            
        // $filterModel = json_decode($request->input('filter'), true);
        // $newSearch = json_decode($request->newFilter, true);        
        
        // if ($sortModel) {
        //     $sortModel = explode(';', $sortModel); 
        //     foreach ($sortModel as $sortItem) {
        //         list($colId, $sortDirection) = explode(',', $sortItem);
        //         $query->orderBy($colId, $sortDirection); 
        //     }
        // } else {
        //     $query->orderBy('POLICY_ID', 'DESC'); 
        // }

        // if ($request->newFilter !== "") {
        //     foreach ($newSearch[0] as $keyId => $searchValue) {
        //         if ($keyId === 'POLICY_NUMBER') {
        //             if ($searchValue != "") {
        //                 $query->where('POLICY_NUMBER', 'LIKE', '%' . $searchValue . '%');
        //             }                        
        //         }elseif ($keyId === 'CLIENT_ID'){
        //             if ($searchValue != "") {
        //                 $query->where('RELATION_ID', $searchValue);
        //             }
        //         }
        //     }
        // }

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        
        return $data;
    }

     public function getRequestTimeOffForApprove(Request $request)
    {
        // dd($request);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sortModel = $request->input('sort');

        $newSearch = json_decode($request->newFilter, true);       
        $query = DB::table('t_request_time_off_master as rtom')
            ->join('t_employee AS e', 'rtom.EMPLOYEE_ID', '=', 'e.EMPLOYEE_ID')
            ->where('STATUS', '=', '0')
            ->where('rtom.IS_DELETED', '=', '0')
            ->where('e.COMPANY_ID', '=', $newSearch['COMPANY_ID'])
            ->where('e.DIVISION_ID', '=', $newSearch['DIVISION_ID'])
            ->orderBy('REQUEST_TIME_OFF_MASTER_ID', 'desc'); 
        
        $data = $query->paginate($perPage, ['*'], 'page', $page);
        
        return $data;
    }

    public function sendLink()
    {
        $link = 'https://example.com/your-link';
        
        Mail::to('adityapian6@gmail.com')->send(new SendEmail($link));

        return 'Email telah dikirim!';
    }

    /**
     * Display the specified resource.
     */
    public function show(TimeOff $timeOff)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TimeOff $timeOff)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TimeOff $timeOff)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TimeOff $timeOff)
    {
        //
    }
}
