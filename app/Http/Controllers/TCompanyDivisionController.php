<?php

namespace App\Http\Controllers;

use App\Models\TCompanyDivision;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TCompanyDivisionController extends Controller
{
    public function getCompanyDivisionData($request){
        // dd(json_decode($request->newFilter, true));
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = TCompanyDivision::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);
        $query->where('COMPANY_ID', $request->id);
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
                $query->where('COMPANY_DIVISION_NAME', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
            }else{
                // dd("masuk sini");
                foreach ($newSearch[0] as $keyId => $searchValue) {
                    if ($keyId === 'COMPANY_DIVISION_NAME') {
                        $query->where('COMPANY_DIVISION_NAME', 'LIKE', '%' . $searchValue . '%');
                    }
                }
            }
        }
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    public function getCompanyDivisionJson(Request $request){
        $data = $this->getCompanyDivisionData($request);
        return response()->json($data);
    }

    public function getDivisionComboCompany(Request $request){
        $data = DB::select('call sp_combo_company_division(?)', [$request->id]);
        return response()->json($data);
    }

    public function store(Request $request){
        $idParent = 0;
        if ($request->COMPANY_DIVISION_PARENT_ID != null || $request->COMPANY_DIVISION_PARENT_ID != "") {
            $idParent = $request->COMPANY_DIVISION_PARENT_ID;
        }

        $division = TCompanyDivision::create([
            'COMPANY_DIVISION_NAME' => $request->COMPANY_ORGANIZATION_NAME." ".$request->COMPANY_DIVISION_ALIAS,
            'COMPANY_DIVISION_ALIAS' => $request->COMPANY_DIVISION_ALIAS,
            'COMPANY_DIVISION_INITIAL' => $request->COMPANY_DIVISION_INITIAL,
            'COMPANY_DIVISION_DESCRIPTION' => $request->COMPANY_DIVISION_DESCRIPTION,
            'COMPANY_DIVISION_PARENT_ID' => $idParent,
            'COMPANY_ID' => $request->COMPANY_ID,
            'COMPANY_DIVISION_CREATED_BY' => Auth::user()->id,
            'COMPANY_DIVISION_CREATED_DATE' => now(),
        ]);

        if ($division) {
            DB::select('call sp_set_mapping_company_division(?)', [$request->COMPANY_ID]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Division).",
                "module"      => "Division",
                "id"          => $division->COMPANY_DIVISION_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);


        return new JsonResponse([
            $division->COMPANY_DIVISION_ID,
            $division->COMPANY_DIVISION_NAME,
            "Add Company Division Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_detail(Request $request){
        $data = TCompanyDivision::with('toCompany')->with('parent')->find($request->id);

        return response()->json($data);
    }

    // edit division
    public function edit(Request $request){
        // jika tidak ada parent = 0
        $parentId = 0;
        if ($request->COMPANY_DIVISION_PARENT_ID != null || $request->COMPANY_DIVISION_PARENT_ID != "") {
            $parentId = $request->COMPANY_DIVISION_PARENT_ID;
        }

        $division = TCompanyDivision::where('COMPANY_DIVISION_ID', $request->COMPANY_DIVISION_ID)->update([
            'COMPANY_DIVISION_NAME' => $request->to_company['COMPANY_NAME']." ".$request->COMPANY_DIVISION_ALIAS,
            'COMPANY_DIVISION_ALIAS' => $request->COMPANY_DIVISION_ALIAS,
            'COMPANY_DIVISION_INITIAL' => $request->COMPANY_DIVISION_INITIAL,
            'COMPANY_DIVISION_DESCRIPTION' => $request->COMPANY_DIVISION_DESCRIPTION,
            'COMPANY_DIVISION_PARENT_ID' => $parentId,
            'COMPANY_DIVISION_UPDATED_BY' => Auth::user()->id,
            'COMPANY_DIVISION_UPDATED_DATE' => now(),
        ]);

        DB::select('call sp_set_mapping_company_division(?)', [$request->COMPANY_ORGANIZATION_ID]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Edited (Division).",
                "module"      => "Division",
                "id"          => $request->COMPANY_DIVISION_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);


        return new JsonResponse([
            $request->COMPANY_DIVISION_ID,
            $request->COMPANY_DIVISION_ALIAS,
            "Company Division Edit Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getDivision(Request $request){
        $data = DB::select('call sp_combo_company_division(?)', [$request->id]);
        return response()->json($data);
        // $structure = TRelationStructure::where('RELATION_ORGANIZATION_ID', $request->id)->get();
        // // dd($structure);
        // // $structure = TRelationStructure::find('RELATION_ORGANIZATION_ID', $request->id);

        // return response()->json($structure);
    }

}
