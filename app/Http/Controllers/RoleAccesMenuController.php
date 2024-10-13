<?php

namespace App\Http\Controllers;

use App\Models\RoleAccessMenu;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RoleAccesMenuController extends Controller
{
    //get menu by role id
    public function getAccessMenuByRoleId($role_id)
    {
        $data = RoleAccessMenu::with('menu')->where('role_id', $role_id)->get();
        // Log::info($data);
        return response()->json($data);
    }
    public function store(Request $request)
    {
        $data = [];

        $requests = $request->all();
        // Jika hanya role_id yang dikirim (tanpa menu_id), hapus semua data yang terkait dengan role_id
        if (count($requests) === 1 && isset($requests[0]['role_id']) && !isset($requests[0]['menu_id'])) {
            RoleAccessMenu::where('role_id', $requests[0]['role_id'])->delete();

            // Membuat log pengguna
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Cleared Access Menu for Role",
                    "module"      => "ACL - Role Access Menu",
                    "id"          => $requests[0]['role_id']
                ]),
                'action_by'  => Auth::user()->user_login
            ]);

            return new JsonResponse([
                'Access menu cleared for the role.'
            ], 200, [
                'X-Inertia' => true
            ]);
        }
        // dd($request);


        foreach ($requests as $req) {
            $data[] = [
                'menu_id' => $req['menu_id'],
                'role_id' => $req['role_id']
            ];
        }

        // check existing menu_id in role_id, if exists, delete first
        $existingData = RoleAccessMenu::where('role_id', $req['role_id'])->get();

        if ($existingData->count() > 0) {
            RoleAccessMenu::where('role_id', $req['role_id'])->delete();
        }

        RoleAccessMenu::insert($data);

        //creating user log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Set Access Menu to Role",
                "module"      => "ACL - Role Access Menu",
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

    public function addAccessMenu($id, Request $request)
    {
        $data = [];

        if (empty($request->all()) || $request->all() === null) {
            RoleAccessMenu::where('role_id', $id)->delete();

            // Membuat log pengguna
            UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Cleared Access Menu for Role",
                "module"      => "ACL - Role Access Menu",
                "id"          => $id
            ]),
            'action_by'  => Auth::user()->user_login
            ]);

            return new JsonResponse([
            'Access menu cleared for the role.'
            ], 200, [
            'X-Inertia' => true
            ]);
        }
        
        $existingData = RoleAccessMenu::where('role_id', $id)->get();

        if ($existingData->count() > 0) {
            RoleAccessMenu::where('role_id', $id)->delete();
        }

        $requests = $request->all();
        foreach ($requests as $req) {
            $data[] = [
                'menu_id' => $req['menu_id'],
                'role_id' => $id
            ];
        }

        RoleAccessMenu::insert($data);

        //creating user log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Added Access Menu to Role",
                "module"      => "ACL - Role Access Menu",
                "id"          => $id
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            'Access menu added.'
        ], 200, [
            'X-Inertia' => true
        ]);
    }
}
