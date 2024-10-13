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

    public function getUserData($request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        // $query = User::with('roles', 'type');
        $query = User::query()->with('roles', 'type');

        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newFilter = $request->input('newFilter', '');
        $newSearch = json_decode($request->newFilter, true);

        if ($sortModel) {
            $sortModel = explode(';', $sortModel); 
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection); 
            }
        }

        if ($filterModel) {
            foreach ($filterModel as $colId => $filterValue) {
                if ($colId === 'name') {
                    $query->where('first_name', 'LIKE', '%' . $filterValue . '%')
                    ->orWhere('last_name', 'LIKE', '%' . $filterValue . '%');
                } else {
                    $query->where($colId, 'LIKE', '%' . $filterValue . '%');
                }
            }
        }
         // Jika ada filter 'newFilter' dan tidak kosong
         if ($newFilter !== "") {
            foreach ($newSearch as $search) {
            foreach ($search as $keyId => $searchValue) {
                // Pencarian berdasarkan nama menu
                if ($keyId === 'name') {
                $query->where('name', 'LIKE', '%' . $searchValue . '%');
                }
            }
            }
        }
        if (!$sortModel && !$filterModel) {
            $query->orderBy('id', 'desc');
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    public function getUserJson(Request $request)
    {
        // dd($request);
        $data = $this->getUserData($request);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        // dd($request);
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

        $name = $request->name;
        if($name === null || $name === ''){
            $name = $request->user_login;
        }
        $User = User::create([  
            "role_id" => 0,
            "name" => $name,  // Tambahkan name di sini
            'employee_id'=>$request->employee_id,
            'company_division_id'=>$request->company_division_id,
            'individual_relation_id'=>$request->individual_relations_id,
            "user_login" => $request->user_login,
            "user_type_id" => $request->type,
            'jobpost_id'=>$request->jobpost,
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
            'New user added.'
        ], 201, [
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
        $users = User::with('roles', 'type','jobpost')->where('id', $id)->first();
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
        $User = User::find($id);
        $typeInput = collect($request->input('type'))->first();

        $User->update([
            'individual_relation_id'=>$request->individual_relation_id,
            "user_status" => $request->user_status,
            'company_division_id'=>$request->company_division_id,
            "name" => $request->name,
            "email" => $request->email,
            "user_login" => $request->user_login,
            "employee_id" => $request->employee_id,
            "user_type_id" => $typeInput,
            'jobpost_id'=>$request->jobpost,
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
        return new JsonResponse([
            'User has been updated.'
        ], 200, [
            'X-Inertia' => true
        ]);
    }


    public function resetPassword(Request $request, $id)
    {
        $User = User::find($id);
        $User->update([
            "password" => bcrypt($request->password),
            "USER_UPDATED_BY" => Auth::user()->id,
            "USER_UPDATED_DATE" => now()
        ]);
        return new JsonResponse([
            // 'Policy updated.'
            'Password has been reset.'
        ], 200, [
            'X-Inertia' => true
        ]);
    }

    public function getAllUser()
    {
        $users = User::all();
        return response()->json($users);
    }
}
