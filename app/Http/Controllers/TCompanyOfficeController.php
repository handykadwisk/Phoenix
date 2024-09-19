<?php

namespace App\Http\Controllers;

use App\Models\MCompanyOfficeLocationType;
use App\Models\TCompanyOffice;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TCompanyOfficeController extends Controller
{

    public function getOfficeData($request)
    {
       // dd(json_decode($request->newFilter, true));
       $page = $request->input('page', 1);
       $perPage = $request->input('perPage', 10);

       $query = TCompanyOffice::query();
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

       // if ($request->newFilter !== "") {
       //     if ($newSearch[0]["flag"] !== "") {
       //         $query->where('COMPANY_ORGANIZATION_NAME', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
       //     }else{
       //         foreach ($newSearch[0] as $keyId => $searchValue) {
       //             if ($keyId === 'COMPANY_ORGANIZATION_NAME') {
       //                 $query->where('COMPANY_ORGANIZATION_NAME', 'LIKE', '%' . $searchValue . '%');
       //             }elseif ($keyId === 'COMPANY_TYPE_ID'){
       //                 if (!isset($searchValue['value'])) {
       //                     $valueTypeId = $searchValue;
       //                 }else{
       //                     $valueTypeId = $searchValue['value'];
       //                 }
       //                 // dd($searchValue);
       //                 $query->whereHas('mRelationType', function($q) use($valueTypeId) {
       //                     // Query the name field in status table
       //                     $q->where('COMPANY_TYPE_ID', 'like', '%'.$valueTypeId.'%');
       //                 });
       //             }
       //         }
       //     }
       // }
       $data = $query->paginate($perPage, ['*'], 'page', $page);

       return $data;
    }

    public function getOfficeCompanyJson(Request $request)
    {
        $data = $this->getOfficeData($request);
        return response()->json($data);
    }



    // add office to database
    public function store(Request $request){
        // dd($request->COMPANY_LOCATION_TYPE);
        // jika parent kosong = 0


        $flag = "lType";
        $message = "Please Choose Location Type!";
        if ($request->COMPANY_LOCATION_TYPE == null) {
            return new JsonResponse([
                $flag,
                $message
            ], 201, [
                'X-Inertia' => true
            ]);
        }


        $parentId = 0;
        if ($request->COMPANY_OFFICE_PARENT_ID != null || $request->COMPANY_OFFICE_PARENT_ID != "") {
            $parentId = $request->COMPANY_OFFICE_PARENT_ID;
        }

        // add store t_COMPANY_office
        $office = TCompanyOffice::create([
            "COMPANY_OFFICE_NAME"          => $request->COMPANY_NAME." ".$request->COMPANY_OFFICE_ALIAS,
            "COMPANY_OFFICE_ALIAS"         => $request->COMPANY_OFFICE_ALIAS,
            "COMPANY_OFFICE_DESCRIPTION"   => $request->COMPANY_OFFICE_DESCRIPTION,
            "COMPANY_OFFICE_PARENT_ID"     => $parentId,
            "COMPANY_ID"                   => $request->COMPANY_ID,
            "COMPANY_OFFICE_ADDRESS"       => $request->COMPANY_OFFICE_ADDRESS,
            "COMPANY_OFFICE_PHONENUMBER"   => $request->COMPANY_OFFICE_PHONENUMBER,
            "COMPANY_OFFICE_PROVINCE"      => $request->COMPANY_OFFICE_PROVINCE['value'],
            "COMPANY_OFFICE_REGENCY"       => $request->COMPANY_OFFICE_REGENCY['value'],
            "COMPANY_OFFICE_CREATED_BY"    => Auth::user()->id,
            "COMPANY_OFFICE_CREATED_DATE"  => now(),
        ]);

        if ($office) {
            DB::select('call sp_set_mapping_company_office(?)', [$request->COMPANY_ID]);
        }

        // store to m relation location type
        for ($i=0; $i < sizeof($request->COMPANY_LOCATION_TYPE); $i++) { 
            $idLocationType = $request->COMPANY_LOCATION_TYPE[$i]['id'];
            MCompanyOfficeLocationType::create([
                "COMPANY_OFFICE_ID" => $office->COMPANY_OFFICE_ID,
                "LOCATION_TYPE_ID" => $idLocationType
            ]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Company Office).",
                "module"      => "Company Office",
                "id"          => $office->COMPANY_OFFICE_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);


        return new JsonResponse([
            $office->COMPANY_OFFICE_ID,
            $office->COMPANY_OFFICE_ALIAS,
            "Company Structure Office Add Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    // get Office by relation id
    public function getOfficeComboCompany(Request $request){
        $data = DB::select('call sp_combo_company_office(?)', [$request->id]);
        return response()->json($data);
    }

    // get Detail Office
    public function get_detail(Request $request){

        $data = TCompanyOffice::with('mLocationType')->with('toCompany')->with('parent')->find($request->id);
        return response()->json($data);
    }

    // edit office
    public function edit(Request $request){
        // dd($request);
        // jika parent kosong = 0
        $parentId = 0;
        if ($request->COMPANY_OFFICE_PARENT_ID != null || $request->COMPANY_OFFICE_PARENT_ID != "") {
            $parentId = $request->COMPANY_OFFICE_PARENT_ID;
        }

        // add store t_COMPANY_office
        $office = TCompanyOffice::where('COMPANY_OFFICE_ID', $request->COMPANY_OFFICE_ID)->update([
            "COMPANY_OFFICE_NAME"          => $request->to_company['COMPANY_NAME']." ".$request->COMPANY_OFFICE_ALIAS,
            "COMPANY_OFFICE_ALIAS"         => $request->COMPANY_OFFICE_ALIAS,
            "COMPANY_OFFICE_DESCRIPTION"   => $request->COMPANY_OFFICE_DESCRIPTION,
            "COMPANY_OFFICE_PARENT_ID"     => $parentId,
            "COMPANY_ID"                   => $request->COMPANY_ID,
            "COMPANY_OFFICE_ADDRESS"       => $request->COMPANY_OFFICE_ADDRESS,
            "COMPANY_OFFICE_PHONENUMBER"   => $request->COMPANY_OFFICE_PHONENUMBER,
            "COMPANY_OFFICE_PROVINCE"      => $request->COMPANY_OFFICE_PROVINCE,
            "COMPANY_OFFICE_REGENCY"       => $request->COMPANY_OFFICE_REGENCY,
            "COMPANY_OFFICE_UPDATED_BY"    => Auth::user()->id,
            "COMPANY_OFFICE_UPDATE_DATE"  => now(),
        ]);

        if ($office) {
            DB::select('call sp_set_mapping_company_office(?)', [$request->COMPANY_ID]);
        }


        // check m location type
        $existingLocationType = MCompanyOfficeLocationType::where('COMPANY_OFFICE_ID', $request->COMPANY_OFFICE_ID)->get();
        if ($existingLocationType->count()>0) {
            MCompanyOfficeLocationType::where('COMPANY_OFFICE_ID', $request->COMPANY_OFFICE_ID)->delete();
        }

        // store to m relation location type
        for ($i=0; $i < sizeof($request->m_location_type); $i++) { 
            
            $idLocationType = $request->m_location_type[$i]['LOCATION_TYPE_ID'];
            MCompanyOfficeLocationType::create([
                "COMPANY_OFFICE_ID" => $request->COMPANY_OFFICE_ID,
                "LOCATION_TYPE_ID" => $idLocationType
            ]);
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Updated (Office Company).",
                "module"      => "Office Company",
                "id"          => $request->COMPANY_OFFICE_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);


        return new JsonResponse([
            $request->COMPANY_OFFICE_ID,
            $request->COMPANY_OFFICE_ALIAS,
            "Company Office Edit Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getOffice(Request $request){
        $data = DB::select('call sp_combo_company_office(?)', [$request->id]);
        return response()->json($data);
        // $structure = TRelationStructure::where('RELATION_ORGANIZATION_ID', $request->id)->get();
        // // dd($structure);
        // // $structure = TRelationStructure::find('RELATION_ORGANIZATION_ID', $request->id);

        // return response()->json($structure);
    }
}
