<?php

namespace App\Http\Controllers;

use App\Models\RGrade;
use App\Models\TRelationStructure;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TRelationStructureController extends Controller
{
    public function getStructureData($dataPerPage = 5, $searchQuery = null)
    {

        // dd($searchQuery->RELATION_ORGANIZATION_NAME);
        $data = TRelationStructure::with('grade')->where('RELATION_ORGANIZATION_ID', $searchQuery->idRelation)
        ->orderBy('RELATION_STRUCTURE_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('RELATION_STRUCTURE_ALIAS')) {
                    $data->where('RELATION_STRUCTURE_ALIAS', 'like', '%'.$searchQuery->RELATION_STRUCTURE_ALIAS.'%');
            }
        } 
            // dd($data->toSql());

            return $data->paginate($dataPerPage);
    }

    public function getStructureJson(Request $request)
    {
        $data = $this->getStructureData(5, $request);
        // print_r($data);
        // die;
        return response()->json($data);
    }

    public function getGrade(Request $request){
        $data = RGrade::get();
        return response()->json($data);
    }

    // get Structure by relation id
    public function getStructureCombo(Request $request){
        $data = DB::select('call sp_combo_relation_structure(?)', [$request->id]);
        return response()->json($data);
    }

    // add Structure
    public function store(Request $request){
        
        // jika tidak ada parent = 0
        $parentId = 0;
        if ($request->RELATION_STRUCTURE_PARENT_ID != null || $request->RELATION_STRUCTURE_PARENT_ID != "") {
            $parentId = $request->RELATION_STRUCTURE_PARENT_ID;
        }

        $structure = TRelationStructure::create([
            'RELATION_STRUCTURE_NAME' => $request->RELATION_STRUCTURE_ALIAS,
            'RELATION_STRUCTURE_ALIAS' => $request->RELATION_STRUCTURE_ALIAS,
            'RELATION_STRUCTURE_DESCRIPTION' => $request->RELATION_STRUCTURE_DESCRIPTION,
            'RELATION_STRUCTURE_PARENT_ID' => $parentId,
            'RELATION_ORGANIZATION_ID' => $request->RELATION_ORGANIZATION_ID,
            'RELATION_STRUCTURE_CREATED_BY' => Auth::user()->id,
            'RELATION_STRUCTURE_CREATED_DATE' => now(),
            'RELATION_GRADE_ID' => $request->RELATION_GRADE_ID,
        ]);

        if ($structure) {
            DB::select('call sp_set_mapping_relation_structure(?)', [$request->RELATION_ORGANIZATION_ID]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Structure).",
                "module"      => "Structure",
                "id"          => $structure->RELATION_STRUCTURE_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $structure->RELATION_STRUCTURE_ID,
            $structure->RELATION_STRUCTURE_ALIAS
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    // Get Detail Structure
    public function get_detail(Request $request){
        $data = TRelationStructure::with('toRelation')->with('parent')->find($request->id);

        return response()->json($data);
    }

    // edit Structure 
    public function edit(Request $request){
        // jika tidak ada parent = 0
        $parentId = 0;
        if ($request->RELATION_STRUCTURE_PARENT_ID !== null || $request->RELATION_STRUCTURE_PARENT_ID !== "") {
            $parentId = $request->RELATION_STRUCTURE_PARENT_ID;
        }

        $structure = TRelationStructure::where('RELATION_STRUCTURE_ID', $request->RELATION_STRUCTURE_ID)->update([
            'RELATION_STRUCTURE_NAME' => $request->RELATION_STRUCTURE_ALIAS,
            'RELATION_STRUCTURE_ALIAS' => $request->RELATION_STRUCTURE_ALIAS,
            'RELATION_STRUCTURE_DESCRIPTION' => $request->RELATION_STRUCTURE_DESCRIPTION,
            'RELATION_STRUCTURE_PARENT_ID' => $parentId,
            'RELATION_ORGANIZATION_ID' => $request->RELATION_ORGANIZATION_ID,
            'RELATION_STRUCTURE_UPDATED_BY' => Auth::user()->id,
            'RELATION_STRUCTURE_UPDATED_DATE' => now(),
            'RELATION_GRADE_ID' => $request->RELATION_GRADE_ID,
        ]);

        DB::select('call sp_set_mapping_relation_structure(?)', [$request->RELATION_ORGANIZATION_ID]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Edited (Structure).",
                "module"      => "Structure",
                "id"          => $request->RELATION_STRUCTURE_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $request->RELATION_STRUCTURE_ID,
            $request->RELATION_STRUCTURE_ALIAS
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
