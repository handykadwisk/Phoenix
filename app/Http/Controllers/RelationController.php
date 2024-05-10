<?php

namespace App\Http\Controllers;

use App\Models\MRelationType;
use App\Models\Relation;
use App\Models\RelationLob;
use App\Models\RelationType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class RelationController extends Controller
{
    // get All data Relation
    // public function getRelationAllData()
    // {
    //     return Relation::orderBy('relation_id', 'desc')
    //         ->orderBy('relation_id', 'desc');
    // }

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

        $relationLob = RelationLob::get();
        // print_r($relationLob);
        // die;

        // call data relation type
        $relationTypeAll = $this->getAllRelatioType();



        return Inertia::render('Relation/Relation', [
            'relation' => $relation,
            'relationType' => $relationTypeAll,
            'relationLOB' => $relationLob
        ]);
    }

    public function get_mapping(Request $request)
    {
        $data = DB::select('call sp_combo_relation_organization(?)', [$request->name]);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        // $xx = '';
        // DB::select('call sp_set_mapping_relation_organization(2)');
        // print_r($xx);
        // die;

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
            'RELATION_ORGANIZATION_CREATED_BY' => NULL,
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
            'RELATION_LOB_ID' => $request->relation_lob_id

        ]);

        // Mapping Parent Id and Update
        // if ($parentID == 0 || $parentID == null) {
        DB::select('call sp_set_mapping_relation_organization(?)', [$request->group_id]);
        // }

        // Created Mapping Relation Type
        for ($i = 0; $i < sizeof($request->relation_type_id); $i++) {
            $idRelationType = $request->relation_type_id[$i]["id"];
            MRelationType::create([
                'RELATION_ORGANIZATION_ID' => $relation,
                'RELATION_TYPE_ID' => $idRelationType
            ]);
        }

        return new JsonResponse([
            'New policy added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
