<?php

namespace App\Http\Controllers;

use App\Models\TPermission;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Inertia\Inertia;

class TPermissionController extends Controller
{
    public function index(){
        return Inertia::render('ACLPermission/ACLPermission', [
        ]);
    }

    // Get Data Paginate and Search
    public function getPermissionData($dataPerPage = 5, $searchQuery = null){

        $data = TPermission::orderBy('PERMISSION_ID', 'DESC');
        if ($searchQuery) {
            if ($searchQuery->input('PERMISSION_NAME')) {
                    $data->where('PERMISSION_NAME', 'like', '%'.$searchQuery->PERMISSION_NAME.'%');
            }
        } 
        // dd($data->toSql());
        return $data->paginate($dataPerPage);
    }

    // Get Data Permission
    public function getPermissionJson(Request $request){
        $data = $this->getPermissionData(5, $request);
        
        return response()->json($data);
    }

    // add Store t_permission
    public function store(Request $request){
        // dd($request);

        // add store t_permission
        $permission = TPermission::create([
            "PERMISSION_NAME"           => $request->PERMISSION_NAME,
            "PERMISSION_CLASS_NAME"     => $request->PERMISSION_CLASS_NAME,
            "PERMISSION_CREATED_BY"     => Auth::user()->id,
            "PERMISSION_CREATED_DATE"   => now(),
        ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Permission).",
                "module"      => "Permission",
                "id"          => $permission->PERMISSION_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $permission->PERMISSION_ID,
            $permission->PERMISSION_NAME
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_detail(Request $request){
        $data = TPermission::find($request->idPermission);

        return response()->json($data);
    }

    // edit store t_permission
    public function edit(Request $request){
        $permission = TPermission::where('PERMISSION_ID', $request->PERMISSION_ID)
        ->update([
            "PERMISSION_NAME"           => $request->PERMISSION_NAME,
            "PERMISSION_CLASS_NAME"     => $request->PERMISSION_CLASS_NAME,
            "PERMISSION_UPDATED_BY"     => Auth::user()->id,
            "PERMISSION_UPDATED_DATE"   => now(),
        ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Updated (Permission).",
                "module"      => "Permission",
                "id"          => $request->PERMISSION_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $request->PERMISSION_ID,
            $request->PERMISSION_NAME
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
