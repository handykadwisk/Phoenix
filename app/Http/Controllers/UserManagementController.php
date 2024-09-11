<?php

namespace App\Http\Controllers;

use App\Models\MRoleUser;
use App\Models\Role;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserManagementController
extends Controller
{
    //index page USer Management
    public function index()
    {
        return Inertia::render('UserManagement/index', [
            'permission' => User::get()
        ]);
    }

    public function getUserData($dataPerPage = 5, $searchQuery = null)
    {
        // Mulai query
        $dataQuery = User::with('roles', 'type')
            ->orderBy('id', 'DESC');

        // Jika ada search query, tambahkan kondisi where
        if ($searchQuery && $searchQuery->input('name')) {
            $dataQuery->where('name', 'like', '%' . $searchQuery->input('name') . '%');
        }

        // Gunakan paginate untuk mendapatkan hasil dalam bentuk paginated data
        return $dataQuery->paginate($dataPerPage);
    }

    public function getUserJson(Request $request)
    {
        $data = $this->getUserData(5, $request);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        // Log::info($request);
        // Define validation rules
        $rules = [
            'user_login' => 'required|string|unique:t_user,user_login',  // Validasi untuk user_login
        ];

        // Create validator instance
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            return new JsonResponse([
                $validator->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }
        // Log::info(Auth::user()->id);
        // Auth::user()->id;

        $name = $request->has('name') ? $request->input('name') : 'Default Name';
        $User = User::create([  
            "role_id" => 0,
            "name" => $request->user_login,  // Tambahkan name di sini
            'employee_id'=>$request->employee_id,
            'individual_relation_id'=>$request->individual_relation_id,
            // "email" => $request->user_login,
            "user_login" => $request->user_login,
            "user_type_id" => $request->type,
            "password" => bcrypt($request->password),
            "USER_CREATED_BY" => Auth::user()->id,
            "USER_CREATED_DATE" => now()
        ]);

        // Insert roles
        if ($request->has('role')) {
            $roles = $request->input('role');

            foreach ($roles as $roleId) {
                DB::table('m_role_users')->insert([
                    'user_id' => $User->id,
                    'role_id' => $roleId
                ]);
            }
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (User).",
                "module"      => "User Management",
                "id"          => $User->id,
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->id
        ], 200, [
            'X-Inertia' => true
        ]);
    }

    public function getUserDataByMRole()
    {
        $users = User::with('roles')->get();
        return response()->json($users);
    }
    public function getUserDataById($id)
    {
        $users = User::with('roles', 'type')->where('id', $id)->first();
        return response()->json($users);
    }

    public function dataById($id)
    {
        $users = Role::where('id', $id)->first();
        // Log::info($users);
        return response()->json($users);
    }

    // Update User
    public function update(Request $request, $id)
    {
         // Define validation rules
        //  $rules = [
        //     'user_login' => 'required|string|unique:t_user,user_login',  // Validasi untuk user_login
        // ];

        // // Create validator instance
        // $validator = Validator::make($request->all(), $rules);

        // // Check if validation fails
        // if ($validator->fails()) {
        //     return new JsonResponse([
        //         $validator->errors()->all()
        //     ], 422, [
        //         'X-Inertia' => true
        //     ]);
        // }

        Log::info($request);
        $User = User::find($id);
        $typeInput = collect($request->input('type'))->first();

        $User->update([
            "name" => $request->name,
            "email" => $request->email,
            "user_login" => $request->user_login,
            "employee_id" => $request->employee_id,
            "user_type_id" => $typeInput,
            "USER_UPDATED_BY" => Auth::user()->id,
            "USER_UPDATED_DATE" => now()
        ]);

        // Hapus entri di m_role_users jika tipe bukan 2
        if ($typeInput !== 2) {
            DB::table('m_role_users')->where('user_id', $id)->delete();
        }

        // Insert Roles
        if ($typeInput === 2 && $request->has('role')) {
            $roles = $request->input('newRole');
            DB::table('m_role_users')->where('user_id', $id)->delete(); // Menghapus entri lama
            foreach ($roles as $roleId) {
                DB::table('m_role_users')->insert([
                    'user_id' => $id,
                    'role_id' => $roleId
                ]);
            }
        }
    }


    public function resetPassword(Request $request, $id)
    {
        $User = User::find($id);
        // Log::info($request);
        // Log::info($User);
        $User->update([
            "password" => bcrypt($request->password),
            "USER_UPDATED_BY" => Auth::user()->id,
            "USER_UPDATED_DATE" => now()
        ]);
        return new JsonResponse([
            // 'Policy updated.'
            $id
        ], 200, [
            'X-Inertia' => true
        ]);
    }
}
