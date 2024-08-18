<?php

namespace App\Http\Controllers;

use App\Models\MEmployeeContact;
use App\Models\TEmployee;
use App\Models\TEmployeeContact;
use App\Models\TEmployeeEmergencyContact;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TEmployeeController extends Controller
{
    public function getEmployeeData($request)
    {
        // dd(json_decode($request->newFilter, true));
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = TEmployee::query();
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
        // dd($newSearch[0]['RELATION_TYPE_ID']['value']);

        // if ($request->newFilter !== "") {
        //     if ($newSearch[0]["flag"] !== "") {
        //         $query->where('RELATION_ORGANIZATION_NAME', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
        //     }else{
        //         foreach ($newSearch[0] as $keyId => $searchValue) {
        //             if ($keyId === 'RELATION_ORGANIZATION_NAME') {
        //                 $query->where('RELATION_ORGANIZATION_NAME', 'LIKE', '%' . $searchValue . '%');
        //             }elseif ($keyId === 'RELATION_TYPE_ID'){
        //                 if (!isset($searchValue['value'])) {
        //                     $valueTypeId = $searchValue;
        //                 }else{
        //                     $valueTypeId = $searchValue['value'];
        //                 }
        //                 // dd($searchValue);
        //                 $query->whereHas('mRelationType', function($q) use($valueTypeId) {
        //                     // Query the name field in status table
        //                     $q->where('RELATION_TYPE_ID', 'like', '%'.$valueTypeId.'%');
        //                 });
        //             }
        //         }
        //     }
        // }
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    public function getEmployeeJson(Request $request)
    {
        $data = $this->getEmployeeData($request);
        return response()->json($data);
    }


    public function store(Request $request){
        $employee = TEmployee::create([
            "EMPLOYEE_FIRST_NAME"               => $request->EMPLOYEE_FIRST_NAME,
            "EMPLOYEE_GENDER"                   => $request->EMPLOYEE_GENDER,
            "EMPLOYEE_BIRTH_PLACE"              => $request->EMPLOYEE_BIRTH_PLACE,
            "EMPLOYEE_BIRTH_DATE"               => $request->EMPLOYEE_BIRTH_DATE,
            "EMPLOYEE_KTP"                      => $request->EMPLOYEE_KTP,
            "EMPLOYEE_NPWP"                     => $request->EMPLOYEE_NPWP,
            "EMPLOYEE_KK"                       => $request->EMPLOYEE_KK,
            "EMPLOYEE_BLOOD_TYPE"               => $request->EMPLOYEE_BLOOD_TYPE,
            "EMPLOYEE_BLOOD_RHESUS"             => $request->EMPLOYEE_BLOOD_RHESUS,
            "EMPLOYEE_MARITAL_STATUS"           => $request->EMPLOYEE_MARITAL_STATUS,
            "STRUCTURE_ID"                      => $request->STRUCTURE_ID,
            "DIVISION_ID"                       => $request->DIVISION_ID,
            "OFFICE_ID"                         => $request->OFFICE_ID,
            "COMPANY_ID"                        => $request->COMPANY_ID,
            "EMPLOYEE_CREATED_BY"               => Auth::user()->id,
            "EMPLOYEE_CREATED_DATE"             => now()
        ]);

        // created eMPLOYEE contact
        if (is_countable($request->employee_contact)) {
            for ($i=0; $i < sizeof($request->employee_contact); $i++) { 
                $phoneNumber = $request->employee_contact[$i]["EMPLOYEE_PHONE_NUMBER"];
                $email = $request->employee_contact[$i]["EMPLOYEE_EMAIL"];

                $createEmployeeContact = TEmployeeContact::create([
                    "EMPLOYEE_PHONE_NUMBER"   => $phoneNumber,
                    "EMPLOYEE_EMAIL"          => $email
                ]);

                if ($createEmployeeContact) {
                    MEmployeeContact::create([
                        "EMPLOYEE_ID"         => $employee->EMPLOYEE_ID,
                        "EMPLOYEE_CONTACT_ID" => $createEmployeeContact->EMPLOYEE_CONTACT_ID
                    ]);
                }
                
                
            }
        }

        // created emergency contact
        if (is_countable($request->emergency_contact)) {
            // Created Mapping Relation AKA
            for ($i=0; $i < sizeof($request->emergency_contact); $i++) { 
                TEmployeeEmergencyContact::create([
                    "EMPLOYEE_ID" => $employee->EMPLOYEE_ID,
                    "EMPLOYEE_EMERGENCY_CONTACT_NAME" => $request->emergency_contact[$i]["NAME_CONTACT_EMERGENCY"],
                    "EMPLOYEE_EMERGENCY_CONTACT_NUMBER" => $request->emergency_contact[$i]["PHONE_CONTACT_EMERGENCY"],
                    "EMPLOYEE_RELATIONSHIP_ID" => $request->emergency_contact[$i]["PERSON_RELATIONSHIP"]
                ]);
            }
        }

        // Created Log
        UserLog::create([
                "created_by" => Auth::user()->id,
                "action"     => json_encode([
                "description" => "Created (Employee).",
                "module"      => "Employee",
                "id"          => $employee->EMPLOYEE_ID,
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            $employee->EMPLOYEE_ID,
            "Created Employee Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_employeeById(Request $request){
        $data = TEmployee::with('Company')->with('MEmploymentContact')->with('TEmploymentEmergency')->where('EMPLOYEE_ID', $request->idEmployee)->first();
        return response()->json($data);
    }

    public function edit_Employee(Request $request){
        TEmployee::where('EMPLOYEE_ID', $request->EMPLOYEE_ID)->update([
            "EMPLOYEE_FIRST_NAME"               => $request->EMPLOYEE_FIRST_NAME,
            "EMPLOYEE_GENDER"                   => $request->EMPLOYEE_GENDER,
            "EMPLOYEE_BIRTH_PLACE"              => $request->EMPLOYEE_BIRTH_PLACE,
            "EMPLOYEE_BIRTH_DATE"               => $request->EMPLOYEE_BIRTH_DATE,
            "EMPLOYEE_KTP"                      => $request->EMPLOYEE_KTP,
            "EMPLOYEE_NPWP"                     => $request->EMPLOYEE_NPWP,
            "EMPLOYEE_KK"                       => $request->EMPLOYEE_KK,
            "EMPLOYEE_BLOOD_TYPE"               => $request->EMPLOYEE_BLOOD_TYPE,
            "EMPLOYEE_BLOOD_RHESUS"             => $request->EMPLOYEE_BLOOD_RHESUS,
            "EMPLOYEE_MARITAL_STATUS"           => $request->EMPLOYEE_MARITAL_STATUS,
            "STRUCTURE_ID"                      => $request->STRUCTURE_ID,
            "DIVISION_ID"                       => $request->DIVISION_ID,
            "OFFICE_ID"                         => $request->OFFICE_ID,
            "COMPANY_ID"                        => $request->COMPANY_ID,
            "EMPLOYEE_UPDATED_BY"               => Auth::user()->id,
            "EMPLOYEE_UPDATED_DATE"             => now()
        ]);

        // cek existing Employee Contact
        $employeeContact = MEmployeeContact::where('EMPLOYEE_ID', $request->EMPLOYEE_ID)->get();
        for ($i=0; $i < sizeof($employeeContact); $i++) { 
            $idEmployeeContact = $employeeContact[$i]['EMPLOYEE_CONTACT_ID'];
            // delete person contact
            $deleteMPerson = TEmployeeContact::where('EMPLOYEE_CONTACT_ID', $idEmployeeContact)->delete();
        }

        if ($employeeContact->count()>0) { //jika ada delete data sebelumnya
            MEmployeeContact::where('EMPLOYEE_ID', $request->EMPLOYEE_ID)->delete();
        }

        // created eMPLOYEE contact
        if (is_countable($request->m_employment_contact)) {
            // Created Mapping Relation AKA
            for ($i=0; $i < sizeof($request->m_employment_contact); $i++) { 
                $phoneNumber = $request->m_employment_contact[$i]['t_employee_contact']['EMPLOYEE_PHONE_NUMBER'];
                $email = $request->m_employment_contact[$i]['t_employee_contact']['EMPLOYEE_EMAIL'];
                $createPersonContact = TEmployeeContact::create([
                    "EMPLOYEE_PHONE_NUMBER"   => $phoneNumber,
                    "EMPLOYEE_EMAIL"          => $email
                ]);

                // create mapping
                if ($createPersonContact) {
                    MEmployeeContact::create([
                        "EMPLOYEE_ID"         => $request->EMPLOYEE_ID,
                        "EMPLOYEE_CONTACT_ID" => $createPersonContact->EMPLOYEE_CONTACT_ID
                    ]);
                }
            }
        }

        $contactEmergency = TEmployeeEmergencyContact::where('EMPLOYEE_ID', $request->EMPLOYEE_ID)->get();
        if ($contactEmergency->count()>0) { //jika ada delete data sebelumnya
            TEmployeeEmergencyContact::where('EMPLOYEE_ID', $request->EMPLOYEE_ID)->delete();
        }

        // created emergency contact
        if (is_countable($request->t_employment_emergency)) {
            // Created Mapping Relation AKA
            for ($i=0; $i < sizeof($request->t_employment_emergency); $i++) { 
                TEmployeeEmergencyContact::create([
                    "EMPLOYEE_ID" => $request->EMPLOYEE_ID,
                    "EMPLOYEE_EMERGENCY_CONTACT_NAME" => $request->t_employment_emergency[$i]["EMPLOYEE_EMERGENCY_CONTACT_NAME"],
                    "EMPLOYEE_EMERGENCY_CONTACT_NUMBER" => $request->t_employment_emergency[$i]["EMPLOYEE_EMERGENCY_CONTACT_NUMBER"],
                    "EMPLOYEE_RELATIONSHIP_ID" => $request->t_employment_emergency[$i]["EMPLOYEE_RELATIONSHIP_ID"]
                ]);
            }
        }

        // Created Log
        UserLog::create([
                "created_by" => Auth::user()->id,
                "action"     => json_encode([
                "description" => "Edited (Employee).",
                "module"      => "Employee",
                "id"          =>  $request->EMPLOYEE_ID,
            ]),
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            $request->EMPLOYEE_ID,
            "Edited Employee Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
