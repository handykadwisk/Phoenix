<?php

namespace App\Http\Controllers;

use App\Models\TRelationDivision;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TRelationDivisionController extends Controller
{
    public function getDivisionData($dataPerPage = 5, $searchQuery = null)
    {

        // dd($searchQuery->RELATION_ORGANIZATION_NAME);
        $data = TRelationDivision::where('RELATION_ORGANIZATION_ID', $searchQuery->idRelation)
        ->orderBy('RELATION_DIVISION_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('RELATION_DIVISION_ALIAS')) {
                    $data->where('RELATION_DIVISION_ALIAS', 'like', '%'.$searchQuery->RELATION_DIVISION_ALIAS.'%');
            }
        } 
        // dd($data->toSql());
        return $data->paginate($dataPerPage);
    }

    public function getDivisionJson(Request $request)
    {
        $data = $this->getDivisionData(5, $request);
        // print_r($data);
        // die;
        return response()->json($data);
    }

    // get Structure by relation id
    public function getDivisionCombo(Request $request){
        $data = DB::select('call sp_combo_relation_division(?)', [$request->id]);
        return response()->json($data);
    }

    public function store(Request $request){
        // dd($request->RELATION_ORGANIZATION_NAME);
        // Parent jika kosong = 0
        // dd($request->RELATION_DIVISION_PARENT_ID);
        $idParent = 0;
        if ($request->RELATION_DIVISION_PARENT_ID != null || $request->RELATION_DIVISION_PARENT_ID != "") {
            $idParent = $request->RELATION_DIVISION_PARENT_ID;
        }

        $division = TRelationDivision::create([
            'RELATION_DIVISION_NAME' => $request->RELATION_ORGANIZATION_NAME." ".$request->RELATION_DIVISION_ALIAS,
            'RELATION_DIVISION_ALIAS' => $request->RELATION_DIVISION_ALIAS,
            'RELATION_DIVISION_INITIAL' => $request->RELATION_DIVISION_INITIAL,
            'RELATION_DIVISION_DESCRIPTION' => $request->RELATION_DIVISION_DESCRIPTION,
            'RELATION_DIVISION_PARENT_ID' => $idParent,
            'RELATION_ORGANIZATION_ID' => $request->RELATION_ORGANIZATION_ID,
            'RELATION_STRUCTURE_CREATED_BY' => Auth::user()->id,
            'RELATION_STRUCTURE_CREATED_DATE' => now(),
        ]);

        if ($division) {
            DB::select('call sp_set_mapping_relation_division(?)', [$request->RELATION_ORGANIZATION_ID]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Division).",
                "module"      => "Division",
                "id"          => $division->RELATION_DIVISION_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $division->RELATION_DIVISION_ID,
            $division->RELATION_DIVISION_NAME
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_detail(Request $request){
        $data = TRelationDivision::with('toRelation')->with('parent')->find($request->id);

        return response()->json($data);
    }


    // edit division
    public function edit(Request $request){
        // jika tidak ada parent = 0
        $parentId = 0;
        if ($request->RELATION_DIVISION_PARENT_ID != null || $request->RELATION_DIVISION_PARENT_ID != "") {
            $parentId = $request->RELATION_DIVISION_PARENT_ID;
        }

        $division = TRelationDivision::where('RELATION_DIVISION_ID', $request->RELATION_DIVISION_ID)->update([
            'RELATION_DIVISION_NAME' => $request->to_relation['RELATION_ORGANIZATION_ALIAS']." ".$request->RELATION_DIVISION_ALIAS,
            'RELATION_DIVISION_ALIAS' => $request->RELATION_DIVISION_ALIAS,
            'RELATION_DIVISION_INITIAL' => $request->RELATION_DIVISION_INITIAL,
            'RELATION_DIVISION_DESCRIPTION' => $request->RELATION_DIVISION_DESCRIPTION,
            'RELATION_DIVISION_PARENT_ID' => $parentId,
            'RELATION_DIVISION_UPDATED_BY' => Auth::user()->id,
            'RELATION_DIVISION_UPDATED_DATE' => now(),
        ]);

        DB::select('call sp_set_mapping_relation_division(?)', [$request->RELATION_ORGANIZATION_ID]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Edited (Division).",
                "module"      => "Division",
                "id"          => $request->RELATION_DIVISION_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $request->RELATION_DIVISION_ID,
            $request->RELATION_DIVISION_ALIAS
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
