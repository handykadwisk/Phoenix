<?php

namespace App\Http\Controllers;

use App\Models\TJobDesc;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TJobDescController extends Controller
{
    public function getJobDescData($dataPerPage = 5, $searchQuery = null)
    {

        // dd($searchQuery->RELATION_ORGANIZATION_NAME);
        $data = TJobDesc::where('RELATION_ORGANIZATION_ID', $searchQuery->idRelation)
        ->orderBy('RELATION_JOBDESC_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('RELATION_JOBDESC_ALIAS')) {
                    $data->where('RELATION_JOBDESC_ALIAS', 'like', '%'.$searchQuery->RELATION_JOBDESC_ALIAS.'%');
            }
        } 
        // dd($data->toSql());
        return $data->paginate($dataPerPage);
    }

    public function getJobDescJson(Request $request)
    {
        $data = $this->getJobDescData(5, $request);
        // print_r($data);
        // die;
        return response()->json($data);
    }

    // get Office by relation id
    public function getJobDescCombo(Request $request){
        $data = DB::select('call sp_combo_relation_job_desc(?)', [$request->id]);
        return response()->json($data);
    }

    // add Store Job Desc
    public function store(Request $request){
        // dd($request);

        // jika parent kosong = 0
        $parentID = 0;
        if ($request->RELATION_JOBDESC_PARENT_ID != null || $request->RELATION_JOBDESC_PARENT_ID != "") {
            $parentID = $request->RELATION_JOBDESC_PARENT_ID;
        }

        // add store t_job_desc
        $jobDesc = TJobDesc::create([
            "RELATION_JOBDESC_NAME"             => $request->RELATION_ORGANIZATION_ALIAS." ".$request->RELATION_JOBDESC_ALIAS,
            "RELATION_JOBDESC_ALIAS"            => $request->RELATION_JOBDESC_ALIAS,
            "RELATION_JOBDESC_DESCRIPTION"      => $request->RELATION_JOBDESC_DESCRIPTION,
            "RELATION_JOBDESC_PARENT_ID"        => $parentID,
            "RELATION_ORGANIZATION_ID"          => $request->RELATION_ORGANIZATION_ID,
            "RELATION_JOBDESC_CREATED_BY"       => Auth::user()->id,
            "RELATION_JOBDESC_CREATED_DATE"     => now(),
        ]);

        if ($jobDesc) {
            DB::select('call sp_combo_relation_job_desc(?)', [$request->RELATION_ORGANIZATION_ID]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Job Desc).",
                "module"      => "Job Desc",
                "id"          => $jobDesc->RELATION_JOBDESC_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);


        return new JsonResponse([
            $jobDesc->RELATION_JOBDESC_ID,
            $jobDesc->RELATION_JOBDESC_ALIAS,
            "Relation Job Desc Added"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    // get Detail JobDesc
    public function get_detail(Request $request){

        $data = TJobDesc::with('toRelation')->with('parent')->find($request->id);
        return response()->json($data);
    }

    // edit store t_job_desc
    public function edit(Request $request){
        // jika parent kosong = 0
        $parentID = 0;
        if ($request->RELATION_JOBDESC_PARENT_ID != null || $request->RELATION_JOBDESC_PARENT_ID != "") {
            $parentID = $request->RELATION_JOBDESC_PARENT_ID;
        }

        // add store t_job_desc
        $jobDesc = TJobDesc::where('RELATION_JOBDESC_ID', $request->RELATION_JOBDESC_ID)
        ->update([
            "RELATION_JOBDESC_NAME"             => $request->RELATION_ORGANIZATION_ALIAS." ".$request->RELATION_JOBDESC_ALIAS,
            "RELATION_JOBDESC_ALIAS"            => $request->RELATION_JOBDESC_ALIAS,
            "RELATION_JOBDESC_DESCRIPTION"      => $request->RELATION_JOBDESC_DESCRIPTION,
            "RELATION_JOBDESC_PARENT_ID"        => $parentID,
            "RELATION_ORGANIZATION_ID"          => $request->RELATION_ORGANIZATION_ID,
            "RELATION_JOBDESC_CREATED_BY"       => Auth::user()->id,
            "RELATION_JOBDESC_CREATED_DATE"     => now(),
        ]);

        if ($jobDesc) {
            DB::select('call sp_combo_relation_job_desc(?)', [$request->RELATION_ORGANIZATION_ID]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Updated (Job Desc).",
                "module"      => "Job Desc",
                "id"          => $request->RELATION_JOBDESC_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);


        return new JsonResponse([
            $request->RELATION_JOBDESC_ID,
            $request->RELATION_JOBDESC_ALIAS,
            "Relation Job Desc Edited"
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
