<?php

namespace App\Http\Controllers;

use App\Models\Relation;
use App\Models\RelationType;
use Illuminate\Http\Request;
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
}
