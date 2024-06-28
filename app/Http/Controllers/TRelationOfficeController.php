<?php

namespace App\Http\Controllers;

use App\Models\MRelationOfficeLocationType;
use App\Models\RRelationLocationType;
use App\Models\RWilayahKemendagri;
use App\Models\TRelationOffice;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TRelationOfficeController extends Controller
{
    public function getOfficeData($dataPerPage = 5, $searchQuery = null)
    {

        // dd($searchQuery->RELATION_ORGANIZATION_NAME);
        $data = TRelationOffice::where('RELATION_ORGANIZATION_ID', $searchQuery->idRelation)
        ->orderBy('RELATION_OFFICE_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('RELATION_OFFICE_ALIAS')) {
                    $data->where('RELATION_OFFICE_ALIAS', 'like', '%'.$searchQuery->RELATION_OFFICE_ALIAS.'%');
            }
        } 
        // dd($data->toSql());
        return $data->paginate($dataPerPage);
    }

    public function getOfficeJson(Request $request)
    {
        $data = $this->getOfficeData(5, $request);
        // print_r($data);
        // die;
        return response()->json($data);
    }

    // get relation location type
    public function getLocationType(Request $request){
        $data = RRelationLocationType::get();
        return response()->json($data);
    }

    // get Office by relation id
    public function getOfficeCombo(Request $request){
        $data = DB::select('call sp_combo_relation_office(?)', [$request->id]);
        return response()->json($data);
    }

    public function get_wilayah(Request $request){
        $data = RWilayahKemendagri::where('tipe_wilayah', 'province')->get();
        return response()->json($data);
    }
    public function get_regency(Request $request){
        // dd($request);
        $data = RWilayahKemendagri::where('tipe_wilayah', 'regency')->where('kode_mapping', 'like', '%'. $request->valueKode .'%')->get();
        return response()->json($data);
    }

    // add office to database
    public function store(Request $request){
        // dd($request->RELATION_LOCATION_TYPE);
        // jika parent kosong = 0
        $parentId = 0;
        if ($request->RELATION_OFFICE_PARENT_ID != null || $request->RELATION_OFFICE_PARENT_ID != "") {
            $parentId = $request->RELATION_OFFICE_PARENT_ID;
        }

        // add store t_relation_office
        $office = TRelationOffice::create([
            "RELATION_OFFICE_NAME"          => $request->RELATION_ORGANIZATION_ALIAS." ".$request->RELATION_OFFICE_ALIAS,
            "RELATION_OFFICE_ALIAS"         => $request->RELATION_OFFICE_ALIAS,
            "RELATION_OFFICE_DESCRIPTION"   => $request->RELATION_OFFICE_DESCRIPTION,
            "RELATION_OFFICE_PARENT_ID"     => $parentId,
            "RELATION_ORGANIZATION_ID"      => $request->RELATION_ORGANIZATION_ID,
            "RELATION_OFFICE_ADDRESS"       => $request->RELATION_OFFICE_ADDRESS,
            "RELATION_OFFICE_PHONENUMBER"   => $request->RELATION_OFFICE_PHONENUMBER,
            "RELATION_OFFICE_PROVINCE"      => $request->RELATION_OFFICE_PROVINCE['value'],
            "RELATION_OFFICE_REGENCY"       => $request->RELATION_OFFICE_REGENCY['value'],
        ]);

        if ($office) {
            DB::select('call sp_set_mapping_relation_office(?)', [$request->RELATION_ORGANIZATION_ID]);
        }

        // store to m relation location type
        for ($i=0; $i < sizeof($request->RELATION_LOCATION_TYPE); $i++) { 
            $idLocationType = $request->RELATION_LOCATION_TYPE[$i]['id'];
            MRelationOfficeLocationType::create([
                "RELATION_OFFICE_ID" => $office->RELATION_OFFICE_ID,
                "LOCATION_TYPE_ID" => $idLocationType
            ]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Office).",
                "module"      => "Office",
                "id"          => $office->RELATION_OFFICE_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $office->RELATION_OFFICE_ID,
            $office->RELATION_DIVISION_NAME
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    // get Detail Office
    public function get_detail(Request $request){

        $data = TRelationOffice::with('mLocationType')->with('toRelation')->with('parent')->find($request->id);
        return response()->json($data);
    }
}
