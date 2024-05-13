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

    // Get All Relation Type 
    public function getAllRelatioType()
    {
        $relationType = RelationType::get();

        return $relationType;
    }

    // show interface relation when click menu relation
    public function index(Request $request)
    {
        // call data relation
        $relation = Relation::get();
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



        return Inertia::render('Relation/Relation', [
            'relation' => $relation,
            'relationType' => $relationTypeAll,
            'relationLOB' => $relationLob,
            'salutation' => $salutation,
            'relationStatus' => $relationStatus,
            'relationGroup' => $relationGroup
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
            'RELATION_IS_MANAGED_HR' => NULL,
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
            'TAG_NAME' => $request->tagging,
            'CREATED_BY' => Auth::user()->id,
            'CREATED_DATE' => now(),
            'UPDATED_BY' => NULL,
            'UPDATED_DATE' => NULL
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
}
