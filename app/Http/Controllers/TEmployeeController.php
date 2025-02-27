<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\MAddressEmployee;
use App\Models\MEmployeeContact;
use App\Models\MEmployeeDocument;
use App\Models\MForEmployeeBankAccount;
use App\Models\TAddress;
use App\Models\TEmployee;
use App\Models\TEmployeeBankAccount;
use App\Models\TEmployeeCertificate;
use App\Models\TEmployeeContact;
use App\Models\TEmployeeEducation;
use App\Models\TEmployeeEmergencyContact;
use App\Models\TEmployeeFamilyMember;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TEmployeeController extends Controller
{
    public function RemoveSpecialChar($str)
    {
        $replace = Str::of($str)->replace(
            [
                '`',
                '~',
                ' ',
                '!',
                '@',
                '#',
                '$',
                '%',
                '^',
                '&',
                '*',
                '(',
                ')',
                '+',
                '=',
                '<',
                '>',
                '{',
                '}',
                '[',
                ']',
                '?',
                '/',
                ':',
                ';'
            ],
            '-'
        );
        return $replace;
    }

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

        if ($request->newFilter !== "") {
            if ($newSearch[0]["flag"] !== "") {
                $query->where('EMPLOYEE_FIRST_NAME', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
            } else {
                // dd("masuk sini");
                foreach ($newSearch[0] as $keyId => $searchValue) {
                    if ($keyId === 'EMPLOYEE_FIRST_NAME') {
                        $query->where('EMPLOYEE_FIRST_NAME', 'LIKE', '%' . $searchValue . '%');
                    }
                }
            }
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    public function getEmployeeJson(Request $request)
    {
        $data = $this->getEmployeeData($request);
        return response()->json($data);
    }

    public function getAllEmployeeJson()
    {
        $data = TEmployee::all();
        return response()->json($data);
    }


    public function store(Request $request)
    {
        $STRUCTURE_ID = $request->STRUCTURE_ID;
        if ($request->STRUCTURE_ID != NULL || $request->STRUCTURE_ID != "") {
            $STRUCTURE_ID = $request->STRUCTURE_ID['value'];
        }

        $DIVISION_ID = $request->DIVISION_ID;
        if ($request->DIVISION_ID != NULL || $request->DIVISION_ID != "") {
            $DIVISION_ID = $request->DIVISION_ID['value'];
        }

        $OFFICE_ID = $request->OFFICE_ID;
        if ($request->OFFICE_ID != NULL || $request->OFFICE_ID != "") {
            $OFFICE_ID = $request->OFFICE_ID['value'];
        }
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
            "STRUCTURE_ID"                      => $STRUCTURE_ID,
            "DIVISION_ID"                       => $DIVISION_ID,
            "OFFICE_ID"                         => $OFFICE_ID,
            "COMPANY_ID"                        => $request->COMPANY_ID,
            "EMPLOYEE_CREATED_BY"               => Auth::user()->id,
            "EMPLOYEE_CREATED_DATE"             => now()
        ]);

        // created eMPLOYEE contact
        if (is_countable($request->employee_contact)) {
            for ($i = 0; $i < sizeof($request->employee_contact); $i++) {
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
            for ($i = 0; $i < sizeof($request->emergency_contact); $i++) {
                TEmployeeEmergencyContact::create([
                    "EMPLOYEE_ID" => $employee->EMPLOYEE_ID,
                    "EMPLOYEE_EMERGENCY_CONTACT_NAME" => $request->emergency_contact[$i]["NAME_CONTACT_EMERGENCY"],
                    "EMPLOYEE_EMERGENCY_CONTACT_NUMBER" => $request->emergency_contact[$i]["PHONE_CONTACT_EMERGENCY"],
                    "EMPLOYEE_RELATIONSHIP_ID" => $request->emergency_contact[$i]["PERSON_RELATIONSHIP"]
                ]);
            }
        }

        // created emergency contact
        if (is_countable($request->family_member)) {
            // Created Mapping Relation AKA
            for ($i = 0; $i < sizeof($request->family_member); $i++) {
                TEmployeeFamilyMember::create([
                    "EMPLOYEE_ID" => $employee->EMPLOYEE_ID,
                    "EMPLOYEE_FAMILY_MEMBER_NAME" => $request->family_member[$i]["NAME_FAMILY_MEMBER"],
                    "EMPLOYEE_RELATIONSHIP_ID" => $request->family_member[$i]["FAMILY_MEMBER"]
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
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $employee->EMPLOYEE_ID,
            "Created Employee Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_employeeById(Request $request)
    {
        $data = TEmployee::with('Company')->with('MEmploymentContact')->with('TEmploymentEmergency')->with('TEmploymentFamilyMember')->with('mAddressEmployee')->with('TEmployeeBank')->with('Document')->with('office')->with('structure')->with('divisionCompany')->where('EMPLOYEE_ID', $request->idEmployee)->first();
        return response()->json($data);
    }

    public function get_detail(Request $request)
    {
        $data = TEmployee::with('taxStatus')->with('employeeEducation')->with('employeeCertificate')->with('MEmployeeDocument')->where('EMPLOYEE_ID', $request->id)->first();
        return response()->json($data);
    }


    public function edit_Employee(Request $request)
    {
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
        for ($i = 0; $i < sizeof($employeeContact); $i++) {
            $idEmployeeContact = $employeeContact[$i]['EMPLOYEE_CONTACT_ID'];
            // delete person contact
            $deleteMPerson = TEmployeeContact::where('EMPLOYEE_CONTACT_ID', $idEmployeeContact)->delete();
        }

        if ($employeeContact->count() > 0) { //jika ada delete data sebelumnya
            MEmployeeContact::where('EMPLOYEE_ID', $request->EMPLOYEE_ID)->delete();
        }

        // created eMPLOYEE contact
        if (is_countable($request->m_employment_contact)) {
            // Created Mapping Relation AKA
            for ($i = 0; $i < sizeof($request->m_employment_contact); $i++) {
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
        if ($contactEmergency->count() > 0) { //jika ada delete data sebelumnya
            TEmployeeEmergencyContact::where('EMPLOYEE_ID', $request->EMPLOYEE_ID)->delete();
        }

        // created emergency contact
        if (is_countable($request->t_employment_emergency)) {
            // Created Mapping Relation AKA
            for ($i = 0; $i < sizeof($request->t_employment_emergency); $i++) {
                TEmployeeEmergencyContact::create([
                    "EMPLOYEE_ID" => $request->EMPLOYEE_ID,
                    "EMPLOYEE_EMERGENCY_CONTACT_NAME" => $request->t_employment_emergency[$i]["EMPLOYEE_EMERGENCY_CONTACT_NAME"],
                    "EMPLOYEE_EMERGENCY_CONTACT_NUMBER" => $request->t_employment_emergency[$i]["EMPLOYEE_EMERGENCY_CONTACT_NUMBER"],
                    "EMPLOYEE_RELATIONSHIP_ID" => $request->t_employment_emergency[$i]["EMPLOYEE_RELATIONSHIP_ID"]
                ]);
            }
        }

        // for family member
        $contactEmergency = TEmployeeFamilyMember::where('EMPLOYEE_ID', $request->EMPLOYEE_ID)->get();
        if ($contactEmergency->count() > 0) { //jika ada delete data sebelumnya
            TEmployeeFamilyMember::where('EMPLOYEE_ID', $request->EMPLOYEE_ID)->delete();
        }

        // created emergency contact
        if (is_countable($request->t_employment_family_member)) {
            // Created Mapping Relation AKA
            for ($i = 0; $i < sizeof($request->t_employment_family_member); $i++) {
                TEmployeeFamilyMember::create([
                    "EMPLOYEE_ID" => $request->EMPLOYEE_ID,
                    "EMPLOYEE_FAMILY_MEMBER_NAME" => $request->t_employment_family_member[$i]["EMPLOYEE_FAMILY_MEMBER_NAME"],
                    "EMPLOYEE_RELATIONSHIP_ID" => $request->t_employment_family_member[$i]["EMPLOYEE_RELATIONSHIP_ID"]
                ]);
            }
        }
        // end for family member

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Edited (Employee).",
                "module"      => "Employee",
                "id"          =>  $request->EMPLOYEE_ID,
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->EMPLOYEE_ID,
            "Edited Employee Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function employmentEdit(Request $request)
    {
        // dd($request);
        // print_r($request);die;
        $endDate = $request->EMPLOYEE_END_DATE;
        if ($request->EMPLOYEE_CATEGORY == "1") {
            $endDate = NULL;
        }
        // Update Person
        $person = TEmployee::where('EMPLOYEE_ID', $request->EMPLOYEE_ID)
            ->update([
                'EMPLOYEE_NUMBER_ID' => $request->EMPLOYEE_NUMBER_ID,
                'EMPLOYEE_CATEGORY' => $request->EMPLOYEE_CATEGORY,
                'EMPLOYEE_IS_DELETED' => $request->EMPLOYEE_IS_DELETED,
                'TAX_STATUS_ID' => $request->TAX_STATUS_ID,
                'EMPLOYEE_HIRE_DATE' => $request->EMPLOYEE_HIRE_DATE,
                'EMPLOYEE_END_DATE' => $endDate,
                'EMPLOYEE_RECRUITMENT_LOCATION' => $request->EMPLOYEE_RECRUITMENT_LOCATION,
                'EMPLOYEE_SALARY_ADJUSTMENT1' => $request->EMPLOYEE_SALARY_ADJUSTMENT1,
                'EMPLOYEE_SALARY_ADJUSTMENT2' => $request->EMPLOYEE_SALARY_ADJUSTMENT2,
                'EMPLOYEE_UPDATED_BY' => Auth::user()->id,
                'EMPLOYEE_UPDATED_DATE' => now()
            ]);

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Updated (Employee).",
                "module"      => "Employee",
                "id"          => $request->EMPLOYEE_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->EMPLOYEE_ID,
            "Employee Edit Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function editEmployeeDetail(Request $request)
    {
        // dd($request);
        // print_r($request);die;
        $endDate = $request->EMPLOYEE_END_DATE;
        if ($request->EMPLOYEE_CATEGORY == "1") {
            $endDate = NULL;
        }
        // Update Person
        $person = TEmployee::where('EMPLOYEE_ID', $request->EMPLOYEE_ID)
            ->update([
                'EMPLOYEE_NUMBER_ID' => $request->EMPLOYEE_NUMBER_ID,
                'EMPLOYEE_CATEGORY' => $request->EMPLOYEE_CATEGORY,
                'EMPLOYEE_IS_DELETED' => $request->EMPLOYEE_IS_DELETED,
                'TAX_STATUS_ID' => $request->TAX_STATUS_ID,
                'EMPLOYEE_HIRE_DATE' => $request->EMPLOYEE_HIRE_DATE,
                'EMPLOYEE_END_DATE' => $endDate,
                'EMPLOYEE_RECRUITMENT_LOCATION' => $request->EMPLOYEE_RECRUITMENT_LOCATION,
                'EMPLOYEE_SALARY_ADJUSTMENT1' => $request->EMPLOYEE_SALARY_ADJUSTMENT1,
                'EMPLOYEE_SALARY_ADJUSTMENT2' => $request->EMPLOYEE_SALARY_ADJUSTMENT2,
                'EMPLOYEE_UPDATED_BY' => Auth::user()->id,
                'EMPLOYEE_UPDATED_DATE' => now()
            ]);

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Updated (Employee).",
                "module"      => "Employee",
                "id"          => $request->EMPLOYEE_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->EMPLOYEE_ID,
            "Employee Edit Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function add_education_degree(Request $request)
    {
        $educationDegree = is_countable($request->dataEducations);
        if ($educationDegree) {
            for ($i = 0; $i < sizeof($request->dataEducations); $i++) {
                $createEducationDegree = TEmployeeEducation::create([
                    "EMPLOYEE_ID"                             => $request->dataEducations[$i]['EMPLOYEE_ID'],
                    "EMPLOYEE_EDUCATION_START"                => $request->dataEducations[$i]['EMPLOYEE_EDUCATION_START'],
                    "EMPLOYEE_EDUCATION_END"                  => $request->dataEducations[$i]['EMPLOYEE_EDUCATION_END'],
                    "EDUCATION_DEGREE_ID"                     => $request->dataEducations[$i]['EDUCATION_DEGREE_ID'],
                    "EMPLOYEE_EDUCATION_MAJOR"                => $request->dataEducations[$i]['EMPLOYEE_EDUCATION_MAJOR'],
                    "EMPLOYEE_EDUCATION_SCHOOL"               => $request->dataEducations[$i]['EMPLOYEE_EDUCATION_SCHOOL'],
                    "EMPLOYEE_EDUCATION_CREATED_BY"           => Auth::user()->id,
                    "EMPLOYEE_EDUCATION_CREATED_DATE"         => now(),
                ]);
            }
        }

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Add Employee Education (Employee).",
                "module"      => "Employee",
                "id"          => $request->dataEducations[0]['EMPLOYEE_ID']
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->dataEducations[0]['EMPLOYEE_ID'],
            "Employee Education Added"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function edit_education_degree(Request $request)
    {
        // cek existing
        $dataExisting = TEmployeeEducation::where('EMPLOYEE_ID', $request->employee_education[0]['EMPLOYEE_ID'])->get();
        if ($dataExisting->count() > 0) { //jika ada delete data sebelumnya
            TEmployeeEducation::where('EMPLOYEE_ID', $request->employee_education[0]['EMPLOYEE_ID'])->delete();
        }


        $educationDegree = is_countable($request->employee_education);
        if ($educationDegree) {
            for ($i = 0; $i < sizeof($request->employee_education); $i++) {
                $createEducationDegree = TEmployeeEducation::create([
                    "EMPLOYEE_ID"                             => $request->employee_education[$i]['EMPLOYEE_ID'],
                    "EMPLOYEE_EDUCATION_START"                => $request->employee_education[$i]['EMPLOYEE_EDUCATION_START'],
                    "EMPLOYEE_EDUCATION_END"                  => $request->employee_education[$i]['EMPLOYEE_EDUCATION_END'],
                    "EDUCATION_DEGREE_ID"                     => $request->employee_education[$i]['EDUCATION_DEGREE_ID'],
                    "EMPLOYEE_EDUCATION_MAJOR"                => $request->employee_education[$i]['EMPLOYEE_EDUCATION_MAJOR'],
                    "EMPLOYEE_EDUCATION_SCHOOL"               => $request->employee_education[$i]['EMPLOYEE_EDUCATION_SCHOOL'],
                    "EMPLOYEE_EDUCATION_CREATED_BY"           => Auth::user()->id,
                    "EMPLOYEE_EDUCATION_CREATED_DATE"         => now(),
                ]);
            }
        }

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Edit Employee Education (Employee).",
                "module"      => "Employee",
                "id"          => $request->employee_education[0]['EMPLOYEE_ID']
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->employee_education[0]['EMPLOYEE_ID'],
            "Employee Education Edited"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function add_Certificate(Request $request)
    {
        $certificate = is_countable($request->dataCertificates);
        if ($certificate) {
            for ($i = 0; $i < sizeof($request->dataCertificates); $i++) {
                $qualification = 0;
                $isQualification = 0;
                if ($request->dataCertificates[$i]['CERTIFICATE_QUALIFICATION_ID'] != null && $request->dataCertificates[$i]['EMPLOYEE_CERTIFICATE_IS_QUALIFICATION'] != null) {
                    $qualification = $request->dataCertificates[$i]['CERTIFICATE_QUALIFICATION_ID'];
                    $isQualification = $request->dataCertificates[$i]['EMPLOYEE_CERTIFICATE_IS_QUALIFICATION'];
                }

                $createCertificate = TEmployeeCertificate::create([
                    "EMPLOYEE_ID"                                 => $request->dataCertificates[$i]['EMPLOYEE_ID'],
                    "EMPLOYEE_CERTIFICATE_NAME"                   => $request->dataCertificates[$i]['EMPLOYEE_CERTIFICATE_NAME'],
                    "EMPLOYEE_CERTIFICATE_IS_QUALIFICATION"       => $isQualification,
                    "CERTIFICATE_QUALIFICATION_ID"              => $qualification,
                    "EMPLOYEE_CERTIFICATE_POINT"                  => $request->dataCertificates[$i]['EMPLOYEE_CERTIFICATE_POINT'],
                    "EMPLOYEE_CERTIFICATE_START_DATE"             => $request->dataCertificates[$i]['EMPLOYEE_CERTIFICATE_START_DATE'],
                    "EMPLOYEE_CERTIFICATE_EXPIRES_DATE"           => $request->dataCertificates[$i]['EMPLOYEE_CERTIFICATE_EXPIRES_DATE'],
                    "EMPLOYEE_CERTIFICATE_CREATED_BY"             => Auth::user()->id,
                    "EMPLOYEE_CERTIFICATE_CREATED_DATE"           => now(),
                ]);
            }
        }

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Add Employee Certificate (Employee).",
                "module"      => "Employee",
                "id"          => $request->dataCertificates[0]['EMPLOYEE_ID']
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->dataCertificates[0]['EMPLOYEE_ID'],
            "Employee Certificate Added"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function edit_Certificate(Request $request)
    {
        $dataExisting = TEmployeeCertificate::where('EMPLOYEE_ID', $request->employee_certificate[0]['EMPLOYEE_ID'])->get();
        if ($dataExisting->count() > 0) { //jika ada delete data sebelumnya
            TEmployeeCertificate::where('EMPLOYEE_ID', $request->employee_certificate[0]['EMPLOYEE_ID'])->delete();
        }

        $certificate = is_countable($request->employee_certificate);
        if ($certificate) {
            for ($i = 0; $i < sizeof($request->employee_certificate); $i++) {

                $pointNew = NULL;
                $qualification = 0;
                if ($request->employee_certificate[$i]['CERTIFICATE_QUALIFICATION_ID'] != 1 && $request->employee_certificate[$i]['CERTIFICATE_QUALIFICATION_ID'] != 2 && $request->employee_certificate[$i]['CERTIFICATE_QUALIFICATION_ID'] != 3 && $request->employee_certificate[$i]['EMPLOYEE_CERTIFICATE_IS_QUALIFICATION'] == 1) {
                    $pointNew = $request->employee_certificate[$i]['EMPLOYEE_CERTIFICATE_POINT'];
                }

                if ($request->employee_certificate[$i]['EMPLOYEE_CERTIFICATE_IS_QUALIFICATION'] == 1) {
                    $qualification = $request->employee_certificate[$i]['CERTIFICATE_QUALIFICATION_ID'];
                }



                $createCertificate = TEmployeeCertificate::create([
                    "EMPLOYEE_ID"                                 => $request->employee_certificate[$i]['EMPLOYEE_ID'],
                    "EMPLOYEE_CERTIFICATE_NAME"                   => $request->employee_certificate[$i]['EMPLOYEE_CERTIFICATE_NAME'],
                    "EMPLOYEE_CERTIFICATE_IS_QUALIFICATION"       => $request->employee_certificate[$i]['EMPLOYEE_CERTIFICATE_IS_QUALIFICATION'],
                    "CERTIFICATE_QUALIFICATION_ID"              => $qualification,
                    "EMPLOYEE_CERTIFICATE_POINT"                  => $pointNew,
                    "EMPLOYEE_CERTIFICATE_START_DATE"             => $request->employee_certificate[$i]['EMPLOYEE_CERTIFICATE_START_DATE'],
                    "EMPLOYEE_CERTIFICATE_EXPIRES_DATE"           => $request->employee_certificate[$i]['EMPLOYEE_CERTIFICATE_EXPIRES_DATE'],
                    "EMPLOYEE_CERTIFICATE_CREATED_BY"             => Auth::user()->id,
                    "EMPLOYEE_CERTIFICATE_CREATED_DATE"           => now(),
                ]);
            }
        }

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Edit Employee Certificate (Employee).",
                "module"      => "Employee",
                "id"          => $request->employee_certificate[0]['EMPLOYEE_ID']
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->employee_certificate[0]['EMPLOYEE_ID'],
            "Employee Certificate Edited"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function add_document(Request $request)
    {
        // add Document KTP
        $ktpDocument = is_countable($request->file('ktp_document'));
        $otherDocument = is_countable($request->file('other_document'));

        //upload file ktp
        if ($ktpDocument) {
            for ($i = 0; $i < sizeof($request->file('ktp_document')); $i++) {
                $uploadDocument = $request->file('ktp_document');

                // Create Folder For Person Document
                $parentDir = ((floor(($request->EMPLOYEE_ID) / 1000)) * 1000) . '/';
                $employeeID = $request->EMPLOYEE_ID . '/';
                $typeDir = "";
                $uploadPath = 'documents/' . 'Employee/' . $parentDir . $employeeID . $typeDir;


                // get Data Document
                $documentOriginalName = $this->RemoveSpecialChar($uploadDocument[$i]->getClientOriginalName());
                $documentFileName = $this->RemoveSpecialChar($uploadDocument[$i]->getClientOriginalName());
                $documentDirName = $uploadPath;
                $documentFileType = $uploadDocument[$i]->getClientMimeType();
                $documentFileSize = $uploadDocument[$i]->getSize();

                // masukan data file ke database
                $document = Document::create([
                    'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                    'DOCUMENT_FILENAME'             => "",
                    'DOCUMENT_DIRNAME'              => $documentDirName,
                    'DOCUMENT_FILETYPE'             => $documentFileType,
                    'DOCUMENT_FILESIZE'             => $documentFileSize,
                    'DOCUMENT_CREATED_BY'           => Auth::user()->id
                ])->DOCUMENT_ID;

                if ($document) {
                    // update file name "DOCUMENT_ID - FILENAME"
                    Document::where('DOCUMENT_ID', $document)->update([
                        'DOCUMENT_FILENAME'             => $document . "-" . $documentOriginalName,
                    ]);

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $uploadDocument[$i], $document . "-" . $this->RemoveSpecialChar($uploadDocument[$i]->getClientOriginalName()));
                }


                if ($document) {
                    MEmployeeDocument::create([
                        'EMPLOYEE_ID'     => $request->EMPLOYEE_ID,
                        'DOCUMENT_ID'   => $document,
                        'CATEGORY_DOCUMENT' => 1
                    ]);
                }
            }
        }


        // upload file other document
        if ($otherDocument) {
            for ($i = 0; $i < sizeof($request->file('other_document')); $i++) {
                $uploadDocument = $request->file('other_document');

                // Create Folder For Person Document
                $parentDir = ((floor(($request->EMPLOYEE_ID) / 1000)) * 1000) . '/';
                $employeeID = $request->EMPLOYEE_ID . '/';
                $typeDir = "";
                $uploadPath = 'documents/' . 'Employee/' . $parentDir . $employeeID . $typeDir;


                // get Data Document
                $documentOriginalName = $this->RemoveSpecialChar($uploadDocument[$i]->getClientOriginalName());
                $documentFileName = $this->RemoveSpecialChar($uploadDocument[$i]->getClientOriginalName());
                $documentDirName = $uploadPath;
                $documentFileType = $uploadDocument[$i]->getMimeType();
                $documentFileSize = $uploadDocument[$i]->getSize();


                // masukan data file ke database
                $document = Document::create([
                    'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                    'DOCUMENT_FILENAME'             => "",
                    'DOCUMENT_DIRNAME'              => $documentDirName,
                    'DOCUMENT_FILETYPE'             => $documentFileType,
                    'DOCUMENT_FILESIZE'             => $documentFileSize,
                    'DOCUMENT_CREATED_BY'           => Auth::user()->id
                ])->DOCUMENT_ID;

                if ($document) {
                    // update file name "DOCUMENT_ID - FILENAME"
                    Document::where('DOCUMENT_ID', $document)->update([
                        'DOCUMENT_FILENAME'             => $document . "-" . $documentOriginalName,
                    ]);

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $uploadDocument[$i], $document . "-" . $this->RemoveSpecialChar($uploadDocument[$i]->getClientOriginalName()));
                }

                if ($document) {
                    MEmployeeDocument::create([
                        'EMPLOYEE_ID'     => $request->EMPLOYEE_ID,
                        'DOCUMENT_ID'   => $document,
                        'CATEGORY_DOCUMENT' => 2
                    ]);
                }
            }
        }



        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Add Employee Document (Employee).",
                "module"      => "Employee",
                "id"          => $request->EMPLOYEE_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->EMPLOYEE_ID,
            "Employee Document Add Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function person_document_download($idDocument)
    {
        $detailDocument = Document::find($idDocument);
        // $filePath = public_path('/storage/documents/CA/0/11/11-List-Asuransi--2-Unit-Dumptruck.pdf');
        $filePath = public_path('/storage/' . $detailDocument->DOCUMENT_DIRNAME . $detailDocument->DOCUMENT_FILENAME);

        $headers = [
            'filename' => $detailDocument->DOCUMENT_FILENAME
        ];

        if (file_exists($filePath)) {
            return response()->download($filePath, $detailDocument->DOCUMENT_FILENAME, $headers);
        } else {
            abort(404, 'File not found');
        }
    }

    public function delete_document(Request $request)
    {
        // Delete Document 
        $idDocument = $request->idDocument;
        // delete MEmployeeDocument
        if ($idDocument) {
            $mEmployeeDocument = MEmployeeDocument::where('DOCUMENT_ID', $request->idDocument)->delete();

            if ($mEmployeeDocument) {
                // delete image from folder
                $data = Document::find($request->idDocument);
                Storage::disk('public')->delete($data->DOCUMENT_DIRNAME . $data->DOCUMENT_FILENAME);

                // delete document from database
                Document::where('DOCUMENT_ID', $request->idDocument)->delete();
            }
        }

        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Employee Document Delete (Employee).",
                "module"      => "Employee",
                "id"          => $request->idEmployee
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->idEmployee
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function add_address_person(Request $request)
    {
        // 1. address_ktp
        // 2. address_domicile
        // 3. other_address
        // cek array kosong atau tidak, klo kosong false klo ada true
        $addressKtp = is_countable($request->address_ktp);
        $addressDomisili = is_countable($request->address_domicile);
        $addressOther = is_countable($request->other_address);

        // jika other dan domisili gaada create ktp address dan domisili 
        if ($addressKtp) {
            for ($i = 0; $i < sizeof($request->address_ktp); $i++) {
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
                    MAddressEmployee::create([
                        "EMPLOYEE_ID"          => $request->address_ktp[$i]['idEmployee'],
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
                        MAddressEmployee::create([
                            "EMPLOYEE_ID"          => $request->address_ktp[$i]['idEmployee'],
                            "ADDRESS_ID"         => $createDom->ADDRESS_ID
                        ]);
                    }
                } else {
                    // jika ada data dari dom address make data dom address
                    for ($a = 0; $a < sizeof($request->address_domicile); $a++) {
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
                            MAddressEmployee::create([
                                "EMPLOYEE_ID"          => $request->address_domicile[$a]['idEmployee'],
                                "ADDRESS_ID"         => $createDom->ADDRESS_ID
                            ]);
                        }
                    }
                }

                // jika ada other address
                if ($addressOther) {
                    for ($z = 0; $z < sizeof($request->other_address); $z++) {
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
                            MAddressEmployee::create([
                                "EMPLOYEE_ID"          => $request->other_address[$z]['idEmployee'],
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
                "description" => "Add Address (Employee).",
                "module"      => "Employee",
                "id"          => $request->address_ktp[0]['idEmployee']
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->address_ktp[0]['idEmployee'],
            "Add Address Employeee Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getEmployeeAddress(Request $request)
    {
        $data = MAddressEmployee::where('EMPLOYEE_ID', $request->id)->get();

        return response()->json($data);
    }

    public function editAddress(Request $request)
    {
        // dd($request);
        for ($i = 0; $i < sizeof($request->dataEdit); $i++) {
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
            } else {
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
            for ($z = 0; $z < sizeof($request->other_address); $z++) {
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
                    MAddressEmployee::create([
                        "EMPLOYEE_ID"          => $request->other_address[$z]['idEmployee'],
                        "ADDRESS_ID"         => $createOther->ADDRESS_ID
                    ]);
                }
            }
        }


        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Edit Address (Employee).",
                "module"      => "Employee",
                "id"          => $request->ADDRESS_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->ADDRESS_ID,
            "Edit Address Employee Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function addBankAccount(Request $request)
    {
        // dd($request->BANK_ACCOUNT);
        // validasi bank account
        $validateData = Validator::make($request->all(), [
            'BANK_ACCOUNT.*.BANK_ID'                    => 'required',
            'BANK_ACCOUNT.*.EMPLOYEE_BANK_ACCOUNT_FOR'    => 'required'
        ], [
            'BANK_ACCOUNT.*.BANK_ID'                    => 'Bank Name is required',
            'BANK_ACCOUNT.*.EMPLOYEE_BANK_ACCOUNT_FOR'    => 'For Bank Account is required'
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }

        // created bank account
        if (is_countable($request->BANK_ACCOUNT)) {
            for ($i = 0; $i < sizeof($request->BANK_ACCOUNT); $i++) {
                $createEmployeeBank = TEmployeeBankAccount::create([
                    "EMPLOYEE_ID" => $request->BANK_ACCOUNT[$i]["idEmployee"],
                    "EMPLOYEE_BANK_ACCOUNT_NAME" => $request->BANK_ACCOUNT[$i]["EMPLOYEE_BANK_ACCOUNT_NAME"],
                    "EMPLOYEE_BANK_ACCOUNT_NUMBER" => $request->BANK_ACCOUNT[$i]["EMPLOYEE_BANK_ACCOUNT_NUMBER"],
                    // "EMPLOYEE_BANK_ACCOUNT_FOR" => $valueBankFor,
                    "BANK_ID" => $request->BANK_ACCOUNT[$i]['BANK_ID']['value'],
                ]);

                if ($createEmployeeBank) {
                    if (is_countable($request->BANK_ACCOUNT[$i]['EMPLOYEE_BANK_ACCOUNT_FOR'])) {
                        for ($a = 0; $a < sizeof($request->BANK_ACCOUNT[$i]['EMPLOYEE_BANK_ACCOUNT_FOR']); $a++) {
                            $dataBankAccount = $request->BANK_ACCOUNT[$i]['EMPLOYEE_BANK_ACCOUNT_FOR'];

                            MForEmployeeBankAccount::create([
                                "FOR_BANK_ACCOUNT_ID"          => $dataBankAccount[$a]['value'],
                                "EMPLOYEE_BANK_ACCOUNT_ID"         => $createEmployeeBank->EMPLOYEE_BANK_ACCOUNT_ID
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
                "description" => "Add Bank Account (Employee).",
                "module"      => "Employee",
                "id"          => $request->BANK_ACCOUNT[0]["idEmployee"]
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->BANK_ACCOUNT[0]["idEmployee"],
            "Add Bank Account Employee Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function editBankAccount(Request $request)
    {

        // dd($request);
        $validateData = Validator::make($request->all(), [
            'BANK_ACCOUNT.*.BANK_ID'                        => 'required',
            'BANK_ACCOUNT.*.m_for_bank'                    => 'required',
            'BANK_ACCOUNT.*.EMPLOYEE_BANK_ACCOUNT_NUMBER'    => 'required'

        ], [
            'BANK_ACCOUNT.*.BANK_ID'                       => 'Bank Name is required',
            'BANK_ACCOUNT.*.m_for_bank'                    => 'For Bank Account is required',
            'BANK_ACCOUNT.*.EMPLOYEE_BANK_ACCOUNT_NUMBER'    => 'Account Number is required'
        ]);

        if ($validateData->fails()) {
            return new JsonResponse([
                $validateData->errors()->all()
            ], 422, [
                'X-Inertia' => true
            ]);
        }


        // if (isset($request->BANK_ACCOUNT[0]['EMPLOYEE_BANK_ACCOUNT_ID'])) {
        $dataTEmployee = TEmployeeBankAccount::where('EMPLOYEE_ID', $request->BANK_ACCOUNT[0]['EMPLOYEE_ID'])->get();
        // dd($dataTEmployee);
        // Delete M Bank Account Existing By Id
        for ($i = 0; $i < sizeof($dataTEmployee); $i++) {

            $dataExisting = MForEmployeeBankAccount::where('EMPLOYEE_BANK_ACCOUNT_ID', $dataTEmployee[$i]['EMPLOYEE_BANK_ACCOUNT_ID'])->get();
            if ($dataExisting->count() > 0) { //jika ada delete data sebelumnya
                MForEmployeeBankAccount::where('EMPLOYEE_BANK_ACCOUNT_ID', $dataTEmployee[$i]['EMPLOYEE_BANK_ACCOUNT_ID'])->delete();
            }
        }
        // Delete Data T Person Bank Account
        // $dataExistingTPerson = TEmployeeBankAccount::where('EMPLOYEE_BANK_ACCOUNT_ID', $dataTEmployee[0]['EMPLOYEE_ID'])->get();
        if ($dataTEmployee->count() > 0) { //jika ada delete data sebelumnya
            TEmployeeBankAccount::where('EMPLOYEE_ID', $dataTEmployee[0]['EMPLOYEE_ID'])->delete();
        }

        // }


        // created bank account
        if (is_countable($request->BANK_ACCOUNT)) {
            for ($i = 0; $i < sizeof($request->BANK_ACCOUNT); $i++) {


                // Add New Data T Person Bank Account and M Person Bank Account
                $createPersonBank = TEmployeeBankAccount::create([
                    "EMPLOYEE_ID" => $request->BANK_ACCOUNT[$i]["EMPLOYEE_ID"],
                    "EMPLOYEE_BANK_ACCOUNT_NAME" => $request->BANK_ACCOUNT[$i]["EMPLOYEE_BANK_ACCOUNT_NAME"],
                    "EMPLOYEE_BANK_ACCOUNT_NUMBER" => $request->BANK_ACCOUNT[$i]["EMPLOYEE_BANK_ACCOUNT_NUMBER"],
                    // "EMPLOYEE_BANK_ACCOUNT_FOR" => $valueBankFor,
                    "BANK_ID" => $request->BANK_ACCOUNT[$i]['BANK_ID'],
                ]);

                if ($createPersonBank) {
                    if (is_countable($request->BANK_ACCOUNT[$i]['m_for_bank'])) {
                        for ($a = 0; $a < sizeof($request->BANK_ACCOUNT[$i]['m_for_bank']); $a++) {
                            $dataBankAccount = $request->BANK_ACCOUNT[$i]['m_for_bank'];

                            if (!isset($dataBankAccount[$a]["FOR_BANK_ACCOUNT_ID"])) {
                                MForEmployeeBankAccount::create([
                                    "FOR_BANK_ACCOUNT_ID"          => $dataBankAccount[$a]['value'],
                                    "EMPLOYEE_BANK_ACCOUNT_ID"         => $createPersonBank->EMPLOYEE_BANK_ACCOUNT_ID
                                ]);
                            } else {
                                MForEmployeeBankAccount::create([
                                    "FOR_BANK_ACCOUNT_ID"          => $dataBankAccount[$a]['FOR_BANK_ACCOUNT_ID'],
                                    "EMPLOYEE_BANK_ACCOUNT_ID"         => $createPersonBank->EMPLOYEE_BANK_ACCOUNT_ID
                                ]);
                            }
                        }
                    }
                }
            }
        }

        // Created Log
        UserLog::create([
            "created_by" => Auth::user()->id,
            "action"     => json_encode([
                "description" => "Edit Bank Account (Employee).",
                "module"      => "Employee",
                "id"          => $request->BANK_ACCOUNT[0]["EMPLOYEE_ID"]
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->BANK_ACCOUNT[0]["EMPLOYEE_ID"],
            "Edit Bank Account Employee Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function uploadProfile(Request $request)
    {
        // dd($request);
        // document
        $imgProfile = $request->file('files');
        // print_r($imgProfile);die;
        if ($imgProfile) {
            // $document = $this->handleDirectoryUploadedFile($imgProfile, $request->id, 'person/');
            $documentImg = is_countable($request->file('files'));
            if ($documentImg) {
                for ($i = 0; $i < sizeof($request->file('files')); $i++) {
                    $uploadDocument = $request->file('files');

                    // Create Folder For Person Document
                    $parentDir = ((floor(($request->id) / 1000)) * 1000) . '/';
                    $personID = $request->id . '/';
                    $typeDir = "";
                    $uploadPath = 'images/' . $parentDir . $personID . $typeDir;


                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($uploadDocument[$i]->getClientOriginalName());
                    $documentFileName = $request->id . "-" . $this->RemoveSpecialChar($uploadDocument[$i]->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $uploadDocument[$i]->getMimeType();
                    $documentFileSize = $uploadDocument[$i]->getSize();

                    // create folder in directory laravel
                    Storage::makeDirectory($uploadPath, 0777, true, true);
                    Storage::disk('public')->putFileAs($uploadPath, $uploadDocument[$i], $request->id . "-" . $this->RemoveSpecialChar($uploadDocument[$i]->getClientOriginalName()));

                    // masukan data file ke database
                    $document = Document::create([
                        'DOCUMENT_ORIGINAL_NAME'        => $documentOriginalName,
                        'DOCUMENT_FILENAME'             => $documentFileName,
                        'DOCUMENT_DIRNAME'              => $documentDirName,
                        'DOCUMENT_FILETYPE'             => $documentFileType,
                        'DOCUMENT_FILESIZE'             => $documentFileSize,
                        'DOCUMENT_CREATED_BY'           => Auth::user()->id
                    ])->DOCUMENT_ID;

                    if ($document) {
                        TEmployee::where('EMPLOYEE_ID', $request->id)
                            ->update([
                                'EMPLOYEE_IMAGE_ID'    => $document
                            ]);
                    }
                }
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
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->id,
            "Profile Employee Has Change"
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
