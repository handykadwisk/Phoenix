<?php

namespace App\Http\Controllers;

use App\Models\TJobDescCompany;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TJobDescCompanyController extends Controller
{

    public function getJobDescData($request)
    {

        // dd(json_decode($request->newFilter, true));
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = TJobDescCompany::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);
        $query->where('COMPANY_ID', $request->id);
        // dd($newSearch[0]);
        
        
        if ($sortModel) {
            $sortModel = explode(';', $sortModel); 
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection); 
            }
        }
        // dd($newSearch[0]['COMPANY_TYPE_ID']['value']);

        // if ($request->newFilter !== "") {
        //     if ($newSearch[0]["flag"] !== "") {
        //         $query->where('COMPANY_ORGANIZATION_NAME', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
        //     }else{
        //         foreach ($newSearch[0] as $keyId => $searchValue) {
        //             if ($keyId === 'COMPANY_ORGANIZATION_NAME') {
        //                 $query->where('COMPANY_ORGANIZATION_NAME', 'LIKE', '%' . $searchValue . '%');
        //             }elseif ($keyId === 'COMPANY_TYPE_ID'){
        //                 if (!isset($searchValue['value'])) {
        //                     $valueTypeId = $searchValue;
        //                 }else{
        //                     $valueTypeId = $searchValue['value'];
        //                 }
        //                 // dd($searchValue);
        //                 $query->whereHas('mRelationType', function($q) use($valueTypeId) {
        //                     // Query the name field in status table
        //                     $q->where('COMPANY_TYPE_ID', 'like', '%'.$valueTypeId.'%');
        //                 });
        //             }
        //         }
        //     }
        // }
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    public function getJobDescCompanyJson(Request $request)
    {
        $data = $this->getJobDescData($request);
        // print_r($data);
        // die;
        return response()->json($data);
    }

    // get Office by relation id
    public function getJobDescCompanyCombo(Request $request){
        $data = DB::select('call sp_combo_company_job_desc(?)', [$request->id]);
        return response()->json($data);
    }

    // add Store Job Desc
    public function store(Request $request){
        // dd($request);

        // jika parent kosong = 0
        $parentID = 0;
        if ($request->COMPANY_JOBDESC_PARENT_ID != null || $request->COMPANY_JOBDESC_PARENT_ID != "") {
            $parentID = $request->COMPANY_JOBDESC_PARENT_ID;
        }

        // add store t_job_desc
        $jobDesc = TJobDescCompany::create([
            "COMPANY_JOBDESC_NAME"             => $request->COMPANY_NAME." ".$request->COMPANY_JOBDESC_ALIAS,
            "COMPANY_JOBDESC_ALIAS"            => $request->COMPANY_JOBDESC_ALIAS,
            "COMPANY_JOBDESC_DESCRIPTION"      => $request->COMPANY_JOBDESC_DESCRIPTION,
            "COMPANY_JOBDESC_PARENT_ID"        => $parentID,
            "COMPANY_ID"                       => $request->COMPANY_ID,
            "COMPANY_JOBDESC_CREATED_BY"       => Auth::user()->id,
            "COMPANY_JOBDESC_CREATED_DATE"     => now(),
        ]);

        if ($jobDesc) {
            DB::select('call sp_set_mapping_company_job_desc(?)', [$request->COMPANY_ID]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Job Desc Company).",
                "module"      => "Job Desc Company",
                "id"          => $jobDesc->COMPANY_JOBDESC_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $jobDesc->COMPANY_JOBDESC_ID,
            $jobDesc->COMPANY_JOBDESC_ALIAS,
            "Company Job Desc Add Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    // get Detail JobDesc
    public function get_detail(Request $request){

        $data = TJobDescCompany::with('toCompany')->with('parent')->find($request->id);
        return response()->json($data);
    }

    // edit store t_job_desc
    public function edit(Request $request){
        // jika parent kosong = 0
        $parentID = 0;
        if ($request->COMPANY_JOBDESC_PARENT_ID != null || $request->COMPANY_JOBDESC_PARENT_ID != "") {
            $parentID = $request->COMPANY_JOBDESC_PARENT_ID;
        }

        // add store t_job_desc
        $jobDesc = TJobDescCompany::where('COMPANY_JOBDESC_ID', $request->COMPANY_JOBDESC_ID)
        ->update([
            "COMPANY_JOBDESC_NAME"             => $request->COMPANY_NAME." ".$request->COMPANY_JOBDESC_ALIAS,
            "COMPANY_JOBDESC_ALIAS"            => $request->COMPANY_JOBDESC_ALIAS,
            "COMPANY_JOBDESC_DESCRIPTION"      => $request->COMPANY_JOBDESC_DESCRIPTION,
            "COMPANY_JOBDESC_PARENT_ID"        => $parentID,
            "COMPANY_ID"                       => $request->COMPANY_ID,
            "COMPANY_JOBDESC_CREATED_BY"       => Auth::user()->id,
            "COMPANY_JOBDESC_CREATED_DATE"     => now(),
        ]);

        if ($jobDesc) {
            DB::select('call sp_set_mapping_company_job_desc(?)', [$request->COMPANY_ID]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Updated (Job Desc Company).",
                "module"      => "Job Desc Company",
                "id"          => $request->COMPANY_JOBDESC_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $request->COMPANY_JOBDESC_ID,
            $request->COMPANY_JOBDESC_ALIAS,
            "Company Job Desc Edit Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
