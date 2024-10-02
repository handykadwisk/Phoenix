<?php

namespace App\Http\Controllers;

use App\Models\TJobpost;
use App\Http\Controllers\Controller;
use App\Models\TCompanyDivision;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TJobpostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render('JobPost/Jobpost');
    }

    // public function getJobpostJson(Request $request)
    // {
    //     $data = $this->getJobpostData($request);
    //     return response()->json($data);
    // }

    // public function getJobpostData($request)
    // {
    //     $page = $request->input('page', 1);
    //     $perPage = $request->input('perPage', 10);

    //     // Join ke tabel t_company_division dan t_company untuk mendapatkan data sesuai divisi dan perusahaan
    //     $query = TJobpost::query()
    //         ->join('t_company_division', 't_company_division.COMPANY_DIVISION_ID', '=', 't_job_posts.company_division_id')
    //         ->join('t_company', 't_company.COMPANY_ID', '=', 't_company_division.COMPANY_ID')
    //         ->orderBy('t_company.COMPANY_NAME', 'asc') // Mengurutkan berdasarkan COMPANY_NAME
    //         ->groupBy('t_company.COMPANY_ID') // Mengelompokkan berdasarkan COMPANY_ID
    //         ->select(
    //             't_company.COMPANY_ID',
    //             't_company.COMPANY_NAME',
    //             DB::raw('COUNT(t_job_posts.jobpost_id) as total_jobposts') // Menghitung jumlah jobpost per perusahaan
    //         );

    //     // dd($query);

    //     // Ambil nilai sort dan filter dari request
    //     $sortModel = $request->input('sort');
    //     $filterModel = json_decode($request->input('filter'), true);
    //     $newFilter = $request->input('newFilter', '');
    //     $newSearch = json_decode($request->newFilter, true);

    //     // Penanganan sorting
    //     if ($sortModel) {
    //         $sortModel = explode(';', $sortModel);
    //         foreach ($sortModel as $sortItem) {
    //             list($colId, $sortDirection) = explode(',', $sortItem);
    //             $query->orderBy($colId, $sortDirection);
    //         }
    //     }

    //     // Jika ada filter 'newFilter' dan tidak kosong
    //     if ($newFilter !== "") {
    //         foreach ($newSearch as $search) {
    //             foreach ($search as $keyId => $searchValue) {
    //                 // Pencarian berdasarkan nama divisi
    //                 if ($keyId === 'COMPANY_DIVISION_NAME') {
    //                     $query->where('t_company_division.COMPANY_DIVISION_NAME', 'LIKE', '%' . $searchValue . '%');
    //                 }
    //                 // Pencarian berdasarkan nama perusahaan
    //                 elseif ($keyId === 'COMPANY_NAME') {
    //                     $query->where('t_company.COMPANY_NAME', 'LIKE', '%' . $searchValue . '%');
    //                 }
    //                 // Pencarian berdasarkan ID jobpost
    //                 elseif ($keyId === 'jobpost_id') {
    //                     if (!isset($searchValue['value'])) {
    //                         $valueTypeId = $searchValue;
    //                     } else {
    //                         $valueTypeId = $searchValue['value'];
    //                     }
    //                     $query->where('t_job_posts.jobpost_id', 'LIKE', '%' . $valueTypeId . '%');
    //                 }
    //             }
    //         }
    //     }

    //     // Pagination dan pengambilan data
    //     $data = $query->paginate($perPage, ['*'], 'page', $page);

    //     // Return hasilnya
    //     return $data;
    // }


    public function getJobpostById($id)
    {

        // Mengambil semua jobpost berdasarkan company_division_id
        $jobposts = TJobpost::with('children')
            ->where('company_division_id', $id)
            ->get();

        // Jika tidak ada jobpost ditemukan
        if ($jobposts->isEmpty()) {
            return response()->json(['message' => 'Jobpost not found'], 404);
        }

        // Fungsi rekursif untuk membangun hierarki jobpost (parent-child)
        function buildTree($jobposts, $parentId = null)
        {
            $tree = [];
            foreach ($jobposts as $jobpost) {
                if ($jobpost->jobpost_parent == $parentId) {
                    // Cari anak dari jobpost ini
                    $children = buildTree($jobposts, $jobpost->jobpost_id);
                    if ($children) {
                        $jobpost->children = $children;
                    }
                    $tree[] = $jobpost;
                }
            }
            return $tree;
        }

        // Bangun tree dari jobpost yang datar
        $tree = buildTree($jobposts);

        // Kembalikan response dengan jobpost yang sudah berstruktur hierarki
        return response()->json($tree);
    }

    public function getAllJobpost()
    {
        $data = TJobpost::with('children')->get();
        return response()->json($data);
    }


    public function getJobpostsByCompany($companyId)
    {
        $jobposts = TJobpost::with('company_division')->has('company_division')->get();
        return response()->json($jobposts);
    }

    public function store(Request $request)
    {
        //
        // dd($request);
        $jobpost = TJobpost::create([
            'jobpost_name' => $request->jobpost_name,
            'jobpost_description' => $request->jobpost_description,
            'jobpost_parent' => $request->jobpost_parent,
            'company_division_id' => $request->company_division_id,
            'jobpost_created_by' => Auth::user()->id,
            'jobpost_created_date' => now(),
        ]);
        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Job Post).",
                "module"      => "Job Post",
                "id"          => $jobpost->jobpost_id,
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'New Job Post added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getJobpostId($id)
    {
        $jobpost = TJobpost::find($id);
        return response()->json($jobpost);
    }

    public function getDevJobpost()
    {
        $jobposts = TCompanyDivision::with('jobposts')->get();
        return response()->json($jobposts);
    }


    public function setJobpostStatus($id, $status)
    {
        $jobpost = TJobpost::find($id);

        if ($jobpost) {
            $jobpost->jobpost_status = $status;
            $jobpost->save();

            return new JsonResponse([
                'Set Status Job Post Success.'
            ], 201, [
                'X-Inertia' => true
            ]);
            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Updated (Job Post Status).",
                    "module"      => "Job Post",
                    "id"          => $jobpost->jobpost_id,
                ]),
                'action_by'  => Auth::user()->user_login
            ]);
        }

        return new JsonResponse([
            'Jobpost not found.'
        ], 404, [
            'X-Inertia' => true
        ]);
    }

    public function getDevJobpostById($id)
    {
        $jobpost = TJobpost::with('company_division')->where('jobpost_id', $id)->get();
        return response()->json($jobpost);
    }
    /**
     * Display the specified resource.
     */
    public function show(TJobpost $tJobpost)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
        $jobpost = TJobpost::find($request->jobpost_id);

        if (!$jobpost) {
            return response()->json(['Jobpost not found'], 404);
        }

        $changes = [];
        $fields = ['jobpost_name', 'jobpost_description', 'jobpost_parent', 'company_division_id'];

        foreach ($fields as $field) {
            if ($jobpost->$field !== $request->$field) {
                $changes[$field] = [
                    'old' => $jobpost->$field,
                    'new' => $request->$field
                ];
                $jobpost->$field = $request->$field;
            }
        }
        // Update the jobpost with new values
        $jobpost->save();
        if (!empty($changes)) {
            $jobpost->jobpost_updated_by = Auth::user()->id;
            $jobpost->jobpost_updated_date = now();
            $jobpost->save();

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Updated (Job Post).",
                    "module"      => "Job Post",
                    "id"          => $jobpost->jobpost_id,
                    "changes"     => $changes
                ]),
                'action_by'  => Auth::user()->user_login
            ]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Viewed (Edit Job Post).",
                "module"      => "Job Post",
                "id"          => $jobpost->jobpost_id,
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'Jobpost Edit Successfully'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

  
}
