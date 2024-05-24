<?php

namespace App\Http\Controllers;

use App\Models\Relation;
use App\Models\RelationGroup;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function store(Request $request){
        // Created Relation
        $group = RelationGroup::insertGetId([
            'RELATION_GROUP_NAME' => $request->RELATION_GROUP_NAME,
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
                "id"          => $group
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            'New relation group added.'
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getRelationByIdGroup(Request $request)
    {
        $data = Relation::where('RELATION_ORGANIZATION_GROUP', 'like', '%' . $request->id . '%')->get();
        return response()->json($data);
    }
}
