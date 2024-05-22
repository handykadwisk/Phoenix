<?php

namespace App\Http\Controllers;

use App\Models\RelationGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RelationGroupController extends Controller
{

    public function getRelationGroupData($dataPerPage = 2)
    {

        return RelationGroup::orderBy('RELATION_GROUP_ID', 'asc')
            // ->where('RELATION_ORGANIZATION_PARENT_ID', "0")
            ->paginate($dataPerPage);
    }

    public function getRelationGroupJson(){
        $data = $this->getRelationGroupData(5);
        return response()->json($data);
    }

    public function index()
    {
        $xxx= "aa";
        return Inertia::render('Group/Group', [
            'xxx' => $xxx,
        ]);
    }
}
