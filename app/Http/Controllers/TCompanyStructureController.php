<?php

namespace App\Http\Controllers;

use App\Models\TCompanyStructure;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TCompanyStructureController extends Controller
{
    public function getCompanyStructureData($request){
        // dd(json_decode($request->newFilter, true));
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = TCompanyStructure::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);
        $query->leftJoin('r_grade', 't_company_structure.COMPANY_GRADE_ID', '=', 'r_grade.GRADE_ID')->where('COMPANY_ID', $request->id);
        // dd($newSearch[0]);
        
        
        if ($sortModel) {
            $sortModel = explode(';', $sortModel); 
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection); 
            }
        }
        // dd($newSearch[0]['COMPANY_TYPE_ID']['value']);

        if ($request->newFilter !== "") {
            if ($newSearch[0]["flag"] !== "") {
                $query->where('COMPANY_STRUCTURE_NAME', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
            }else{
                // dd("masuk sini");
                foreach ($newSearch[0] as $keyId => $searchValue) {
                    if ($keyId === 'COMPANY_STRUCTURE_NAME') {
                        $query->where('COMPANY_STRUCTURE_NAME', 'LIKE', '%' . $searchValue . '%');
                    }
                }
            }
        }
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }
    
    public function getCompanyStructureJson(Request $request){
        $data = $this->getCompanyStructureData($request);
        return response()->json($data);
    }

    // get Structure by relation id
    public function get_StructureCombo(Request $request){
        $data = DB::select('call sp_combo_company_structure(?)', [$request->id]);
        return response()->json($data);
    }

    public function store(Request $request) {
        // jika tidak ada parent = 0
        $parentId = 0;
        if ($request->COMPANY_STRUCTURE_PARENT_ID != null || $request->COMPANY_STRUCTURE_PARENT_ID != "") {
            $parentId = $request->COMPANY_STRUCTURE_PARENT_ID;
        }

        $structure = TCompanyStructure::create([
            'COMPANY_STRUCTURE_NAME' => $request->COMPANY_STRUCTURE_ALIAS,
            'COMPANY_STRUCTURE_ALIAS' => $request->COMPANY_STRUCTURE_ALIAS,
            'COMPANY_STRUCTURE_DESCRIPTION' => $request->COMPANY_STRUCTURE_DESCRIPTION,
            'COMPANY_STRUCTURE_PARENT_ID' => $parentId,
            'COMPANY_ID' => $request->COMPANY_ID,
            'COMPANY_STRUCTURE_CREATED_BY' => Auth::user()->id,
            'COMPANY_STRUCTURE_CREATED_DATE' => now(),
            'COMPANY_GRADE_ID' => $request->COMPANY_GRADE_ID,
        ]);

        if ($structure) {
            DB::select('call sp_set_mapping_company_structure(?)', [$request->COMPANY_ID]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created Company (Structure).",
                "module"      => "Company Structure",
                "id"          => $structure->COMPANY_STRUCTURE_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $structure->COMPANY_STRUCTURE_ID,
            $structure->COMPANY_STRUCTURE_ALIAS,
            "Created Company Structure Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_CompanyStructureDetail(Request $request){
        $data = TCompanyStructure::with('toCompany')->with('parent')->find($request->id);

        return response()->json($data);
    }

    public function edit(Request $request){
        $parentId = 0;
        if ($request->COMPANY_STRUCTURE_PARENT_ID !== null || $request->COMPANY_STRUCTURE_PARENT_ID !== "") {
            $parentId = $request->COMPANY_STRUCTURE_PARENT_ID;
        }

        $structure = TCompanyStructure::where('COMPANY_STRUCTURE_ID', $request->COMPANY_STRUCTURE_ID)->update([
            'COMPANY_STRUCTURE_NAME' => $request->COMPANY_STRUCTURE_ALIAS,
            'COMPANY_STRUCTURE_ALIAS' => $request->COMPANY_STRUCTURE_ALIAS,
            'COMPANY_STRUCTURE_DESCRIPTION' => $request->COMPANY_STRUCTURE_DESCRIPTION,
            'COMPANY_STRUCTURE_PARENT_ID' => $parentId,
            'COMPANY_ID' => $request->COMPANY_ID,
            'COMPANY_STRUCTURE_UPDATED_BY' => Auth::user()->id,
            'COMPANY_STRUCTURE_UPDATED_DATE' => now(),
            'COMPANY_GRADE_ID' => $request->COMPANY_GRADE_ID,
        ]);

        DB::select('call sp_set_mapping_company_structure(?)', [$request->COMPANY_ID]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Edited (Company Structure).",
                "module"      => "Company Structure",
                "id"          => $request->COMPANY_STRUCTURE_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $request->COMPANY_STRUCTURE_ID,
            $request->COMPANY_STRUCTURE_ALIAS,
            "Company Structure Edited Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    // get Structure by relation id
    public function getStructure(Request $request){
        $data = DB::select('call sp_combo_company_structure(?)', [$request->id]);
        return response()->json($data);
        // $structure = TRelationStructure::where('RELATION_ORGANIZATION_ID', $request->id)->get();
        // // dd($structure);
        // // $structure = TRelationStructure::find('RELATION_ORGANIZATION_ID', $request->id);

        // return response()->json($structure);
    }

}
