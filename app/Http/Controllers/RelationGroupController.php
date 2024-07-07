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
use Inertia\Inertia;

class RelationGroupController extends Controller
{

    public function getRelationGroupData($dataPerPage = 2, $searchQuery = null)
    {
        $data = RelationGroup::orderBy('RELATION_GROUP_ID', 'desc');
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

        // tolower
        $nameGroup = strtolower($request->RELATION_GROUP_NAME);

        // Created Relation
        $group = RelationGroup::create([
            'RELATION_GROUP_NAME' => ucwords($nameGroup),
            'RELATION_GROUP_DESCRIPTION' => $request->RELATION_GROUP_DESCRIPTION,
            'RELATION_GROUP_CREATED_BY' => Auth::user()->id,
            'RELATION_GROUP_CREATED_DATE' => now(),

        ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Group).",
                "module"      => "Group",
                "id"          => $group->RELATION_GROUP_NAME
            ]),
            'action_by'  => Auth::user()->email
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
        $detailRelation = RelationGroup::with('rGroup')->find($request->id);
        // print_r($detailRelation);die;
        return response()->json($detailRelation);
    }

    public function get_group(Request $request){
        
        $getGroup = RelationGroup::where("RELATION_GROUP_ID",$request->idGroup)->get();
        // dd($getGroup);
        // print_r($detailRelation);die;
        return response()->json($getGroup);
    }
    
}
