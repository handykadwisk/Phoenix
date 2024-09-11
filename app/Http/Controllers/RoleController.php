<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\TPermission;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('ACLRole/ACLRole', [
            'permission' => TPermission::get()
        ]);
    }

    public function getRole()
    {
        // $data = Role::get();
        $data = Role::get();
        return response()->json($data);
    }

    public function getRoleData($dataPerPage = 5, $searchQuery = null)
    {

        $data = Role::orderBy('id', 'DESC');
        if ($searchQuery) {
            if ($searchQuery->input('role_name')) {
                $data->where('role_name', 'like', '%' . $searchQuery->role_name . '%');
            }
        }
        // dd($data->toSql());
        return $data->paginate($dataPerPage);
    }

    public function getRoleJson(Request $request)
    {
        $data = $this->getRoleData(5, $request);

        return response()->json($data);
    }

    // add store t_role
    public function store(Request $request)
    {

        $Role = Role::create([
            "role_name"             => $request->role_name,
            "ROLE_CREATED_BY"       => Auth::user()->id,
            "ROLE_CREATED_DATE"     => now()
        ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Role).",
                "module"      => "Role",
                "id"          => $Role->id
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $Role->id,
            $Role->role_name
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getDetail(Request $request)
    {
        $data = Role::find($request->idRole);
        // Log::info($data);
        return response()->json($data);
    }
}
