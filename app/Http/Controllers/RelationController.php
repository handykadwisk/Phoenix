<?php

namespace App\Http\Controllers;

use App\Models\MRelationType;
use App\Models\Relation;
use App\Models\RelationType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

        // call data relation type
        $relationTypeAll = $this->getAllRelatioType();



        return Inertia::render('Relation/Relation', [
            'relation' => $relation,
            'relationType' => $relationTypeAll
        ]);
    }

    public function store(Request $request)
    {
        // print_r($request->relation_type_id[0]["id"]);
        // die;
        // Created Relation
        $relation = Relation::insertGetId([
            'RELATION_ORGANIZATION_NAME' => $request->name_relation,
            'RELATION_ORGANIZATION_PARENT_ID' => $request->parent_id,
            'RELATION_ORGANIZATION_ABBREVIATION' => $request->abbreviation,
            'RELATION_ORGANIZATION_AKA' => $request->relation_aka,
            'RELATION_ORGANIZATION_GROUP' => $request->group_id,
            'RELATION_ORGANIZATION_MAPPING' => $request->parent_id . ".",
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
            'RELATION_LOB_ID' => NULL

        ]);

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
