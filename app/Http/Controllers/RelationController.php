<?php

namespace App\Http\Controllers;

use App\Models\MRelationType;
use App\Models\MTag;
use App\Models\Relation;
use App\Models\RelationGroup;
use App\Models\RelationLob;
use App\Models\RelationStatus;
use App\Models\RelationType;
use App\Models\Salutation;
use App\Models\Tag;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use RealRashid\SweetAlert\Facades\Alert as FacadesAlert;

class RelationController extends Controller
{
    public function getOldRelation($id)
    {
        $oldRelation = Relation::where('RELATION_ORGANIZATION_ID', $id)->get();
        return $oldRelation;
    }

    public function getRelationData($dataPerPage = 2)
    {

        return Relation::orderBy('RELATION_ORGANIZATION_ID', 'asc')
            // ->where('RELATION_ORGANIZATION_PARENT_ID', "0")
            ->paginate($dataPerPage);
    }

    // Get All Relation Type 
    public function getAllRelatioType()
    {
        $relationType = RelationType::get();

        return $relationType;
    }


    public function getRelationJson()
    {
        $data = $this->getRelationData(5);
        // print_r($data);
        // die;
        return response()->json($data);
    }

    public function getSalutation(Request $request)
    {
        $data = Salutation::where('relation_status_id', 'like', '%' . $request->id . '%')->get();
        return response()->json($data);
    }

    // show interface relation when click menu relation
    public function index(Request $request)
    {
        // call data relation
        $relation = Relation::where('RELATION_ORGANIZATION_PARENT_ID', "0")->paginate(3);
        // print_r($relation);
        // die;
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



        return Inertia::render('Relation/Relation', [
            'relation' => $relation,
            'relationType' => $relationTypeAll,
            'relationLOB' => $relationLob,
            'salutation' => $salutation,
            'relationStatus' => $relationStatus,
            'relationGroup' => $relationGroup,
            'mRelationType' => $mRelationType
        ]);
    }

    public function get_mapping(Request $request)
    {
        $data = DB::select('call sp_combo_relation_organization(?)', [$request->name]);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        // Cek Relation Perent Id 
        $parentID = $request->parent_id;
        if ($request->parent_id == '' || $request->parent_id == NULL) {
            $parentID = "0";
        }

        // Created Relation
        $relation = Relation::insertGetId([
            'RELATION_ORGANIZATION_NAME' => $request->name_relation,
            'RELATION_ORGANIZATION_PARENT_ID' => $parentID,
            'RELATION_ORGANIZATION_ABBREVIATION' => $request->abbreviation,
            'RELATION_ORGANIZATION_AKA' => $request->relation_aka,
            'RELATION_ORGANIZATION_GROUP' => $request->group_id,
            'RELATION_ORGANIZATION_MAPPING' => NULL,
            'HR_MANAGED_BY_APP' => $request->is_managed,
            'RELATION_ORGANIZATION_CREATED_BY' => Auth::user()->id,
            'RELATION_ORGANIZATION_UPDATED_BY' => NULL,
            'RELATION_ORGANIZATION_CREATED_DATE' => now(),
            'RELATION_ORGANIZATION_UPDATED_DATE' => NULL,
            'RELATION_ORGANIZATION_DESCRIPTION' => $request->relation_description,
            'RELATION_ORGANIZATION_ALIAS' => $request->name_relation,
            'RELATION_ORGANIZATION_EMAIL' => $request->relation_email,
            'RELATION_ORGANIZATION_LOGO_ID' => NULL,
            'RELATION_ORGANIZATION_SIGNATURE_NAME' => NULL,
            'RELATION_ORGANIZATION_SIGNATURE_TITLE' => NULL,
            'RELATION_ORGANIZATION_BANK_ACCOUNT_NUMBER' => NULL,
            'RELATION_ORGANIZATION_BANK_ACCOUNT_NAME' => NULL,
            'RELATION_LOB_ID' => $request->relation_lob_id,
            'salutation_id' => $request->salutation_id,
            'relation_status_id' => $request->relation_status_id

        ]);

        // Mapping Parent Id and Update
        DB::select('call sp_set_mapping_relation_organization(?)', [$request->group_id]);

        // Created Mapping Relation Type
        for ($i = 0; $i < sizeof($request->relation_type_id); $i++) {
            $idRelationType = $request->relation_type_id[$i]["id"];
            MRelationType::create([
                'RELATION_ORGANIZATION_ID' => $relation,
                'RELATION_TYPE_ID' => $idRelationType
            ]);
        }

        // created tagging
        $tagging = Tag::insertGetId([
            'TAG_NAME' => $request->tagging_name,
            'TAG_CREATED_BY' => Auth::user()->id,
            'TAG_CREATED_DATE' => now(),
            'TAG_UPDATED_BY' => NULL,
            'TAG_UPDATED_DATE' => NULL
        ]);

        // created mapping tagging
        if ($tagging) {
            MTag::create([
                'TAG_ID' => $tagging,
                'RELATION_ORGANIZATION_ID' => $relation
            ]);
        }


        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Relation).",
                "module"      => "Relation",
                "id"          => $relation
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            'New relation added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getRelationById($id)
    {
        $data = Relation::join('m_tag_relation', 'm_tag_relation.RELATION_ORGANIZATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')
            ->join('t_tag', 't_tag.TAG_ID', '=', 'm_tag_relation.TAG_ID')->where('t_relation.RELATION_ORGANIZATION_ID', $id)->first();
        return response()->json($data);
    }

