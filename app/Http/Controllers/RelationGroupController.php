<?php

namespace App\Http\Controllers;

use App\Models\MRelationType;
use App\Models\Relation;
use App\Models\RelationGroup;
use App\Models\RelationLob;
use App\Models\RelationProfession;
use App\Models\RelationStatus;
use App\Models\RelationType;
use App\Models\Salutation;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RelationGroupController extends Controller
{

    public function getRelationGroupData($dataPerPage = 2, $searchQuery = null)
    {
        $data = RelationGroup::orderBy('RELATION_GROUP_ID', 'desc')->where('RELATION_GROUP_PARENT', 0);
        if ($searchQuery) {
            if ($searchQuery->input('RELATION_GROUP_NAME')) {
                $data->where('RELATION_GROUP_NAME', 'like', '%'.$searchQuery->RELATION_GROUP_NAME.'%');
            }
        } 

        return $data->paginate($dataPerPage);
    }

    public function getRelationGroupJson(Request $request){
        $data = $this->getRelationGroupData(5, $request);
        return response()->json($data);
    }

    // Get All Relation Type 
    public function getAllRelatioType()
    {
        $relationType = RelationType::get();

        return $relationType;
    }

    public function index()
    {
        // call data relation group
        $relationGroup = RelationGroup::get();
        // call data relation lob
        $relationLob = RelationLob::get();
        // call data relation type
        $relationTypeAll = $this->getAllRelatioType();
        // call data salutation
        $salutation = Salutation::get();
        // call data relation status
        $relationStatus = RelationStatus::get();
        // call mapping relation Type
        $mRelationType = MRelationType::get();

        // cal profession
        $profession = RelationProfession::get();

        return Inertia::render('Group/Group', [
            'relationType' => $relationTypeAll,
            'relationLOB' => $relationLob,
            'salutation' => $salutation,
            'relationStatus' => $relationStatus,
            'relationGroup' => $relationGroup,
            'mRelationType' => $mRelationType,
            'profession'   => $profession
        ]);
    }

    public function store(Request $request){
        // dd($request);
        // toupper
        $nameGroup = strtoupper($request->RELATION_GROUP_NAME);

        // Cek Relation Perent Id
        if ($request->RELATION_GROUP_PARENT == '' || $request->RELATION_GROUP_PARENT == NULL) {
            $parentID = "0";
        }else{
            $parentID = $request->RELATION_GROUP_PARENT['value'];
        }


        // Created Relation
        $group = RelationGroup::create([
            'RELATION_GROUP_NAME' => $nameGroup,
            'RELATION_GROUP_PARENT' => $parentID,
            'RELATION_GROUP_DESCRIPTION' => $request->RELATION_GROUP_DESCRIPTION,
            'RELATION_GROUP_CREATED_BY' => Auth::user()->id,
            'RELATION_GROUP_CREATED_DATE' => now(),

        ]);


        // Mapping Parent Id and Update
        $name = NULL;
        DB::select('call sp_set_mapping_relation_group(?)', [$name]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Group).",
                "module"      => "Group",
                "id"          => $group->RELATION_GROUP_NAME
            ]),
            'action_by'  => Auth::user()->user_login
        ]);


        return new JsonResponse([
            $group->RELATION_GROUP_ID,
            $group->RELATION_GROUP_NAME
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getRelationByIdGroup(Request $request)
    {
        $data = Relation::where('RELATION_ORGANIZATION_GROUP', 'like', '%' . $request->id . '%')->get();
        return response()->json($data);
    }

    public function getGroupById($id){
        $data = RelationGroup::find($id);
        return response()->json($data);
    }

    public function detailGroup($id)
    {
        $test = 'aaa';
        $relationGroup = RelationGroup::find($id);
        // print_r($relationGroup);die;


        return Inertia::render('Group/DetailGroup', [
            'test' => $test,
            'relationGroup' => $relationGroup
        ]);
    }

    public function get_detail(Request $request){
        $detailRelation = RelationGroup::where('RELATION_GROUP_ID', $request->id)->get();
        // print_r($detailRelation);die;
        return response()->json($detailRelation);
    }

    public function get_detail_group_parent(Request $request){
        $detailRelation = RelationGroup::find($request->id);
        // print_r($detailRelation);die;
        return response()->json($detailRelation);
    }

    public function get_group(Request $request){
        
        $getGroup = RelationGroup::where("RELATION_GROUP_ID",$request->idGroup)->get();
        // dd($getGroup);
        // print_r($detailRelation);die;
        return response()->json($getGroup);
    }

    public function get_mapping(Request $request)
    {
        $name = NULL;
        $data = DB::select('call sp_combo_relation_group(?)', [$name]);
        return response()->json($data);
    }

    // for add sub group parent
    public function add_subGroup(Request $request){
        // dd($request);
        // toupper
        $nameGroup = strtoupper($request->RELATION_GROUP_NAME);

        // Cek Relation Perent Id
        // if ($request->RELATION_GROUP_PARENT == '' || $request->RELATION_GROUP_PARENT == NULL) {
        //     $parentID = "0";
        // }else{
        //     $parentID = $request->RELATION_GROUP_PARENT['value'];
        // }


        // Created Relation
        $group = RelationGroup::create([
            'RELATION_GROUP_NAME' => $nameGroup,
            'RELATION_GROUP_PARENT' => $request->RELATION_GROUP_PARENT,
            'RELATION_GROUP_DESCRIPTION' => $request->RELATION_GROUP_DESCRIPTION,
            'RELATION_GROUP_CREATED_BY' => Auth::user()->id,
            'RELATION_GROUP_CREATED_DATE' => now(),

        ]);


        // Mapping Parent Id and Update
        $name = NULL;
        DB::select('call sp_set_mapping_relation_group(?)', [$name]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created Sub Group (Group).",
                "module"      => "Group",
                "id"          => $group->RELATION_GROUP_NAME
            ]),
            'action_by'  => Auth::user()->user_login
        ]);


        return new JsonResponse([
            $group->RELATION_GROUP_ID,
            $group->RELATION_GROUP_NAME
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function relation_nogroup(Request $request){
        $clientId = 1;
        $data = Relation::where('RELATION_ORGANIZATION_GROUP', NULL)->whereHas('mRelationType', function($q) use($clientId) {
            // Query the name field in status table
            $q->where('RELATION_TYPE_ID', 'like', '%'.$clientId.'%');
        })->get();

        return response()->json($data);
    }

    public function add_Relation(Request $request){
        // dd($request);
        for ($i=0; $i < sizeof($request->name_relation); $i++) { 
            $nameRelation = trim($request->name_relation[$i]);
            $idGroup = $request->RELATION_ORGANIZATION_GROUP;

            // get id relation from name relation
            $idRelation = Relation::select('RELATION_ORGANIZATION_ID')->where('RELATION_ORGANIZATION_NAME', $nameRelation)->first();
            $idRelationNew = $idRelation['RELATION_ORGANIZATION_ID'];

            // add Store M Relation Agent
            $mRelationAgent = Relation::where('RELATION_ORGANIZATION_ID', $idRelationNew)->update([
                "RELATION_ORGANIZATION_GROUP" => $idGroup,
            ]);

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Add Relation (Group).",
                    "module"      => "Group",
                    "id"          => $idRelationNew
                ]),
                'action_by'  => Auth::user()->user_login
            ]);
        }
        return new JsonResponse([
            $request->idAgent,
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function relation_change(Request $request){
        $data = Relation::find($request->idRelation);

        return response()->json($data);
    }

    public function subGroupById(Request $request){
        $data = RelationGroup::where('RELATION_GROUP_MAPPING', 'like', '%' . $request->idGroup .".". '%')->get();

        return response()->json($data);
    }

    public function changeSubGroup(Request $request){
        $changeSubgroup = Relation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->update([
            "RELATION_ORGANIZATION_GROUP" => $request->RELATION_ORGANIZATION_GROUP['value'],
        ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Change Sub Group (Group).",
                "module"      => "Group",
                "id"          => $request->RELATION_ORGANIZATION_GROUP
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->RELATION_ORGANIZATION_GROUP,
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function remove_relation(Request $request){
        $removeRelationFromGroup = Relation::where('RELATION_ORGANIZATION_ID', $request->idRelation)->update([
            "RELATION_ORGANIZATION_GROUP" => NULL,
        ]);

        return new JsonResponse([
            $request->RELATION_ORGANIZATION_GROUP,
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function edit_subgroup(Request $request){
        
        $updateGroup = RelationGroup::where('RELATION_GROUP_ID', $request->RELATION_GROUP_ID)->update([
            "RELATION_GROUP_NAME"           => $request->RELATION_GROUP_NAME,
            "RELATION_GROUP_DESCRIPTION"    => $request->RELATION_GROUP_DESCRIPTION,
            "RELATION_GROUP_UPDATED_BY"     => Auth::user()->id,
            "RELATION_GROUP_UPDATED_DATE"   => now()
        ]);

        // Created Log
        if ($updateGroup) {
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Edit Group (Group).",
                    "module"      => "Group",
                    "id"          => $request->RELATION_GROUP_ID
                ]),
                'action_by'  => Auth::user()->user_login
            ]);
        }

        return new JsonResponse([
            $request->RELATION_GROUP_ID,
            $request->RELATION_GROUP_NAME
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function change_parent(Request $request)
    {
        // Cari relasi parent berdasarkan ID grup relasi yang diterima dari request
        $relationParent = RelationGroup::find($request->RELATION_GROUP_ID);
    
        // Ambil ID parent dari relasi yang ditemukan
        $parentId = $relationParent->RELATION_GROUP_PARENT;
    
        // Buat string untuk mengecek apakah ID sudah termasuk dalam mapping (concatenation ID)
        $concatID = "." . $request->RELATION_GROUP_ID . '.';
    
        // Cek apakah parent baru yang diinginkan sudah ada dalam mapping
        $cekExisting = RelationGroup::where('RELATION_GROUP_ID', $request->RELATION_GROUP_PARENT['value'])
            ->where('RELATION_GROUP_MAPPING', 'like', '%' . $concatID . '%')
            ->get();
    
        // Jika parent ID yang baru ada di dalam mapping, lakukan pembaruan parent
        if ($cekExisting->count() > 0) {
            // Update parent ID untuk relasi grup yang baru
            $updateGroup = RelationGroup::where('RELATION_GROUP_ID', $request->RELATION_GROUP_PARENT)
                ->update([
                    'RELATION_GROUP_PARENT' => $parentId,
                ]);
    
            // Update parent ID untuk relasi grup yang diubah
            RelationGroup::where('RELATION_GROUP_ID', $request->RELATION_GROUP_ID)
                ->update([
                    'RELATION_GROUP_PARENT' => $request->RELATION_GROUP_PARENT['value'],
                ]);
    
            // Jalankan stored procedure untuk memperbarui mapping relasi grup
            $name = NULL;
            DB::select('call sp_set_mapping_relation_group(?)', [$name]);
                
        } else {
            // Jika parent baru tidak ada dalam mapping, langsung update parent ID yang baru
            $updateGroup = RelationGroup::where('RELATION_GROUP_ID', $request->RELATION_GROUP_ID)
                ->update([
                    'RELATION_GROUP_PARENT' => $request->RELATION_GROUP_PARENT['value'],
                ]);
    
            // Jalankan stored procedure untuk memperbarui mapping relasi grup
            $name = NULL;
            DB::select('call sp_set_mapping_relation_group(?)', [$name]);
        }
    
        // Jika pembaruan parent ID berhasil, log aktivitas user
        if ($updateGroup) {
            UserLog::create([
                'created_by' => Auth::user()->id,  // User yang melakukan perubahan
                'action' => json_encode([          // Informasi aksi yang dilakukan
                    "description" => "Edit Group (Group).",
                    "module" => "Group",
                    "id" => $request->RELATION_GROUP_ID
                ]),
                'action_by' => Auth::user()->user_login
            ]);
        }
    
        // Return response JSON dengan status 201 (Created) dan ID grup relasi yang diperbarui
        return new JsonResponse([
            $request->RELATION_GROUP_ID,
        ], 201, [
            'X-Inertia' => true // Set header X-Inertia untuk pengelolaan front-end
        ]);
    }
    
    
}
