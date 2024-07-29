<?php

namespace App\Http\Controllers;

use App\Models\MPersonAddress;
use App\Models\MPersonContact;
use App\Models\RAddressStatus;
use App\Models\RBank;
use App\Models\RCertificateQualification;
use App\Models\REducationDegree;
use App\Models\RPersonRelationship;
use App\Models\RTaxStatus;
use App\Models\RWilayahKemendagri;
use App\Models\TAddress;
use App\Models\TDocument;
use App\Models\TPerson;
use App\Models\TPersonBankAccount;
use App\Models\TPersonContact;
use App\Models\TPersonEducation;
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
        $data = TPerson::with('users')->where('RELATION_ORGANIZATION_ID', $searchQuery->idRelation)
        ->orderBy('PERSON_FIRST_NAME', 'asc');
        if ($searchQuery) {
            if ($searchQuery->input('PERSON_FIRST_NAME')) {
                    $data->where('PERSON_FIRST_NAME', 'like', '%'.$searchQuery->PERSON_FIRST_NAME.'%');
            }
        } 
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

    public function get_address_status(){
        $dataAddressStatus = RAddressStatus::get();

        return response()->json($dataAddressStatus);
    }

    

    public function edit(Request $request){
        $person = TPerson::where('PERSON_ID', $request->PERSON_ID)
            ->update([
                'PERSON_FIRST_NAME' => $request->PERSON_FIRST_NAME,
                'PERSON_GENDER' => $request->PERSON_GENDER,
                'PERSON_BIRTH_PLACE' => $request->PERSON_BIRTH_PLACE,
                'PERSON_BIRTH_DATE' => $request->PERSON_BIRTH_DATE,
                // 'PERSON_EMAIL' => $request->PERSON_EMAIL,
                // 'PERSON_CONTACT' => $request->PERSON_CONTACT,
                'PERSON_UPDATED_BY' => Auth::user()->id,
                'PERSON_UPDATED_DATE' => now(),
                'PERSON_KTP' => $request->PERSON_KTP,
                'PERSON_NPWP' => $request->PERSON_NPWP,
                'PERSON_KK' => $request->PERSON_KK,
                'PERSON_BLOOD_TYPE' => $request->PERSON_BLOOD_TYPE,
                'PERSON_BLOOD_RHESUS' => $request->PERSON_BLOOD_RHESUS,
                'PERSON_MARITAL_STATUS' => $request->PERSON_MARITAL_STATUS,
            ]);

        // cek existing PErson Contact
        $personContact = MPersonContact::where('PERSON_ID', $request->PERSON_ID)->get();
        for ($i=0; $i < sizeof($personContact); $i++) { 
            $idPersonContact = $personContact[$i]['PERSON_CONTACT_ID'];
            // delete person contact
            $deleteMPerson = TPersonContact::where('PERSON_CONTACT_ID', $idPersonContact)->delete();
        }

        if ($personContact->count()>0) { //jika ada delete data sebelumnya
            MPersonContact::where('PERSON_ID', $request->PERSON_ID)->delete();
        }

        // created emergency contact
        if (is_countable($request->m_person_contact)) {
            // Created Mapping Relation AKA
            for ($i=0; $i < sizeof($request->m_person_contact); $i++) { 
                $phoneNumber = $request->m_person_contact[$i]['t_person_contact']['PERSON_PHONE_NUMBER'];
                $email = $request->m_person_contact[$i]['t_person_contact']['PERSON_EMAIL'];
                $createPersonContact = TPersonContact::create([
                    "PERSON_PHONE_NUMBER"   => $phoneNumber,
                    "PERSON_EMAIL"          => $email
                ]);

                // create mapping
                if ($createPersonContact) {
                    MPersonContact::create([
                        "PERSON_ID"         => $request->PERSON_ID,
                        "PERSON_CONTACT_ID" => $createPersonContact->PERSON_CONTACT_ID
                    ]);
                }
            }
        }


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
        $newFiltered = $filtered->except(['PERSON_CONTACT']);
        
        // Created Person
        $person = TPerson::insertGetId($newFiltered->all());

        // add created date
        if ($person) {
            TPerson::where('PERSON_ID', $request->person)
            ->update([
                'PERSON_CREATED_BY' => Auth::user()->id,
                'PERSON_CREATED_DATE' => now()
            ]);
        }

        // created Person contact
        if (is_countable($request->PERSON_CONTACT)) {
            // Created Mapping Relation AKA
            for ($i=0; $i < sizeof($request->PERSON_CONTACT); $i++) { 
                $phoneNumber = $request->PERSON_CONTACT[$i]["PERSON_PHONE_NUMBER"];
                $email = $request->PERSON_CONTACT[$i]["PERSON_EMAIL"];
                $createPersonContact = TPersonContact::create([
                    "PERSON_PHONE_NUMBER"   => $phoneNumber,
                    "PERSON_EMAIL"          => $email
                ]);

                // create mapping
                if ($createPersonContact) {
                    MPersonContact::create([
                        "PERSON_ID"         => $person,
                        "PERSON_CONTACT_ID" => $createPersonContact->PERSON_CONTACT_ID
                    ]);
                }
                
                
            }
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
        $dataPersonDetail = TPerson::with('ContactEmergency')->with('taxStatus')->with('Relation')->with('Structure')->with('Division')->with('Office')->with('Document')->with('MPersonContact')->with('mAddressPerson')->with('PersonEducation')->find($request->id);
        // dd($dataPersonDetail);

        return response()->json($dataPersonDetail);
    }

    public function addPersonEmployment(Request $request){
        // dd($request);
        // print_r($request);die;
        $endDate = $request->PERSON_END_DATE;
        if ($request->PERSON_CATEGORY == "1") {
            $endDate = NULL;
        }
        // Update Person
        $person = TPerson::where('PERSON_ID', $request->PERSON_ID)
            ->update([
                'PERSONE_ID' => $request->PERSONE_ID,
                'PERSON_CATEGORY' => $request->PERSON_CATEGORY,
                'PERSON_IS_DELETED' => $request->PERSON_IS_DELETED,
                'TAX_STATUS_ID' => $request->TAX_STATUS_ID,
                'PERSON_HIRE_DATE' => $request->PERSON_HIRE_DATE,
                'PERSON_END_DATE' => $endDate,
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

    public function editPersonEmployment(Request $request){
        // dd($request);
        // print_r($request);die;
        $endDate = $request->PERSON_END_DATE;
        if ($request->PERSON_CATEGORY == "1") {
            $endDate = NULL;
        }
        // Update Person
        $person = TPerson::where('PERSON_ID', $request->PERSON_ID)
            ->update([
                'PERSONE_ID' => $request->PERSONE_ID,
                'PERSON_CATEGORY' => $request->PERSON_CATEGORY,
                'PERSON_IS_DELETED' => $request->PERSON_IS_DELETED,
                'TAX_STATUS_ID' => $request->TAX_STATUS_ID,
                'PERSON_HIRE_DATE' => $request->PERSON_HIRE_DATE,
                'PERSON_END_DATE' => $endDate,
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

    public function get_regency(Request $request){
        // dd($request);
        $idValue = $request->valueKode.".";
        $data = RWilayahKemendagri::where('tipe_wilayah', 'regency')->where('kode_mapping', 'like', '%'. $idValue .'%')->get();
        return response()->json($data);
    }

    public function get_district(Request $request){
        // dd($request);
        // $idValue = $request->valueKode.".";
        $data = RWilayahKemendagri::where('tipe_wilayah', 'district')->where('kode_mapping', 'like', '%'. $request->valueKode .'%')->get();
        return response()->json($data);
    }
    public function get_village(Request $request){
        // dd($request);
        // $idValue = $request->valueKode.".";
        $data = RWilayahKemendagri::where('tipe_wilayah', 'village')->where('kode_mapping', 'like', '%'. $request->valueKode .'%')->get();
        return response()->json($data);
    }

    public function add_address_person(Request $request){
        // 1. address_ktp
        // 2. address_domicile
        // 3. other_address
        // cek array kosong atau tidak, klo kosong false klo ada true
        $addressKtp = is_countable($request->address_ktp);
        $addressDomisili = is_countable($request->address_domicile);
        $addressOther = is_countable($request->other_address);

        // jika other dan domisili gaada create ktp address dan domisili 
        if ($addressKtp) {
            for ($i=0; $i < sizeof($request->address_ktp); $i++) { 
                $createAddressKTP = TAddress::create([
                    "ADDRESS_LOCATION_TYPE"         => 1,
                    "ADDRESS_DETAIL"                => $request->address_ktp[$i]['ADDRESS_DETAIL'], 
                    "ADDRESS_RT_NUMBER"             => $request->address_ktp[$i]['ADDRESS_RT_NUMBER'],
                    "ADDRESS_RW_NUMBER"             => $request->address_ktp[$i]['ADDRESS_RW_NUMBER'],
                    "ADDRESS_VILLAGE"               => $request->address_ktp[$i]['ADDRESS_VILLAGE']['value'],
                    "ADDRESS_DISTRICT"              => $request->address_ktp[$i]['ADDRESS_DISTRICT']['value'],
                    "ADDRESS_PROVINCE"              => $request->address_ktp[$i]['ADDRESS_PROVINCE']['value'],
                    "ADDRESS_REGENCY"               => $request->address_ktp[$i]['ADDRESS_REGENCY']['value'],
                    "ADDRESS_STATUS"                => null
                ]);

                // create mapping
                if ($createAddressKTP) {
                    MPersonAddress::create([
                        "PERSON_ID"          => $request->address_ktp[$i]['idPerson'],
                        "ADDRESS_ID"         => $createAddressKTP->ADDRESS_ID
                    ]);
                }

                // jika address dom kosong ambil data dari address ktp
                if (!$addressDomisili) {
                    $createDom = TAddress::create([
                        "ADDRESS_LOCATION_TYPE"         => 2,
                        "ADDRESS_DETAIL"                => $request->address_ktp[$i]['ADDRESS_DETAIL'], 
                        "ADDRESS_RT_NUMBER"             => $request->address_ktp[$i]['ADDRESS_RT_NUMBER'],
                        "ADDRESS_RW_NUMBER"             => $request->address_ktp[$i]['ADDRESS_RW_NUMBER'],
                        "ADDRESS_VILLAGE"               => $request->address_ktp[$i]['ADDRESS_VILLAGE']['value'],
                        "ADDRESS_DISTRICT"              => $request->address_ktp[$i]['ADDRESS_DISTRICT']['value'],
                        "ADDRESS_PROVINCE"              => $request->address_ktp[$i]['ADDRESS_PROVINCE']['value'],
                        "ADDRESS_REGENCY"               => $request->address_ktp[$i]['ADDRESS_REGENCY']['value'],
                        "ADDRESS_STATUS"                => 1
                    ]);
    
                    // create mapping
                    if ($createDom) {
                        MPersonAddress::create([
                            "PERSON_ID"          => $request->address_ktp[$i]['idPerson'],
                            "ADDRESS_ID"         => $createDom->ADDRESS_ID
                        ]);
                    }
                }else{
                    // jika ada data dari dom address make data dom address
                    for ($a=0; $a < sizeof($request->address_domicile); $a++) { 
                        $createDom = TAddress::create([
                            "ADDRESS_LOCATION_TYPE"         => 2,
                            "ADDRESS_DETAIL"                => $request->address_domicile[$a]['ADDRESS_DETAIL'], 
                            "ADDRESS_RT_NUMBER"             => $request->address_domicile[$a]['ADDRESS_RT_NUMBER'],
                            "ADDRESS_RW_NUMBER"             => $request->address_domicile[$a]['ADDRESS_RW_NUMBER'],
                            "ADDRESS_VILLAGE"               => $request->address_domicile[$a]['ADDRESS_VILLAGE']['value'],
                            "ADDRESS_DISTRICT"              => $request->address_domicile[$a]['ADDRESS_DISTRICT']['value'],
                            "ADDRESS_PROVINCE"              => $request->address_domicile[$a]['ADDRESS_PROVINCE']['value'],
                            "ADDRESS_REGENCY"               => $request->address_domicile[$a]['ADDRESS_REGENCY']['value'],
                            "ADDRESS_STATUS"                => $request->address_domicile[$a]['ADDRESS_STATUS']
                        ]);
        
                        // create mapping
                        if ($createDom) {
                            MPersonAddress::create([
                                "PERSON_ID"          => $request->address_domicile[$a]['idPerson'],
                                "ADDRESS_ID"         => $createDom->ADDRESS_ID
                            ]);
                        }
                    }
                }

                // jika ada other address
                if ($addressOther) {
                    for ($z=0; $z < sizeof($request->other_address); $z++) { 
                        $createOther = TAddress::create([
                            "ADDRESS_LOCATION_TYPE"         => 3,
                            "ADDRESS_DETAIL"                => $request->other_address[$z]['ADDRESS_DETAIL'], 
                            "ADDRESS_RT_NUMBER"             => $request->other_address[$z]['ADDRESS_RT_NUMBER'],
                            "ADDRESS_RW_NUMBER"             => $request->other_address[$z]['ADDRESS_RW_NUMBER'],
                            "ADDRESS_VILLAGE"               => $request->other_address[$z]['ADDRESS_VILLAGE']['value'],
                            "ADDRESS_DISTRICT"              => $request->other_address[$z]['ADDRESS_DISTRICT']['value'],
                            "ADDRESS_PROVINCE"              => $request->other_address[$z]['ADDRESS_PROVINCE']['value'],
                            "ADDRESS_REGENCY"               => $request->other_address[$z]['ADDRESS_REGENCY']['value'],
                            "ADDRESS_STATUS"                => $request->other_address[$z]['ADDRESS_STATUS']
                        ]);
        
                        // create mapping
                        if ($createOther) {
                            MPersonAddress::create([
                                "PERSON_ID"          => $request->other_address[$z]['idPerson'],
                                "ADDRESS_ID"         => $createOther->ADDRESS_ID
                            ]);
                        }
                    }
                }
            }
        }

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
            "description" => "Add Address (Person).",
            "module"      => "Person",
                "id"          => $request->address_ktp[0]['idPerson']
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            $request->address_ktp[0]['idPerson']
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getPersonAddress(Request $request){
        $data = MPersonAddress::where('PERSON_ID', $request->id)->get();

        return response()->json($data);
    }
    
    public function getDetailAddress(Request $request){
        $data = TAddress::find($request->idAddress);

        return response()->json($data);
    }

    public function editAddress(Request $request){
        // dd($request);
        for ($i=0; $i < sizeof($request->dataEdit); $i++) { 
            if ($request->dataEdit[$i]['ADDRESS_LOCATION_TYPE'] != "1") {
                $editAddress = TAddress::where('ADDRESS_ID', $request->dataEdit[$i]['ADDRESS_ID'])->update([
                    "ADDRESS_LOCATION_TYPE"         =>  $request->dataEdit[$i]['ADDRESS_LOCATION_TYPE'],
                    "ADDRESS_DETAIL"                =>  $request->dataEdit[$i]['ADDRESS_DETAIL'],
                    "ADDRESS_RT_NUMBER"             =>  $request->dataEdit[$i]['ADDRESS_RT_NUMBER'],
                    "ADDRESS_RW_NUMBER"             =>  $request->dataEdit[$i]['ADDRESS_RW_NUMBER'],
                    "ADDRESS_VILLAGE"               =>  $request->dataEdit[$i]['ADDRESS_VILLAGE'],
                    "ADDRESS_DISTRICT"              =>  $request->dataEdit[$i]['ADDRESS_DISTRICT'],
                    "ADDRESS_PROVINCE"              =>  $request->dataEdit[$i]['ADDRESS_PROVINCE'],
                    "ADDRESS_REGENCY"               =>  $request->dataEdit[$i]['ADDRESS_REGENCY'],
                    "ADDRESS_STATUS"                =>  $request->dataEdit[$i]['ADDRESS_STATUS'],
                ]);
            }else{
                $editAddress = TAddress::where('ADDRESS_ID', $request->dataEdit[$i]['ADDRESS_ID'])->update([
                    "ADDRESS_LOCATION_TYPE"         =>  $request->dataEdit[$i]['ADDRESS_LOCATION_TYPE'],
                    "ADDRESS_DETAIL"                =>  $request->dataEdit[$i]['ADDRESS_DETAIL'],
                    "ADDRESS_RT_NUMBER"             =>  $request->dataEdit[$i]['ADDRESS_RT_NUMBER'],
                    "ADDRESS_RW_NUMBER"             =>  $request->dataEdit[$i]['ADDRESS_RW_NUMBER'],
                    "ADDRESS_VILLAGE"               =>  $request->dataEdit[$i]['ADDRESS_VILLAGE'],
                    "ADDRESS_DISTRICT"              =>  $request->dataEdit[$i]['ADDRESS_DISTRICT'],
                    "ADDRESS_PROVINCE"              =>  $request->dataEdit[$i]['ADDRESS_PROVINCE'],
                    "ADDRESS_REGENCY"               =>  $request->dataEdit[$i]['ADDRESS_REGENCY'],
                    // "ADDRESS_STATUS"                =>  $request->dataEdit[$i]['ADDRESS_STATUS'] == NULL ? NULL : $request->dataEdit[$i]['ADDRESS_STATUS'],
                ]);
            }
        }


        $addressOther = is_countable($request->other_address);
        // jika ada other address
        if ($addressOther) {
            for ($z=0; $z < sizeof($request->other_address); $z++) { 
                $createOther = TAddress::create([
                    "ADDRESS_LOCATION_TYPE"         => 3,
                    "ADDRESS_DETAIL"                => $request->other_address[$z]['ADDRESS_DETAIL'], 
                    "ADDRESS_RT_NUMBER"             => $request->other_address[$z]['ADDRESS_RT_NUMBER'],
                    "ADDRESS_RW_NUMBER"             => $request->other_address[$z]['ADDRESS_RW_NUMBER'],
                    "ADDRESS_VILLAGE"               => $request->other_address[$z]['ADDRESS_VILLAGE']['value'],
                    "ADDRESS_DISTRICT"              => $request->other_address[$z]['ADDRESS_DISTRICT']['value'],
                    "ADDRESS_PROVINCE"              => $request->other_address[$z]['ADDRESS_PROVINCE']['value'],
                    "ADDRESS_REGENCY"               => $request->other_address[$z]['ADDRESS_REGENCY']['value'],
                    "ADDRESS_STATUS"                => $request->other_address[$z]['ADDRESS_STATUS']
                ]);

                // create mapping
                if ($createOther) {
                    MPersonAddress::create([
                        "PERSON_ID"          => $request->other_address[$z]['idPerson'],
                        "ADDRESS_ID"         => $createOther->ADDRESS_ID
                    ]);
                }
            }
        }
        

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
            "description" => "Edit Address (Person).",
            "module"      => "Person",
                "id"          => $request->ADDRESS_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            $request->ADDRESS_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getEducationDegree(){
        $data = REducationDegree::get();

        return response()->json($data);
    }

    public function add_education_degree(Request $request){
        $educationDegree = is_countable($request->dataEducations);
        if ($educationDegree) {
            for ($i=0; $i < sizeof($request->dataEducations); $i++) { 
                $createEducationDegree = TPersonEducation::create([
                    "PERSON_ID"                             => $request->dataEducations[$i]['PERSON_ID'],
                    "PERSON_EDUCATION_START"                => $request->dataEducations[$i]['PERSON_EDUCATION_START'], 
                    "PERSON_EDUCATION_END"                  => $request->dataEducations[$i]['PERSON_EDUCATION_END'],
                    "EDUCATION_DEGREE_ID"                   => $request->dataEducations[$i]['EDUCATION_DEGREE_ID'],
                    "PERSON_EDUCATION_MAJOR"                => $request->dataEducations[$i]['PERSON_EDUCATION_MAJOR'],
                    "PERSON_EDUCATION_SCHOOL"               => $request->dataEducations[$i]['PERSON_EDUCATION_SCHOOL'],
                    "PERSON_EDUCATION_CREATED_BY"           => Auth::user()->id,
                    "PERSON_EDUCATION_CREATED_DATE"         => now(),
                ]);
            }
        }

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
            "description" => "Add Person Education (Person).",
            "module"      => "Person",
                "id"          => $request->dataEducations[0]['PERSON_ID']
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            $request->dataEducations[0]['PERSON_ID']
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    
    public function edit_education_degree(Request $request){
        // cek existing
        $dataExisting = TPersonEducation::where('PERSON_ID', $request->person_education[0]['PERSON_ID'])->get();
        if ($dataExisting->count()>0) { //jika ada delete data sebelumnya
            TPersonEducation::where('PERSON_ID', $request->person_education[0]['PERSON_ID'])->delete();
        }


        $educationDegree = is_countable($request->person_education);
        if ($educationDegree) {
            for ($i=0; $i < sizeof($request->person_education); $i++) { 
                $createEducationDegree = TPersonEducation::create([
                    "PERSON_ID"                             => $request->person_education[$i]['PERSON_ID'],
                    "PERSON_EDUCATION_START"                => $request->person_education[$i]['PERSON_EDUCATION_START'], 
                    "PERSON_EDUCATION_END"                  => $request->person_education[$i]['PERSON_EDUCATION_END'],
                    "EDUCATION_DEGREE_ID"                   => $request->person_education[$i]['EDUCATION_DEGREE_ID'],
                    "PERSON_EDUCATION_MAJOR"                => $request->person_education[$i]['PERSON_EDUCATION_MAJOR'],
                    "PERSON_EDUCATION_SCHOOL"               => $request->person_education[$i]['PERSON_EDUCATION_SCHOOL'],
                    "PERSON_EDUCATION_CREATED_BY"           => Auth::user()->id,
                    "PERSON_EDUCATION_CREATED_DATE"         => now(),
                ]);
            }
        }

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
            "description" => "Edit Person Education (Person).",
            "module"      => "Person",
                "id"          => $request->person_education[0]['PERSON_ID']
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            $request->person_education[0]['PERSON_ID']
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getQualification(){
        $data = RCertificateQualification::get();

        return response()->json($data);
    }
    
}   

