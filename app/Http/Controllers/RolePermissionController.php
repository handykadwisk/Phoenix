<?php

namespace App\Http\Controllers;

use App\Models\RolePermission;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RolePermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function getPermissionByRoleId($role_id) {
        $data = RolePermission::where('role_id', $role_id)->get();
        return response()->json($data);
    }
    public function index()
    {
        //
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $data = [];
        
        $requests = $request->all();
        if (!$request) {
            # code...
        }
        foreach ($requests as $req) {
            $data[] = [
                'permission_id' => $req['permission_id'],
                'role_id'       => $req['role_id']
            ];
        }

        // check existing permission in role_id, if exists, delete first
        $existingData = RolePermission::where('role_id', $req['role_id'])->get();

        if ($existingData->count() > 0) {
            RolePermission::where('role_id', $req['role_id'])->delete();
        }

        RolePermission::insert($data);

        // creating user log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Set Access Permission to Role",
                "module"      => "ACL - Role Permission",
                "id"          => $req['role_id']
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'New mapping created.'
        ], 200, [
            'X-Inertia' => true
        ]);
    
    }

    /**
     * Display the specified resource.
     */
    public function show(RolePermission $rolePermission)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RolePermission $rolePermission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RolePermission $rolePermission)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RolePermission $rolePermission)
    {
        //
    }
}
