<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\MMedicalDetail;
use App\Models\MMedicalDocument;
use App\Models\RTimeOffType;
use App\Models\TCompany;
use App\Models\TCompanyDivision;
use App\Models\TEmployee;
use App\Models\TMedical;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class MedicalController extends Controller
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


    // UNTUK REQUESTER

    public function index()
    {
        $listYear = DB::table('t_medical')
                ->selectRaw('YEAR(REQUEST_DATE) as YEAR')
                ->groupBy(DB::raw('YEAR(REQUEST_DATE)'))->get();
        $listMaternity = DB::table('m_grade_maternity_limit AS gml')
                ->select(DB::raw(' g.*, ml.*'))
                ->leftJoin('r_grade AS g', 'gml.GRADE_ID', '=', 'g.GRADE_ID')
                ->leftJoin('r_maternity_limit AS ml', 'gml.MATERNITY_LIMIT_ID', '=', 'ml.MATERNITY_LIMIT_ID')
                ->get();
        return Inertia::render('Medical/Requester/Index', [
            'selectYear'    => $listYear,
            'listMaternity' => $listMaternity
        ]);
    }

    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $contentFile = $request->file();

            // Simpan ke Tabel t_medical
            $medical = TMedical::create([
                'EMPLOYEE_ID'       => $request->EMPLOYEE_ID,
                'COMPANY_ID'        => $request->COMPANY_ID,
                'DIVISION_ID'       => $request->DIVISION_ID,
                'STRUCTURE_ID'      => $request->STRUCTURE_ID,
                'MEDICAL_TYPE'      => $request->MEDICAL_TYPE,
                'MEDICAL_AMOUNT'    => $request->MEDICAL_AMOUNT,
                'MEDICAL_LIMIT'     => $request->MEDICAL_LIMIT,
                'REQUEST_DATE'      => now(),
                'CREATED_BY'        => Auth::user()->id,
                'CREATED_DATE'      => now()
            ]);

            // Simpan ke Tabel m_medical_detail
            if ($request->detail) {
                foreach ($request->detail as $key => $value) {
                    MMedicalDetail::insert([
                        'MEDICAL_ID'        => $medical->MEDICAL_ID,
                        'AMOUNT'            => $value['AMOUNT'],
                        'DESCRIPTION'       => $value['DESCRIPTION'],
                    ]);
                }
            }

            // Simpan ke Tabel m_medical_document dan t_document
            if ($contentFile) {
                foreach ($contentFile['document'] as $key => $value) {
                    $file = $contentFile['document'][$key];
                    // print_r($file->getClientOriginalName());
                    // Create Folder For Person Document
                    $parentDir = ((floor(($medical->MEDICAL_ID)/1000))*1000).'/';
                    $medicalId = $medical->MEDICAL_ID . '/';
                    $typeDir = "";
                    $uploadPath = 'documents/' . 'Medical/'. $parentDir . $medicalId . $typeDir;

                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($file->getClientOriginalName());
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

                        // Save ke Tabel t_medical_document
                        MMedicalDocument::insert([
                        'MEDICAL_ID'        => $medical->MEDICAL_ID,
                        'DOCUMENT_ID'       => $document_id,
                    ]);
                    }
                }
            }

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Request Medical Reimburst.",
                    "module"      => "Medical Reimburst",
                    "id"          => $medical->MEDICAL_ID
                ]),
                'action_by'  => Auth::user()->user_login
            ]);
        }); 
        
        return new JsonResponse([
            "msg" => "Success Request Medical"
        ], 201, [
            'X-Inertia' => true
        ]);
       
    }

    public function getRequestMedicalAgGrid(Request $request)
    {
        // dd($request);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sortModel = $request->input('sort');

        // $query = TimeOffMaster::where('EMPLOYEE_ID', Auth::user()->employee_id)->where('IS_CANCELED', '=', '0')->orderBy('REQUEST_TIME_OFF_MASTER_ID', 'desc');
        $query = DB::table('t_medical AS m')
                ->select(DB::raw(' m.*, SUM(md.AMOUNT) AS AMOUNT'))
                ->leftJoin('m_medical_detail AS md', 'm.MEDICAL_ID', '=', 'md.MEDICAL_ID')
                ->groupBy('m.MEDICAL_ID');
            
        // $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);        
        
        // if ($sortModel) {
        //     $sortModel = explode(';', $sortModel); 
        //     foreach ($sortModel as $sortItem) {
        //         list($colId, $sortDirection) = explode(',', $sortItem);
        //         $query->orderBy($colId, $sortDirection); 
        //     }
        // } else {
        //     $query->orderBy('POLICY_ID', 'DESC'); 
        // }

        if ($request->newFilter != "") {
            foreach ($newSearch[0] as $keyId => $searchValue) {
                if ($keyId === 'EMPLOYEE_ID') {
                    if ($searchValue != "") {
                        $query->where('EMPLOYEE_ID', '=', $searchValue);
                    }                        
                }elseif ($keyId === 'YEAR') {
                    if ($searchValue != "") {
                        $query->where(DB::raw('year(m.REQUEST_DATE)'), '=', $searchValue);
                    }                        
                }elseif ($keyId === 'MONTH'){
                    if ($searchValue != "") {
                        $query->where(DB::raw('month(m.REQUEST_DATE)'), '=', $searchValue);
                    }
                }
            }
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        
        return $data;
    }

    function getRequestMedicalById($id= null) {
        $data = TMedical::find($id);
        return response()->json($data);
    }

    public function editRequestMedical(Request $request)
    {
        // dd($request->file());
        DB::transaction(function () use ($request) {     

            $medicalId = $request->MEDICAL_ID;

            // update di tabel t_medical
            TMedical::where('MEDICAL_ID', $medicalId)
                ->update([
                // 'EMPLOYEE_ID'       => $request->EMPLOYEE_ID,
                // 'COMPANY_ID'        => $request->COMPANY_ID,
                // 'DIVISION_ID'       => $request->DIVISION_ID,
                // 'STRUCTURE_ID'      => $request->STRUCTURE_ID,
                'MEDICAL_TYPE'      => $request->MEDICAL_TYPE,
                'MEDICAL_AMOUNT'    => $request->MEDICAL_AMOUNT,
                'MEDICAL_LIMIT'     => $request->MEDICAL_LIMIT,
                'UPDATED_BY'        => Auth::user()->id,
                'UPDATED_DATE'      => now()
            ]);

            // update di tabel t_medical_detail
            if ($request->detail) {
                MMedicalDetail::where('MEDICAL_ID', $medicalId)->delete();
                foreach ($request->detail as $key => $value) {
                    MMedicalDetail::insert([
                        'MEDICAL_ID'        => $medicalId,
                        'AMOUNT'            => $value['AMOUNT'],
                        'DESCRIPTION'       => $value['DESCRIPTION'],
                    ]);
                }
            }

            // update di tabel t_medical_document
            $contentFile = $request->file();
            if ($contentFile) {
                foreach ($contentFile['document_new'] as $key => $value) {
                    $file = $contentFile['document_new'][$key];
                    // print_r($file->getClientOriginalName());
                    // Create Folder For Person Document
                    $parentDir = ((floor(($medicalId)/1000))*1000).'/';
                    $medicalId = $medicalId . '/';
                    $typeDir = "";
                    $uploadPath = 'documents/' . 'Medical/'. $parentDir . $medicalId . $typeDir;

                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($file->getClientOriginalName());
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

                        // Save ke Tabel t_medical_document
                        MMedicalDocument::insert([
                        'MEDICAL_ID'        => $medicalId,
                        'DOCUMENT_ID'       => $document_id,
                    ]);
                    }
                }
            }

        }); 
        
        return new JsonResponse([
            "msg" => "Success Edit Medical"
        ], 201, [
            'X-Inertia' => true
        ]);
       
    }

     public function medical_document_download($idDocument)
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

    public function delete_medical_document(Request $request){
        // dd($request);
        // Delete Document 
        $idDocument = $request->idDocument;
        // delete MEmployeeDocument
        if($idDocument){
            $medicalDocument = MMedicalDocument::where('DOCUMENT_ID', $request->idDocument)->delete();

            if($medicalDocument){
                // delete image from folder
                $data = Document::find($request->idDocument);
                Storage::disk('public')->delete($data->DOCUMENT_DIRNAME.$data->DOCUMENT_FILENAME);

                // delete document from database
                Document::where('DOCUMENT_ID', $request->idDocument)->delete();

            }
        }

        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
            "description" => "Medical Document Delete (Medical).",
            "module"      => "Medical",
            "id"          => $request->medicalId
        ]),
        'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->medicalId
        ], 201, [
            'X-Inertia' => true
        ]);
    }



    // UNTUK APPROVAL

    public function medicalForApproval()
    {
        $listYear = DB::table('t_medical')
                ->selectRaw('YEAR(REQUEST_DATE) as YEAR')
                ->groupBy(DB::raw('YEAR(REQUEST_DATE)'))->get();
                
        return Inertia::render('Medical/Approval/Index', [
            'selectYear' => $listYear,
            'companies' => TCompany::get(),
            'listEmployee' => TEmployee::where('EMPLOYEE_IS_DELETED', '=', '0')->get(),
            'listDivision' => TCompanyDivision::get()
        ]);
    }

    public function getMedicalAgGridForHR(Request $request)
    {
        // dd($request);
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $sortModel = $request->input('sort');

        // $query = TimeOffMaster::where('EMPLOYEE_ID', Auth::user()->employee_id)->where('IS_CANCELED', '=', '0')->orderBy('REQUEST_TIME_OFF_MASTER_ID', 'desc');
        $query = DB::table('t_medical AS m')
                ->select(DB::raw(' m.*, SUM(md.AMOUNT) AS AMOUNT'))
                ->leftJoin('m_medical_detail AS md', 'm.MEDICAL_ID', '=', 'md.MEDICAL_ID')
                ->groupBy('m.MEDICAL_ID');
            
        // $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);        
        
        // if ($sortModel) {
        //     $sortModel = explode(';', $sortModel); 
        //     foreach ($sortModel as $sortItem) {
        //         list($colId, $sortDirection) = explode(',', $sortItem);
        //         $query->orderBy($colId, $sortDirection); 
        //     }
        // } else {
        //     $query->orderBy('POLICY_ID', 'DESC'); 
        // }

        if ($request->newFilter != "") {
            foreach ($newSearch[0] as $keyId => $searchValue) {
                if ($keyId === 'COMPANY_ID') {
                    if ($searchValue != "") {
                        $query->where('m.COMPANY_ID', '=', $searchValue);
                    }                        
                }elseif ($keyId === 'YEAR') {
                    if ($searchValue != "") {
                        $query->where(DB::raw('year(m.REQUEST_DATE)'), '=', $searchValue);
                    }                        
                }elseif ($keyId === 'MONTH'){
                    if ($searchValue != "") {
                        $query->where(DB::raw('month(m.REQUEST_DATE)'), '=', $searchValue);
                    }
                }
            }
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        
        return $data;
    }

    public function approveMedical(Request $request)
    {
        // dd($request);
        DB::transaction(function () use ($request) {     

            $medicalId = $request->MEDICAL_ID;

            // update di tabel t_medical
            TMedical::where('MEDICAL_ID', $medicalId)
                ->update([
                'STATUS'        => 1,
                'UPDATED_BY'    => Auth::user()->id,
                'UPDATED_DATE'  => now()
            ]);

            // update di tabel t_medical_detail
            if ($request->detail) {
                MMedicalDetail::where('MEDICAL_ID', $medicalId)->delete();
                foreach ($request->detail as $key => $value) {
                    MMedicalDetail::insert([
                        'MEDICAL_ID'        => $medicalId,
                        'AMOUNT'            => $value['AMOUNT'],
                        'DESCRIPTION'       => $value['DESCRIPTION'],
                        'NOTE_APPROVAL'     => $value['NOTE_APPROVAL'],
                    ]);
                }
            }


        }); 
        
        return new JsonResponse([
            "msg" => "Success Approve Medical"
        ], 201, [
            'X-Inertia' => true
        ]);
       
    }

    function rejectMedical(Request $request) {
        // dd($request->data);
        $status = DB::transaction(function () use ($request) {     

            $data = $request->data;
            $medicalId = $data['MEDICAL_ID'];

            // update di tabel t_medical
            $medical =TMedical::where('MEDICAL_ID', $medicalId)
                ->update([
                'STATUS'        => 0,
                'UPDATED_BY'    => Auth::user()->id,
                'UPDATED_DATE'  => now()
            ]);

            // update di tabel t_medical_detail
            if ($data['detail']) {
                MMedicalDetail::where('MEDICAL_ID', $medicalId)->delete();
                foreach ($data['detail'] as $key => $value) {
                    MMedicalDetail::insert([
                        'MEDICAL_ID'        => $medicalId,
                        'AMOUNT'            => $value['AMOUNT'],
                        'DESCRIPTION'       => $value['DESCRIPTION'],
                        'NOTE_APPROVAL'     => $value['NOTE_APPROVAL'],
                    ]);
                }
            }

            return $medical;

        }); 

        return new JsonResponse([
            'status' => $status,
            "msg" => "Success Reject Medical"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    function getSalaryByEmployee($employeeId= null) {
        $query = DB::table('m_employee_basic_salary AS ebs')
                ->leftJoin('t_basic_salary AS bs', 'ebs.basic_salary_id', '=', 'bs.salaryBasicId')
                ->where('ebs.employee_id', $employeeId)->first();
        return response()->json($query);
    }

    function getMedicalByEmployee($employeeId = null) {
        $query = DB::table('t_medical AS m')
                ->select(DB::raw(' m.*, SUM(md.AMOUNT) AS AMOUNT'))
                ->leftJoin('m_medical_detail AS md', 'm.MEDICAL_ID', '=', 'md.MEDICAL_ID')
                ->where('m.EMPLOYEE_ID', $employeeId)
                ->where('m.STATUS', '<>', '0')
                ->where('m.MEDICAL_TYPE', 1)
                ->groupBy('m.EMPLOYEE_ID')->first();
        return response()->json($query);
    }

}