    public function edit(Request $request)
    {
        // cek apakah ganti group apa engga
        $oldRelation = Relation::find($request->RELATION_ORGANIZATION_ID);
        $oldGroup = $oldRelation->RELATION_ORGANIZATION_GROUP;
        if ($oldGroup != $request->RELATION_ORGANIZATION_GROUP) {
            Relation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)
                ->update([
                    'RELATION_ORGANIZATION_GROUP'         => $request->RELATION_ORGANIZATION_GROUP,
                ]);
        }


        // Cek Relation Perent Id 
        $parentID = $request->parent_id;
        if ($request->parent_id == '' || $request->parent_id == NULL) {
            $parentID = "0";
        }

        // Update Relation
        $relation = Relation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)
            ->update([
                'RELATION_ORGANIZATION_NAME' => $request->RELATION_ORGANIZATION_NAME,
                'RELATION_ORGANIZATION_PARENT_ID' => $request->RELATION_ORGANIZATION_PARENT_ID,
                'RELATION_ORGANIZATION_ABBREVIATION' => $request->RELATION_ORGANIZATION_ABBREVIATION,
                'RELATION_ORGANIZATION_AKA' => $request->RELATION_ORGANIZATION_AKA,
                'RELATION_ORGANIZATION_MAPPING' => NULL,
                'HR_MANAGED_BY_APP' => $request->HR_MANAGED_BY_APP,
                'RELATION_ORGANIZATION_UPDATED_BY' => Auth::user()->id,
                'RELATION_ORGANIZATION_UPDATED_DATE' => now(),
                'RELATION_ORGANIZATION_DESCRIPTION' => $request->RELATION_ORGANIZATION_DESCRIPTION,
                'RELATION_ORGANIZATION_ALIAS' => $request->RELATION_ORGANIZATION_NAME,
                'RELATION_ORGANIZATION_EMAIL' => $request->RELATION_ORGANIZATION_EMAIL,
                'RELATION_LOB_ID' => $request->RELATION_LOB_ID,
                'salutation_id' => $request->salutation_id,
                'relation_status_id' => $request->relation_status_id
            ]);

        // Mapping Parent Id and Update
        DB::select('call sp_set_mapping_relation_organization(?)', [$request->RELATION_ORGANIZATION_GROUP]);

        // check existing relation_type_id in m_relation_type, if exists, delete first
        $existingData = MRelationType::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->get();

        if ($existingData->count() > 0) {
            MRelationType::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->delete();
        }

        // print_r($request->m_relation_type);
        // die;

        // Created Mapping Relation Type
        for ($i = 0; $i < sizeof($request->m_relation_type); $i++) {
            $idRelationType = $request->m_relation_type[$i]["RELATION_TYPE_ID"];
            MRelationType::create([
                'RELATION_ORGANIZATION_ID' => $request->RELATION_ORGANIZATION_ID,
                'RELATION_TYPE_ID' => $idRelationType
            ]);
        }

        return new JsonResponse([
            'New relation edited.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
