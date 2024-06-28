<?php

namespace App\Http\Controllers;

use App\Models\RBank;
use App\Models\RPersonRelationship;
use App\Models\RTaxStatus;
use App\Models\TDocument;
use App\Models\TPerson;
use App\Models\TPersonBankAccount;
use App\Models\TPersonEmergencyContact;
use App\Models\TRelationStructure;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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

    public function edit(Request $request){
        $person = TPerson::where('PERSON_ID', $request->PERSON_ID)
            ->update([
                'PERSON_FIRST_NAME' => $request->PERSON_FIRST_NAME,
                'PERSON_GENDER' => $request->PERSON_GENDER,
                'PERSON_BIRTH_PLACE' => $request->PERSON_BIRTH_PLACE,
                'PERSON_BIRTH_DATE' => $request->PERSON_BIRTH_DATE,
                'PERSON_EMAIL' => $request->PERSON_EMAIL,
                'PERSON_CONTACT' => $request->PERSON_CONTACT,
                'PERSON_UPDATED_BY' => Auth::user()->id,
                'PERSON_UPDATED_DATE' => now(),
                'PERSON_KTP' => $request->PERSON_KTP,
                'PERSON_NPWP' => $request->PERSON_NPWP,
                'PERSON_KK' => $request->PERSON_KK,
                'PERSON_BLOOD_TYPE' => $request->PERSON_BLOOD_TYPE,
                'PERSON_BLOOD_RHESUS' => $request->PERSON_BLOOD_RHESUS,
                'PERSON_MARITAL_STATUS' => $request->PERSON_MARITAL_STATUS,
            ]);

        // cek existing contact emergency
        $contactEmergency = TPersonEmergencyContact::where('PERSON_ID', $request->PERSON_ID)->get();
        if ($contactEmergency->count()>0) { //jika ada delete data sebelumnya
            TPersonEmergencyContact::where('PERSON_ID', $request->PERSON_ID)->delete();
        }

        // created emergency contact
        if (is_countable($request->contact_emergency)) {
            // Created Mapping Relation AKA
            for ($i=0; $i < sizeof($request->contact_emergency); $i++) { 
                TPersonEmergencyContact::create([
                    "PERSON_ID" => $request->PERSON_ID,
                    "PERSON_EMERGENCY_CONTACT_NAME" => $request->contact_emergency[$i]["PERSON_EMERGENCY_CONTACT_NAME"],
                    "PERSON_EMERGENCY_CONTACT_NUMBER" => $request->contact_emergency[$i]["PERSON_EMERGENCY_CONTACT_NUMBER"],
                    "PERSON_RELATIONSHIP_ID" => $request->contact_emergency[$i]["PERSON_RELATIONSHIP_ID"]
                ]);
            }
        }

        // Created Log
        UserLog::create([
                "created_by" => Auth::user()->id,
                "action"     => json_encode([
                "description" => "Updated (Person).",
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
        $dataPersonDetail = TPerson::with('ContactEmergency')->with('taxStatus')->with('Relation')->with('Structure')->with('Division')->with('Office')->with('Document')->find($request->id);
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
                "description" => "Updated (Person).",
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


    // get Structure by relation id
    public function getStructure(Request $request){
        $data = DB::select('call sp_combo_relation_structure(?)', [$request->id]);
        return response()->json($data);
        // $structure = TRelationStructure::where('RELATION_ORGANIZATION_ID', $request->id)->get();
        // // dd($structure);
        // // $structure = TRelationStructure::find('RELATION_ORGANIZATION_ID', $request->id);

        // return response()->json($structure);
    }

    public function getDivision(Request $request){
        $data = DB::select('call sp_combo_relation_division(?)', [$request->id]);
        return response()->json($data);
    }

    public function getRBank(){
        $data = RBank::get();
        return response()->json($data);
    }

    public function getOffice(Request $request){
        $data = DB::select('call sp_combo_relation_office(?)', [$request->id]);
        return response()->json($data);
    }

    public function addPersonStructureDivision(Request $request){
        // dd($request);
        // print_r($request);die;

        // Update Person
        $person = TPerson::where('PERSON_ID', $request->PERSON_ID)
            ->update([
                'STRUCTURE_ID' => $request->STRUCTURE_ID,
                'DIVISION_ID' => $request->DIVISION_ID,
                'OFFICE_ID' => $request->OFFICE_ID,
                'PERSON_UPDATED_BY' => Auth::user()->id,
                'PERSON_UPDATED_DATE' => now()
            ]);

        // Created Log
        UserLog::create([
                "created_by" => Auth::user()->id,
                "action"     => json_encode([
                "description" => "Updated (Person).",
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

    public function handleDirectoryUploadedFile($file, $id, $rootDirectory, $documentId = null) {

        $parentDir = ((floor(($id) / 1000)) * 1000) . '/';
        $personId = $id . '/';
        $typeDir = '';
        $uploadPath = 'images/' . $rootDirectory . $parentDir . $personId . $typeDir;
        Storage::makeDirectory($uploadPath, 0777, true, true);
        Storage::disk('public')->putFileAs($uploadPath, $file[0], $file[0]->getClientOriginalName());

        if ($documentId) {
            TDocument::where('DOCUMENT_ID', $documentId)
                    ->update([
                        'DOCUMENT_FILENAME'         => pathinfo($file[0]->getClientOriginalName(), PATHINFO_FILENAME),
                        'DOCUMENT_PATHNAME'         => $uploadPath,
                        'DOCUMENT_EXTENTION'        => pathinfo($file[0]->getClientOriginalName(), PATHINFO_EXTENSION),
                        'DOCUMENT_TYPE'             => pathinfo($file[0]->getClientOriginalName(), PATHINFO_EXTENSION),
                        'DOCUMENT_SIZE'             => $file[0]->getSize(),
                        'DOCUMENT_CREATED_BY'       => Auth::user()->id,
                        'DOCUMENT_CREATED_DATE'     => now()
                    ]);
            $document = $documentId;
            
        } else {
            $document = TDocument::create([
                'DOCUMENT_FILENAME'         => pathinfo($file[0]->getClientOriginalName(), PATHINFO_FILENAME),
                'DOCUMENT_PATHNAME'         => $uploadPath,
                'DOCUMENT_EXTENTION'        => pathinfo($file[0]->getClientOriginalName(), PATHINFO_EXTENSION),
                'DOCUMENT_TYPE'             => pathinfo($file[0]->getClientOriginalName(), PATHINFO_EXTENSION),
                'DOCUMENT_SIZE'             => $file[0]->getSize(),
                'DOCUMENT_CREATED_BY'       => Auth::user()->id,
                'DOCUMENT_CREATED_DATE'     => now()
            ])->DOCUMENT_ID;
        }


        return $document;

    }

    public function uploadFile(Request $request){
        // dd($request);
        // document
        $imgProfile = $request->file('files');
        // print_r($imgProfile);die;
        if ($imgProfile) {
                $document = $this->handleDirectoryUploadedFile($imgProfile, $request->id, 'person/');
    
                if ($document) {
                    TPerson::where('PERSON_ID', $request->id)
                      ->update([
                        'PERSON_IMAGE_ID'    => $document
                      ]);
                }
    
            }

            // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
            "description" => "Updated (Person).",
            "module"      => "Person",
            "id"          => $request->id
        ]),
        'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            $request->id
        ], 201, [
            'X-Inertia' => true
        ]);
        // dd($imgProfile[0]->getClientOriginalName());

    }

    public function addBankAccount(Request $request){
        // $personFor = $request->BANK_ACCOUNT[0]['BANK_ID']['value'];
        // print_r($personFor);die;
        $bankForNew = [];
        foreach ($request->BANK_ACCOUNT[0]['PERSON_BANK_ACCOUNT_FOR'] as $bankFor) {
            // get Bank For
            array_push($bankForNew, (int)$bankFor['value']);
        }
        $valueBankFor = json_encode($bankForNew);

        // created bank account
        // if (is_countable($request->BANK_ACCOUNT)) {
            for ($i=0; $i < sizeof($request->BANK_ACCOUNT); $i++) { 
                TPersonBankAccount::create([
                    "PERSON_ID" => $request->BANK_ACCOUNT[$i]["idPerson"],
                    "PERSON_BANK_ACCOUNT_NAME" => $request->BANK_ACCOUNT[$i]["PERSON_BANK_ACCOUNT_NUMBER"],
                    "PERSON_BANK_ACCOUNT_NUMBER" => $request->BANK_ACCOUNT[$i]["PERSON_BANK_ACCOUNT_NUMBER"],
                    "PERSON_BANK_ACCOUNT_FOR" => $valueBankFor,
                    "BANK_ID" => $request->BANK_ACCOUNT[$i]['BANK_ID']['value'],
                ]);
            }
        // }

        return new JsonResponse([
            $request->BANK_ACCOUNT[0]["idPerson"]
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}   
