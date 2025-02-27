<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\MBankAccountRelation;
use App\Models\MPksRelation;
use App\Models\MRelationAka;
use App\Models\MRelationPic;
use App\Models\RRelationStatus;
use App\Models\MRelationType;
use App\Models\MTag;
use App\Models\Relation;
use App\Models\RelationGroup;
use App\Models\RelationLob;
use App\Models\RelationProfession;
use App\Models\RelationStatus;
use App\Models\RelationType;
use App\Models\RSalutation;
use App\Models\Salutation;
use App\Models\Tag;
use App\Models\TPerson;
use App\Models\TPic;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use RealRashid\SweetAlert\Facades\Alert as FacadesAlert;
use Illuminate\Support\Str;

class RelationController extends Controller
{
    public function getAllRelations()
    {
        // $data = Relation::with('relationStatus')->where('is_deleted', '<>', 1)->get();
        $data = Relation::with('relationStatus')->get();
        return response()->json($data);
    }
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

    public function get_relation_client(Request $request)
    {
        $data = Relation::where('relation_status_id', 1)->with('relationStatus')->where('is_deleted', '<>', 1)->get();


        return response()->json($data);
    }

    public function getOldRelation($id)
    {
        $oldRelation = Relation::where('RELATION_ORGANIZATION_ID', $id)->get();
        return $oldRelation;
    }

