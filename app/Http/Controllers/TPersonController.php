<?php

namespace App\Http\Controllers;

use App\Models\RPersonRelationship;
use App\Models\RTaxStatus;
use App\Models\TPerson;
use App\Models\TPersonEmergencyContact;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TPersonController extends Controller
{
    public function getPersonData($dataPerPage = 5, $searchQuery = null)
    {

        // dd($searchQuery);
        $data = TPerson::where('RELATION_ORGANIZATION_ID', $searchQuery->idRelation)
        ->orderBy('PERSON_FIRST_NAME', 'asc');
        // if ($searchQuery) {
        //     if ($searchQuery->input('RELATION_ORGANIZATION_NAME')) {
        //             $data->where('RELATION_ORGANIZATION_NAME', 'like', '%'.$searchQuery->RELATION_ORGANIZATION_NAME.'%');
        //     }
        // } 
            // dd($data->toSql());

            return $data->paginate($dataPerPage);
    }

    // Get Person Data
    public function getPersonJson(Request $request)
    {
        $data = $this->getPersonData(5, $request);
        // dd($request);
        // die;
        return response()->json($data);
    }

    public function getDataPersonRelationship(){
        $pRelationship = RPersonRelationship::get();

        return response()->json($pRelationship);
    }

    public function getTStatus(){
        $taxStatus = RTaxStatus::get();

        return response()->json($taxStatus);
    }



    public function store(Request $request){
        // Remove Object "CONTACT EMERGENCY" agar bisa insert dengan request all
        $removeArray = collect($request->all());
        $filtered = $removeArray->except(['CONTACT_EMERGENCY']);
        
        // Created Person
        $person = TPerson::insertGetId($filtered->all());

        // add created date
        if ($person) {
            TPerson::where('PERSON_ID', $request->person)
            ->update([
                'PERSON_CREATED_BY' => Auth::user()->id,
                'PERSON_CREATED_DATE' => now()
            ]);
        }

        // created emergency contact
        if (is_countable($request->CONTACT_EMERGENCY)) {
            // Created Mapping Relation AKA
            for ($i=0; $i < sizeof($request->CONTACT_EMERGENCY); $i++) { 
                $contactEmergency = $request->CONTACT_EMERGENCY[$i]["NAME_CONTACT_EMERGENCY"];
                TPersonEmergencyContact::create([
                    "PERSON_ID" => $person,
                    "PERSON_EMERGENCY_CONTACT_NAME" => $request->CONTACT_EMERGENCY[$i]["NAME_CONTACT_EMERGENCY"],
                    "PERSON_EMERGENCY_CONTACT_NUMBER" => $request->CONTACT_EMERGENCY[$i]["PHONE_CONTACT_EMERGENCY"],
                    "PERSON_RELATIONSHIP_ID" => $request->CONTACT_EMERGENCY[$i]["PERSON_RELATIONSHIP"]
                ]);
            }
        }

        // Created Log
        UserLog::create([
                "created_by" => Auth::user()->id,
                "action"     => json_encode([
                "description" => "Created (Person).",
                "module"      => "Person",
                "id"          => $person
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            $person
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_detail(Request $request){
        $dataPersonDetail = TPerson::with('ContactEmergency')->with('taxStatus')->find($request->id);
        // dd($dataPersonDetail);

        return response()->json($dataPersonDetail);
    }

    public function addPersonEmployment(Request $request){
        // dd($request);
        // print_r($request);die;

        // Update Person
        $person = TPerson::where('PERSON_ID', $request->PERSON_ID)
            ->update([
                'PERSONE_ID' => $request->PERSONE_ID,
                'PERSON_CATEGORY' => $request->PERSON_CATEGORY,
                'PERSON_IS_DELETED' => $request->PERSON_IS_DELETED,
                'TAX_STATUS_ID' => $request->TAX_STATUS_ID,
                'PERSON_HIRE_DATE' => $request->PERSON_HIRE_DATE,
                'PERSON_END_DATE' => $request->PERSON_END_DATE,
                'PERSON_RECRUITMENT_LOCATION' => $request->PERSON_RECRUITMENT_LOCATION,
                'PERSON_SALARY_ADJUSTMENT1' => $request->PERSON_SALARY_ADJUSTMENT1,
                'PERSON_SALARY_ADJUSTMENT2' => $request->PERSON_SALARY_ADJUSTMENT2,
                'PERSON_UPDATED_BY' => Auth::user()->id,
                'PERSON_UPDATED_DATE' => now()
            ]);

        // Created Log
        UserLog::create([
                "created_by" => Auth::user()->id,
                "action"     => json_encode([
                "description" => "Created (Person).",
                "module"      => "Person",
                "id"          => $request->PERSON_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            $request->PERSON_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