    public function getRelationData($request)
    {
        // dd($request);
        // dd(json_decode($request->newFilter, true));
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = Relation::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);

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
                $query->where('RELATION_ORGANIZATION_NAME', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
            } else {
                // dd("masuk sini");
                foreach ($newSearch[0] as $keyId => $searchValue) {
                    if ($keyId === 'RELATION_ORGANIZATION_NAME') {
                        $query->where('RELATION_ORGANIZATION_NAME', 'LIKE', '%' . $searchValue . '%');
                    } elseif ($keyId === 'RELATION_TYPE_ID') {
                        if (!isset($searchValue['value'])) {
                            $valueTypeId = $searchValue;
                        } else {
                            $valueTypeId = $searchValue['value'];
                        }
                        $query->whereHas('mRelationType', function ($q) use ($valueTypeId) {
                            // Query the name field in status table
                            $q->where('RELATION_TYPE_ID', 'like', '%' . $valueTypeId . '%');
                        });
                    }
                }
            }
        }

        // if ($filterModel) {
        //     foreach ($filterModel as $colId => $filterValue) {
        //         if ($colId === 'policy_number') {
        //             $query->where('policy_number', 'LIKE', '%' . $filterValue . '%')
        //                   ->orWhereRelation('insuranceType', 'insurance_type_name', 'LIKE', '%' . $filterValue . '%');
        //         } elseif ($colId === 'policy_inception_date') {
        //             $query->where('policy_inception_date', '<=', date('Y-m-d', strtotime($filterValue)))
        //                   ->where('policy_due_date', '>=', date('Y-m-d', strtotime($filterValue)));
        //         }
        //     }
        // }
        // dd($query->toSql());
        $query->where('is_deleted', '<>', 1);
        $query->orderBy('RELATION_ORGANIZATION_ID', "DESC");
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
    }

    // Get All Relation Type
    public function getAllRelatioType()
    {
        $relationType = RelationType::get();

        return $relationType;
    }


    public function getRelationJson(Request $request)
    {
        $data = $this->getRelationData($request);
        return response()->json($data);
    }

    public function getPreSalutation(Request $request)
    {
        $data = Salutation::where('relation_status_id', 'like', '%' . $request->id . '%')->where('salutation_position', 1)->get();
        return response()->json($data);
    }

    public function getPostSalutation(Request $request)
    {
        $data = Salutation::where('relation_status_id', 'like', '%' . $request->id . '%')->where('salutation_position', 2)->get();
        return response()->json($data);
    }

    // show interface relation when click menu relation
    public function index(Request $request)
    {
        // call data relation
        $relation = Relation::with('relationStatus')->get();

        // call data relation group
        $relationGroup = RelationGroup::get();
        // call data relation lob
        $relationLob = RelationLob::get();
        // call data relation type
        $relationTypeAll = $this->getAllRelatioType();
        // call data salutation
        $salutation = Salutation::get();
        // call data relation status
        $relationStatus = RelationStatus::get();
        // call mapping relation Type
        $mRelationType = MRelationType::get();

        // cal profession
        $profession = RelationProfession::get();



        return Inertia::render('Relation/Relation', [
            'relation' => $relation,
            'relationType' => $relationTypeAll,
            'relationLOB' => $relationLob,
            'salutation' => $salutation,
            'relationStatus' => $relationStatus,
            'relationGroup' => $relationGroup,
            'mRelationType' => $mRelationType,
            'profession'   => $profession,
            'relation' => $relation
        ]);
    }

    public function get_mapping(Request $request)
    {
        $data = DB::select('call sp_combo_relation_organization(?)', [$request->name]);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        // for cek abbreviation
        $flag = "0";
        $message = "Abbreviation already exists";
        $abbreviation = Relation::where('RELATION_ORGANIZATION_ABBREVIATION', trim(strtoupper($request->abbreviation)))->get();
        if ($abbreviation->count() > 0) {
            $abbreviationName = $abbreviation[0]->RELATION_ORGANIZATION_ABBREVIATION;
            if ($abbreviationName == trim(strtoupper($request->abbreviation))) {
                return new JsonResponse([
                    $flag,
                    $message
                ], 201, [
                    'X-Inertia' => true
                ]);
            }
        }

        // for cek relation
        if ($request->relation_status_id == 1 || $request->relation_status_id == "1") {
            $flag = "0";
            $relation = Relation::where('RELATION_ORGANIZATION_NAME', trim($request->name_relation))->where('PRE_SALUTATION', $request->pre_salutation_id)->get();
            if ($relation->count() > 0) {
                $preName = RSalutation::where('salutation_id', $relation[0]['PRE_SALUTATION'])->first();
                $message = $preName->salutation_name . " " . $relation[0]['RELATION_ORGANIZATION_NAME'] . " has already exists";
                return new JsonResponse([
                    $flag,
                    $message
                ], 201, [
                    'X-Inertia' => true
                ]);
            }
        }


        // Cek Relation Type Required;
        $flag = "rType";
        $message = "Please Choose Relation Type!";
        if ($request->relation_type_id == null) {
            return new JsonResponse([
                $flag,
                $message
            ], 201, [
                'X-Inertia' => true
            ]);
        }



        // ubah ke to lower dan huruf besar di awal
        $nameRelation = strtolower($request->name_relation);
        $nameRelationNew = ucwords($nameRelation);

        $addTBK = $nameRelationNew;
        if ($request->mark_tbk_relation == "1") {
            $addTBK = $nameRelationNew . " Tbk.";
        }

        $professionId = $request->profession_id;
        if ($request->profession_id != NULL || $request->profession_id != "") {
            $professionId = $request->profession_id['value'];
        }

        $lobId = $request->relation_lob_id;
        if ($request->relation_lob_id != NULL || $request->relation_lob_id != "") {
            $lobId = $request->relation_lob_id['value'];
        }

        // Created Relation
        $relation = Relation::create([
            'RELATION_ORGANIZATION_NAME' => $addTBK,
            'RELATION_ORGANIZATION_PARENT_ID' => 0,
            'RELATION_ORGANIZATION_ABBREVIATION' => strtoupper($request->abbreviation),
            'RELATION_ORGANIZATION_MAPPING' => NULL,
            'HR_MANAGED_BY_APP' => $request->is_managed,
            'IS_TBK' => $request->mark_tbk_relation,
            'RELATION_ORGANIZATION_CREATED_BY' => Auth::user()->id,
            'RELATION_ORGANIZATION_UPDATED_BY' => NULL,
            'RELATION_ORGANIZATION_CREATED_DATE' => now(),
            'RELATION_ORGANIZATION_UPDATED_DATE' => NULL,
            'RELATION_ORGANIZATION_DESCRIPTION' => $request->relation_description,
            'RELATION_ORGANIZATION_ALIAS' => $addTBK,
            'RELATION_ORGANIZATION_EMAIL' => $request->relation_email,
            'RELATION_ORGANIZATION_WEBSITE' => $request->relation_website,
            'RELATION_ORGANIZATION_LOGO_ID' => NULL,
            'RELATION_ORGANIZATION_SIGNATURE_NAME' => NULL,
            'RELATION_ORGANIZATION_SIGNATURE_TITLE' => NULL,
            'RELATION_ORGANIZATION_BANK_ACCOUNT_NUMBER' => NULL,
            'RELATION_ORGANIZATION_BANK_ACCOUNT_NAME' => NULL,
            'RELATION_PROFESSION_ID' => $professionId,
            'RELATION_LOB_ID' => $lobId,
            'PRE_SALUTATION' => $request->pre_salutation_id,
            'POST_SALUTATION' => $request->post_salutation_id,
            'relation_status_id' => $request->relation_status_id,
            'RELATION_ORGANIZATION_NPWP' => $request->NPWP_RELATION,
            'DEFAULT_PAYABLE'       => $request->DEFAULT_PAYABLE,
            'RELATION_ORGANIZATION_DATE_OF_BIRTH'   => $request->date_of_birth

        ]);



        if ($request->relation_status_id == "2") {
            // create relation individu for person
            $personCreate = TPerson::create([
                "PERSON_FIRST_NAME"         => $addTBK,
                "INDIVIDU_RELATION_ID"      => $relation->RELATION_ORGANIZATION_ID,
                "PERSON_BIRTH_DATE"         => $request->date_of_birth,
                "PERSON_IS_DELETED"         => "0",
                "PERSON_CREATED_BY"         => Auth::user()->id,
                "PERSON_CREATED_DATE"       => now()
            ]);
            // jika dia corporate pic dan milih corporate pic maka akan melakukan mapping ke t person
            if (is_countable($request->corporate_pic_for)) {
                for ($i = 0; $i < sizeof($request->corporate_pic_for); $i++) {
                    $idRelation = $request->corporate_pic_for[$i]['value'];

                    // simpan t pic
                    $createPIC = TPic::create([
                        "PERSON_ID"                     => $personCreate->PERSON_ID,
                        "RELATION_ORGANIZATION_ID"      => $idRelation,
                        "PIC_CREATED_BY"                => Auth::user()->id,
                        "PIC_CREATED_DATE"              => now()
                    ]);

                    // MRelationPic::create([
                    //     "RELATION_ORGANIZATION_ID"  => $idRelation,
                    //     "PERSON_ID"                 => $relation->RELATION_ORGANIZATION_ID
                    // ]);
                }
            }
        }

        if (is_countable($request->relation_aka)) {
            // Created Mapping Relation AKA
            for ($i = 0; $i < sizeof($request->relation_aka); $i++) {
                $nameRelationAka = $request->relation_aka[$i]["name_aka"];
                MRelationAka::create([
                    "RELATION_ORGANIZATION_ID" => $relation->RELATION_ORGANIZATION_ID,
                    "RELATION_AKA_NAME" => $nameRelationAka
                ]);
            }
        }

        $relationTypeAgent = "";
        $relationTypeFBI   = "";
        if (is_countable($request->relation_type_id)) {
            // Created Mapping Relation Type
            for ($i = 0; $i < sizeof($request->relation_type_id); $i++) {
                $idRelationType = $request->relation_type_id[$i]["id"];
                if ($idRelationType === 3) {
                    $relationTypeAgent = $idRelationType;
                }
                if ($idRelationType === 13) {
                    $relationTypeFBI = $idRelationType;
                }
                MRelationType::create([
                    'RELATION_ORGANIZATION_ID' => $relation->RELATION_ORGANIZATION_ID,
                    'RELATION_TYPE_ID' => $idRelationType
                ]);
            }
        }


        if (is_countable($request->tagging_name)) {
            // created tagging
            for ($i = 0; $i < sizeof($request->tagging_name); $i++) {
                $tagName = $request->tagging_name[$i]["name_tag"];
                $tagging = Tag::insertGetId([
                    'TAG_NAME' => $tagName,
                    'TAG_CREATED_BY' => Auth::user()->id,
                    'TAG_CREATED_DATE' => now(),
                    'TAG_UPDATED_BY' => NULL,
                    'TAG_UPDATED_DATE' => NULL
                ]);

                // created mapping tagging
                if ($tagging) {
                    MTag::create([
                        'RELATION_ORGANIZATION_ID' => $relation->RELATION_ORGANIZATION_ID,
                        'TAG_ID' => $tagging
                    ]);
                }
            }
        }

        // get PKS FOR
        $pksFor = "";
        if ($request->relation_status_id == "1" && $relationTypeAgent == "3") {
            $pksFor = "1";
        } else if ($request->relation_status_id == "2" && $relationTypeAgent == "3") {
            $pksFor = "2";
        } else if ($request->relation_status_id == "1" && $relationTypeFBI == "13") {
            $pksFor = "3";
        }

        // No PKS
        $pksDocument = is_countable($request->no_pks);
        if ($pksDocument) {
            for ($i = 0; $i < sizeof($request->no_pks); $i++) {
                $varPKS = $request->no_pks[$i];
                // $noPKS = $varPKS['NO_PKS'];

                $createMPksRelation = MPksRelation::create([
                    "RELATION_ORGANIZATION_ID"          => $relation->RELATION_ORGANIZATION_ID,
                    "NO_PKS"                            => $varPKS['NO_PKS'],
                    "STAR_DATE_PKS"                     => $varPKS['STAR_DATE_PKS'],
                    "END_DATE_PKS"                      => $varPKS['END_DATE_PKS'],
                    "FOR_PKS"                           => $varPKS['FOR_PKS']['value'],
                    "REMARKS_PKS"                       => $varPKS['REMARKS_PKS'],
                    "STATUS_PKS"                        => $varPKS['STATUS_PKS'],
                    "ENDING_BY_CANCEL"                  => $varPKS['ENDING_BY_CANCEL'],
                ]);

                // create Document PKS
                for ($a = 0; $a < sizeof($request->file('no_pks')); $a++) {
                    $file = $request->file('no_pks');
                    $varDocument = $file[$a]['DOCUMENT_PKS_ID'];

                    // Create Folder For Person Document
                    $parentDir = ((floor(($relation->RELATION_ORGANIZATION_ID) / 1000)) * 1000) . '/';
                    $personID = $relation->RELATION_ORGANIZATION_ID . '/';
                    $typeDir = "";
                    $uploadPath = 'documents/' . 'PKS/' . $parentDir . $personID . $typeDir;


                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($varDocument->getClientOriginalName());
                    $documentFileName = $this->RemoveSpecialChar($varDocument->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $varDocument->getClientMimeType();
                    $documentFileSize = $varDocument->getSize();

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
                        Storage::disk('public')->putFileAs($uploadPath, $varDocument, $document . "-" . $this->RemoveSpecialChar($varDocument->getClientOriginalName()));
                    }


                    if ($document) {
                        MPksRelation::where('M_PKS_RELATION_ID', $createMPksRelation->M_PKS_RELATION_ID)->update([
                            'DOCUMENT_PKS_ID'     => $document,
                        ]);
                    }
                }
            }
        }

        // bank account relation
        $bankAccountRelation = is_countable($request->bank_account);
        if ($bankAccountRelation) {
            for ($i = 0; $i < sizeof($request->bank_account); $i++) {
                $varBankAccount = $request->bank_account[$i];
                $npwpRelation = $varBankAccount['NPWP_NAME'];
                if ($varBankAccount['NPWP_NAME'] == "" || $varBankAccount['NPWP_NAME'] == null) {
                    $npwpRelation = $request->NPWP_RELATION;
                }

                // create bank relation account
                $createMPksRelation = MBankAccountRelation::create([
                    "RELATION_ORGANIZATION_ID"          => $relation->RELATION_ORGANIZATION_ID,
                    "BANK_ID"                           => $varBankAccount['BANK_ID']['value'],
                    "ACCOUNT_NAME"                      => $varBankAccount['ACCOUNT_NAME'],
                    "ACCOUNT_NUMBER"                    => $varBankAccount['ACCOUNT_NUMBER'],
                    "NPWP_NAME"                         => $npwpRelation,
                ]);
            }
        }


        // get salutation name for detail relation
        $preSalutation = "";
        $postSalutation = "";
        if ($relation->PRE_SALUTATION == null && $relation->POST_SALUTATION == null) {
            $preSalutation = "";
            $postSalutation = "";
        } else {
            if ($relation->PRE_SALUTATION == "" || $relation->PRE_SALUTATION == null) {
                $salutationPost = Salutation::find($relation->POST_SALUTATION);
                $postSalutation = $salutationPost->salutation_name;
            } else {
                $salutationPre = Salutation::find($relation->PRE_SALUTATION);
                $preSalutation = $salutationPre->salutation_name;
            }
        }




        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Relation).",
                "module"      => "Relation",
                "id"          => $relation->RELATION_ORGANIZATION_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $relation->RELATION_ORGANIZATION_ID,
            $addTBK,
            $preSalutation,
            $postSalutation,
            $request->relation_status_id,
            $request->date_of_birth
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getRelationById($id)
    {
        $data = Relation::leftJoin('m_tag_relation', 'm_tag_relation.RELATION_ORGANIZATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')
            ->leftJoin('t_tag', 'm_tag_relation.TAG_ID', '=', 't_tag.TAG_ID')->where('t_relation.RELATION_ORGANIZATION_ID', $id)->first();
        // print_r($data);die;
        return response()->json($data);
    }

    public function edit(Request $request)
    {


        if ($request->relation_status_id == 2 || $request->relation_status_id == "2") {

            // cek jika nama first name dan birth date berubah, maka di person berubah juga
            $getPersonData = TPerson::select('PERSON_FIRST_NAME', 'PERSON_BIRTH_DATE')->where('INDIVIDU_RELATION_ID', $request->RELATION_ORGANIZATION_ID)->first();
            $personName = $getPersonData->PERSON_FIRST_NAME;
            $dateOfBirthPerson = $getPersonData->PERSON_BIRTH_DATE;

            $nameRelation = strtolower($request->RELATION_ORGANIZATION_NAME);
            $nameRelationNew = ucwords($nameRelation);

            if (strtolower($personName) != strtolower($request->RELATION_ORGANIZATION_NAME) || $dateOfBirthPerson != $request->RELATION_ORGANIZATION_DATE_OF_BIRTH) {
                // update relation 
                TPerson::where('INDIVIDU_RELATION_ID', $request->RELATION_ORGANIZATION_ID)->update([
                    "PERSON_FIRST_NAME"          => $nameRelationNew,
                    "PERSON_BIRTH_DATE"          => $request->RELATION_ORGANIZATION_DATE_OF_BIRTH
                ]);
            }
        }



        // cek abbrev apakah sama seperti sebelumnya
        $relation = Relation::find($request->RELATION_ORGANIZATION_ID);
        $relationOld = $relation->RELATION_ORGANIZATION_NAME;

        // cek jika sama tidak melakukan cek abbreviation existing
        if ($relationOld != $request->RELATION_ORGANIZATION_NAME) {
            if ($request->relation_status_id == 1 || $request->relation_status_id == "1") {

                // cek abbreviation
                $flag = "0";
                $relationNew = Relation::where('RELATION_ORGANIZATION_NAME', trim(strtoupper($request->RELATION_ORGANIZATION_NAME)))->where('PRE_SALUTATION', $request->PRE_SALUTATION)->get();
                // dd($relationNew->count());
                if ($relationNew->count() > 0) {
                    $preName = RSalutation::where('salutation_id', $relationNew[0]['PRE_SALUTATION'])->first();
                    $message = $preName->salutation_name . " " . $relationNew[0]['RELATION_ORGANIZATION_NAME'] . " has already exists";
                    return new JsonResponse([
                        $flag,
                        $message
                    ], 201, [
                        'X-Inertia' => true
                    ]);
                }
            }
        }

        // cek abbrev apakah sama seperti sebelumnya
        $abbre = Relation::find($request->RELATION_ORGANIZATION_ID);
        $abbreOld = $abbre->RELATION_ORGANIZATION_ABBREVIATION;

        // cek jika sama tidak melakukan cek abbreviation existing
        if ($abbreOld != $request->RELATION_ORGANIZATION_ABBREVIATION) {
            if ($request->relation_status_id == 1 || $request->relation_status_id == "1") {

                // cek abbreviation
                // dd("masuk ga");
                $flag = "0";
                $message = "Abbreviation already exists";
                $abbreviation = Relation::where('RELATION_ORGANIZATION_ABBREVIATION', trim(strtoupper($request->RELATION_ORGANIZATION_ABBREVIATION)))->get();
                if ($abbreviation->count() > 0) {
                    $abbreviationName = $abbreviation[0]->RELATION_ORGANIZATION_ABBREVIATION;
                    if ($abbreviationName == trim(strtoupper($request->RELATION_ORGANIZATION_ABBREVIATION))) {
                        return new JsonResponse([
                            $flag,
                            $message
                        ], 201, [
                            'X-Inertia' => true
                        ]);
                    }
                }
            }
        }

        // ubah ke to lower dan huruf besar di awal
        $nameRelation = strtolower($request->RELATION_ORGANIZATION_NAME);
        $nameRelationNew = ucwords($nameRelation);

        $addTBK = $nameRelationNew;
        if ($request->MARK_TBK_RELATION == "1") {
            $addTBK = $nameRelationNew . " Tbk.";
        }

        $professionId = $request->RELATION_PROFESSION_ID;
        if ($request->RELATION_PROFESSION_ID != NULL || $request->RELATION_PROFESSION_ID != "") {
            $professionId = $request->RELATION_PROFESSION_ID;
        }

        $lobId = $request->RELATION_LOB_ID;
        if ($request->RELATION_LOB_ID != NULL || $request->RELATION_LOB_ID != "") {
            $lobId = $request->RELATION_LOB_ID;
        }

        // Update Relation
        $relation = Relation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)
            ->update([
                'RELATION_ORGANIZATION_NAME' => $addTBK,
                // 'RELATION_ORGANIZATION_PARENT_ID' => $parentID,
                'RELATION_ORGANIZATION_ABBREVIATION' => $request->RELATION_ORGANIZATION_ABBREVIATION,
                'RELATION_ORGANIZATION_AKA' => $request->RELATION_ORGANIZATION_AKA,
                'RELATION_ORGANIZATION_MAPPING' => NULL,
                'HR_MANAGED_BY_APP' => $request->HR_MANAGED_BY_APP,
                'IS_TBK' => $request->MARK_TBK_RELATION,
                'RELATION_ORGANIZATION_UPDATED_BY' => Auth::user()->id,
                'RELATION_ORGANIZATION_UPDATED_DATE' => now(),
                'RELATION_ORGANIZATION_DESCRIPTION' => $request->RELATION_ORGANIZATION_DESCRIPTION,
                'RELATION_ORGANIZATION_ALIAS' => $addTBK,
                'RELATION_ORGANIZATION_EMAIL' => $request->RELATION_ORGANIZATION_EMAIL,
                'RELATION_ORGANIZATION_WEBSITE' => $request->RELATION_ORGANIZATION_WEBSITE,
                'RELATION_PROFESSION_ID' => $professionId,
                'RELATION_LOB_ID' => $lobId,
                'PRE_SALUTATION' => $request->PRE_SALUTATION,
                'POST_SALUTATION' => $request->POST_SALUTATION,
                'relation_status_id' => $request->relation_status_id,
                'RELATION_ORGANIZATION_DATE_OF_BIRTH' => $request->RELATION_ORGANIZATION_DATE_OF_BIRTH,
                'RELATION_ORGANIZATION_NPWP'    => $request->RELATION_ORGANIZATION_NPWP,
                'DEFAULT_PAYABLE'   => $request->DEFAULT_PAYABLE,
            ]);

        // check existing relation AKA
        $existingRelationAKA = MRelationAka::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->get();
        if ($existingRelationAKA->count() > 0) {
            MRelationAka::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->delete();
        }

        // Created Mapping Relation AKA
        for ($i = 0; $i < sizeof($request->m_relation_aka); $i++) {
            $nameRelationAka = $request->m_relation_aka[$i]["RELATION_AKA_NAME"];
            MRelationAka::create([
                "RELATION_ORGANIZATION_ID" => $request->RELATION_ORGANIZATION_ID,
                "RELATION_AKA_NAME" => $nameRelationAka
            ]);
        }

        // check existing relation_type_id in m_relation_type, if exists, delete first
        $existingData = MRelationType::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->get();

        if ($existingData->count() > 0) {
            MRelationType::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->delete();
        }

        // Created Mapping Relation Type
        for ($i = 0; $i < sizeof($request->m_relation_type); $i++) {
            $idRelationType = $request->m_relation_type[$i]["RELATION_TYPE_ID"];
            MRelationType::create([
                'RELATION_ORGANIZATION_ID' => $request->RELATION_ORGANIZATION_ID,
                'RELATION_TYPE_ID' => $idRelationType
            ]);
        }

        // check existing relation_organization_id in m_tag, if exists, delete first
        $existingData = MTag::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->get();

        if ($existingData->count() > 0) {
            MTag::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->delete();
        }

        // created mtag
        for ($i = 0; $i < sizeof($request->m_tagging); $i++) {
            // cek existing tagging
            if ($request->m_tagging[$i]['tagging']['TAG_ID'] !== "") {
                $existingDataTag = Tag::where('TAG_ID', $request->m_tagging[$i]['tagging']['TAG_ID'])->get();
                if ($existingDataTag->count() > 0) {
                    Tag::where('TAG_ID', $request->m_tagging[$i]['tagging']['TAG_ID'])->delete();
                }
            }

            $tagName = $request->m_tagging[$i]['tagging']['TAG_NAME'];  // catetan mau di hapus apa engga di tag data sebelumnyaa
            $tagging = Tag::insertGetId([
                'TAG_NAME' => $tagName,
                'TAG_CREATED_BY' => Auth::user()->id,
                'TAG_CREATED_DATE' => now(),
                'TAG_UPDATED_BY' => NULL,
                'TAG_UPDATED_DATE' => NULL
            ]);

            // created mapping tagging
            if ($tagging) {
                MTag::create([
                    'RELATION_ORGANIZATION_ID' => $request->RELATION_ORGANIZATION_ID,
                    'TAG_ID' => $tagging
                ]);
            }
        }

        // get salutation name for detail relation
        $preSalutation = "";
        $postSalutation = "";
        if ($request->PRE_SALUTATION == null && $request->POST_SALUTATION == null) {
            $preSalutation = "";
            $postSalutation = "";
        } else {
            if ($request->PRE_SALUTATION == "" || $request->PRE_SALUTATION == null) {
                $salutationPost = Salutation::find($request->POST_SALUTATION);
                $postSalutation = $salutationPost->salutation_name;
            } else {
                $salutationPre = Salutation::find($request->PRE_SALUTATION);
                $preSalutation = $salutationPre->salutation_name;
            }
        }


        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Edit (Relation).",
                "module"      => "Relation",
                "id"          => $request->RELATION_ORGANIZATION_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            $request->RELATION_ORGANIZATION_ID,
            $addTBK,
            $preSalutation,
            $postSalutation,
            "Relation Edit Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_detail(Request $request)
    {
        $detailRelation = Relation::with('TPerson')->with('groupRelation')->find($request->id);
        // print_r($detailRelation);die;
        return response()->json($detailRelation);
    }

    public function get_corporate(Request $request)
    {

        $getIdPerson = TPerson::select('PERSON_ID')->where('INDIVIDU_RELATION_ID', $request->id)->first();
        // get data T PIC
        $data = TPic::where('PERSON_ID', $getIdPerson->PERSON_ID)->leftJoin('t_relation', 't_relation.RELATION_ORGANIZATION_ID', '=', 't_pic.RELATION_ORGANIZATION_ID')->where('t_pic.PIC_IS_DELETED', 0)->get();


        return response()->json($data);
    }

    public function detail($id)
    {
        // get detail relation
        $detailRelation = Relation::find($id);
        // dd($detailRelation);


        return Inertia::render('Relation/DetailRelation', [
            'detailRelation' => $detailRelation,
        ]);
    }

    public function getCekAbbreviation(Request $request)
    {


        if ($request->flag != "edit") {
            $flag = "0";
            $message = "Existing";
            $data = Relation::where('RELATION_ORGANIZATION_ABBREVIATION', trim(strtoupper($request->name)))->get();
            return response()->json($data);
        } else {
            $abbre = Relation::find($request->id);
            $abbreOld = $abbre->RELATION_ORGANIZATION_ABBREVIATION;
            // dd($abbreOld);

            // cek jika sama tidak melakukan cek abbreviation existing
            if ($abbreOld != trim(strtoupper($request->name))) {
                // cek abbreviation
                $flag = "0";
                $message = "Abbreviation already exists";
                $abbreviation = Relation::where('RELATION_ORGANIZATION_ABBREVIATION', trim(strtoupper($request->name)))->get();
                return response()->json($abbreviation);
            }
        }
    }

    public function getRelationAll()
    {
        $clientId = 1;
        $data = Relation::whereHas('mRelationType', function ($q) use ($clientId) {
            // Query the name field in status table
            $q->where('RELATION_TYPE_ID', 'like', '%' . $clientId . '%');
        })->get();

        return response()->json($data);
    }

    public function edit_corporate(Request $request)
    {
        $arrayPerson = TPic::where('PERSON_ID', $request->PERSON_ID)->get();
        for ($i = 0; $i < sizeof($arrayPerson); $i++) {
            for ($a = 0; $a < sizeof($request->detail_corporate); $a++) {
                $personName = $request->detail_corporate[$a]['RELATION_ORGANIZATION_NAME'];
                $dataRelation = Relation::where('RELATION_ORGANIZATION_NAME', trim($personName))->first();
                if ($arrayPerson[$i]['RELATION_ORGANIZATION_ID'] != $dataRelation->RELATION_ORGANIZATION_ID) {
                    TPic::where('RELATION_ORGANIZATION_ID', $arrayPerson[$i]['RELATION_ORGANIZATION_ID'])->update([
                        "PIC_IS_DELETED"         => "1"
                    ]);
                }
            }
        }


        for ($i = 0; $i < sizeof($request->detail_corporate); $i++) {
            $personName = $request->detail_corporate[$i]['RELATION_ORGANIZATION_NAME'];
            $individuId = $request->PERSON_ID;

            $dataRelation = Relation::where('RELATION_ORGANIZATION_NAME', trim($personName))->first();
            // $getName = Relation::select('RELATION_ORGANIZATION_NAME')->where('RELATION_ORGANIZATION_ID', $individuId)->first();

            $dataPerson = TPic::where('RELATION_ORGANIZATION_ID', $dataRelation->RELATION_ORGANIZATION_ID)->first();
            if ($dataPerson != null) {
                $id = $dataPerson->RELATION_ORGANIZATION_ID;
                TPic::where('RELATION_ORGANIZATION_ID', $id)->update([
                    "PIC_IS_DELETED"         => "0"
                ]);
            } else {
                // $arrayPerson = TPic::where('PERSON_ID', $request->PERSON_ID)->get();
                // for ($a = 0; $a < sizeof($request->detail_corporate); $a++) {
                //     $personName = $request->detail_corporate[$a]['RELATION_ORGANIZATION_NAME'];
                //     $dataRelation = Relation::where('RELATION_ORGANIZATION_NAME', trim($personName))->first();
                //     if ($arrayPerson[$a]['RELATION_ORGANIZATION_ID'] != $dataRelation->RELATION_ORGANIZATION_ID) {
                //         TPic::where('RELATION_ORGANIZATION_ID', $arrayPerson[$a]['RELATION_ORGANIZATION_ID'])->update([
                //             "PIC_IS_DELETED"         => "0"
                //         ]);
                //     }
                // }
                // for ($a = 0; $a < sizeof($arrayPerson); $a++) {
                //     if ($arrayPerson[$a]['RELATION_ORGANIZATION_ID'] != $dataRelation->RELATION_ORGANIZATION_ID) {
                //         $idPerson = $arrayPerson[$a]['RELATION_ORGANIZATION_ID'];
                //         TPic::where('RELATION_ORGANIZATION_ID', $idPerson)->update([
                //             "PIC_IS_DELETED"         => "0"
                //         ]);
                //     }
                // }

                TPic::create([
                    "PERSON_ID"                 => $request->PERSON_ID,
                    "RELATION_ORGANIZATION_ID"  => $dataRelation->RELATION_ORGANIZATION_ID,
                    "PIC_IS_DELETED"            => "0"
                ]);
            }
        }
        // cek existing mapping relation pic
        // $cekExisting = MRelationPic::where('PERSON_ID', $request->detail_corporate[0]['PERSON_ID'])->get();
        // if ($cekExisting->count() > 0) {
        //     MRelationPic::where('PERSON_ID', $request->detail_corporate[0]['PERSON_ID'])->delete();
        // }



        // for ($i = 0; $i < sizeof($request->detail_corporate); $i++) {
        //     $corporateName = $request->detail_corporate[$i]['RELATION_ORGANIZATION_NAME'];
        //     $personId = $request->detail_corporate[$i]['PERSON_ID'];

        //     $dataRelation = Relation::where('RELATION_ORGANIZATION_NAME', trim($corporateName))->first();


        //     // simpan mapping ke t person
        //     MRelationPic::create([
        //         "RELATION_ORGANIZATION_ID"  => $dataRelation->RELATION_ORGANIZATION_ID,
        //         "PERSON_ID"                 => $personId
        //     ]);
        // }

        $getIdRelation = TPerson::where('PERSON_ID', $request->PERSON_ID)->first();

        return new JsonResponse([
            $getIdRelation->INDIVIDU_RELATION_ID,
            "Corporate For PIC Edited"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_individu_aka(Request $request)
    {
        $detailRelation = Relation::where('RELATION_ORGANIZATION_ID', $request->idIndividu)->first();
        // print_r($detailRelation);die;
        return response()->json($detailRelation);
    }

    public function edit_bank(Request $request)
    {

        // cek existing bank_relation
        $dataBankExisting = MBankAccountRelation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->get();
        if ($dataBankExisting->count() > 0) {
            MBankAccountRelation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->delete();
        }

        // bank account relation
        $bankAccountRelation = is_countable($request->bank_account);
        if ($bankAccountRelation) {
            for ($i = 0; $i < sizeof($request->bank_account); $i++) {
                $varBankAccount = $request->bank_account[$i];
                $npwpRelation = $varBankAccount['NPWP_NAME'];
                if ($varBankAccount['NPWP_NAME'] == "" || $varBankAccount['NPWP_NAME'] == null) {
                    $npwpRelation = $request->NPWP_RELATION;
                }

                // create bank relation account
                $createMPksRelation = MBankAccountRelation::create([
                    "RELATION_ORGANIZATION_ID"          => $varBankAccount['RELATION_ORGANIZATION_ID'],
                    "BANK_ID"                           => $varBankAccount['BANK_ID'],
                    "ACCOUNT_NAME"                      => $varBankAccount['ACCOUNT_NAME'],
                    "ACCOUNT_NUMBER"                    => $varBankAccount['ACCOUNT_NUMBER'],
                    "NPWP_NAME"                         => $npwpRelation,
                ]);
            }
        }

        return new JsonResponse([
            $request->RELATION_ORGANIZATION_ID,
            "Bank Relation Edited"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getPKSAgentJson(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = MPksRelation::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $query->leftJoin('t_document', 't_document.DOCUMENT_ID', '=', 'm_pks_relation.DOCUMENT_PKS_ID')->where('FOR_PKS', 1)->where('m_pks_relation.RELATION_ORGANIZATION_ID', $request->id);

        if ($sortModel) {
            $sortModel = explode(';', $sortModel);
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection);
            }
        }

        // if ($filterModel) {
        //     foreach ($filterModel as $colId => $filterValue) {
        //         if ($colId === 'RELATION_ORGANIZATION_ALIAS') {
        //             $query->where('RELATION_ORGANIZATION_ALIAS', 'LIKE', '%' . $filterValue . '%');
        //         }
        //         // elseif ($colId === 'policy_inception_date') {
        //         //     $query->where('policy_inception_date', '<=', date('Y-m-d', strtotime($filterValue)))
        //         //           ->where('policy_due_date', '>=', date('Y-m-d', strtotime($filterValue)));
        //         // }
        //     }
        // }

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }

    public function getPKSFbiJson(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = MPksRelation::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $query->leftJoin('t_document', 't_document.DOCUMENT_ID', '=', 'm_pks_relation.DOCUMENT_PKS_ID')->where('FOR_PKS', 2)->where('m_pks_relation.RELATION_ORGANIZATION_ID', $request->id);

        if ($sortModel) {
            $sortModel = explode(';', $sortModel);
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection);
            }
        }

        // if ($filterModel) {
        //     foreach ($filterModel as $colId => $filterValue) {
        //         if ($colId === 'RELATION_ORGANIZATION_ALIAS') {
        //             $query->where('RELATION_ORGANIZATION_ALIAS', 'LIKE', '%' . $filterValue . '%');
        //         }
        //         // elseif ($colId === 'policy_inception_date') {
        //         //     $query->where('policy_inception_date', '<=', date('Y-m-d', strtotime($filterValue)))
        //         //           ->where('policy_due_date', '>=', date('Y-m-d', strtotime($filterValue)));
        //         // }
        //     }
        // }

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }

    public function edit_document_pks(Request $request)
    {
        // No PKS
        $pksDocument = is_countable($request->no_pks);
        if ($pksDocument) {
            for ($i = 0; $i < sizeof($request->no_pks); $i++) {
                $varPKS = $request->no_pks[$i];
                // $noPKS = $varPKS['NO_PKS'];

                $createMPksRelation = MPksRelation::create([
                    "RELATION_ORGANIZATION_ID"          => $varPKS['RELATION_ORGANIZATION_ID'],
                    "NO_PKS"                            => $varPKS['NO_PKS'],
                    "STAR_DATE_PKS"                     => $varPKS['STAR_DATE_PKS'],
                    "END_DATE_PKS"                      => $varPKS['END_DATE_PKS'],
                    "FOR_PKS"                           => $varPKS['FOR_PKS']['value'],
                    "REMARKS_PKS"                       => $varPKS['REMARKS_PKS'],
                    "STATUS_PKS"                        => $varPKS['STATUS_PKS'],
                    "ENDING_BY_CANCEL"                  => $varPKS['ENDING_BY_CANCEL'],
                ]);

                // create Document PKS
                for ($a = 0; $a < sizeof($request->file('no_pks')); $a++) {
                    $file = $request->file('no_pks');
                    $varDocument = $file[$a]['DOCUMENT_PKS_ID'];

                    // Create Folder For Person Document
                    $parentDir = ((floor(($varPKS['RELATION_ORGANIZATION_ID']) / 1000)) * 1000) . '/';
                    $personID = $varPKS['RELATION_ORGANIZATION_ID'] . '/';
                    $typeDir = "";
                    $uploadPath = 'documents/' . 'PKS/' . $parentDir . $personID . $typeDir;


                    // get Data Document
                    $documentOriginalName = $this->RemoveSpecialChar($varDocument->getClientOriginalName());
                    $documentFileName = $this->RemoveSpecialChar($varDocument->getClientOriginalName());
                    $documentDirName = $uploadPath;
                    $documentFileType = $varDocument->getClientMimeType();
                    $documentFileSize = $varDocument->getSize();

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
                        Storage::disk('public')->putFileAs($uploadPath, $varDocument, $document . "-" . $this->RemoveSpecialChar($varDocument->getClientOriginalName()));
                    }


                    if ($document) {
                        MPksRelation::where('M_PKS_RELATION_ID', $createMPksRelation->M_PKS_RELATION_ID)->update([
                            'DOCUMENT_PKS_ID'     => $document,
                        ]);
                    }
                }
            }
        }

        return new JsonResponse([
            $request->no_pks[0]['RELATION_ORGANIZATION_ID'],
            "Document PKS Relation Edited"
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
