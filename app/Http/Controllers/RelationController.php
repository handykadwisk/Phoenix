<?php

namespace App\Http\Controllers;

use App\Models\MRelationAka;
use App\Models\MRelationType;
use App\Models\MTag;
use App\Models\Relation;
use App\Models\RelationGroup;
use App\Models\RelationLob;
use App\Models\RelationProfession;
use App\Models\RelationStatus;
use App\Models\RelationType;
use App\Models\Salutation;
use App\Models\Tag;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use RealRashid\SweetAlert\Facades\Alert as FacadesAlert;

class RelationController extends Controller
{
    public function getOldRelation($id)
    {
        $oldRelation = Relation::where('RELATION_ORGANIZATION_ID', $id)->get();
        return $oldRelation;
    }

    public function getRelationData($dataPerPage = 5, $searchQuery = null)
    {

        $RType = $searchQuery->RELATION_TYPE_ID;
        $data = Relation::orderBy('RELATION_ORGANIZATION_ID', 'desc')->with('PreSalutation')->with('PostSalutation');
        // print_r($data);
        if ($searchQuery) {
            if ($searchQuery->input('RELATION_ORGANIZATION_NAME')) {
                $data->where('RELATION_ORGANIZATION_NAME', 'like', '%'.$searchQuery->RELATION_ORGANIZATION_NAME.'%');
            }
            if ($searchQuery->input('RELATION_TYPE_ID')) {
                $data->whereHas('mRelationType', function($q) use($RType) {
                    // Query the name field in status table
                    $q->where('RELATION_TYPE_ID', 'like', '%'.$RType.'%');
             });
            }
        }
            // dd($data->get());

            return $data->paginate($dataPerPage);
    }

    // Get All Relation Type
    public function getAllRelatioType()
    {
        $relationType = RelationType::get();

        return $relationType;
    }


    public function getRelationJson(Request $request)
    {
        $data = $this->getRelationData(5, $request);
        // print_r($data);
        // die;
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
        $relation = Relation::where('RELATION_ORGANIZATION_PARENT_ID', "0")->paginate(3);

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
            'profession'   => $profession
        ]);
    }

    public function get_mapping(Request $request)
    {
        $data = DB::select('call sp_combo_relation_organization(?)', [$request->name]);
        return response()->json($data);
    }

    public function store(Request $request)
    {


        // cek abbreviation
        // dd($request->abbreviation);
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




        // dd($request);
        // print_r(!is_countable($request->relation_aka));die;
        // if (is_countable($request->relation_aka)) {
        //     echo "ada";
        // }
        // die;
        // Cek Relation Perent Id
        // $parentID = $request->parent_id;
        // if ($request->parent_id == '' || $request->parent_id == NULL) {
        //     $parentID = "0";
        // }

        // ubah ke to lower dan huruf besar di awal
        $nameRelation = strtolower($request->name_relation);
        $nameRelationNew = ucwords($nameRelation);

        $addTBK = $nameRelationNew;
        if ($request->mark_tbk_relation == "1") {
            $addTBK = $nameRelationNew." Tbk.";
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
            // 'RELATION_ORGANIZATION_AKA' => $request->relation_aka,
            // 'RELATION_ORGANIZATION_GROUP' => $request->group_id,
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
            'relation_status_id' => $request->relation_status_id

        ]);

        // Mapping Parent Id and Update
        // DB::select('call sp_set_mapping_relation_organization(?)', [$request->group_id]);

        if (is_countable($request->relation_aka)) {
            // Created Mapping Relation AKA
            for ($i=0; $i < sizeof($request->relation_aka); $i++) {
                $nameRelationAka = $request->relation_aka[$i]["name_aka"];
                MRelationAka::create([
                    "RELATION_ORGANIZATION_ID" => $relation->RELATION_ORGANIZATION_ID,
                    "RELATION_AKA_NAME" => $nameRelationAka
                ]);
            }
        }

        if (is_countable($request->relation_type_id)) {
            // Created Mapping Relation Type
            for ($i = 0; $i < sizeof($request->relation_type_id); $i++) {
                $idRelationType = $request->relation_type_id[$i]["id"];
                MRelationType::create([
                    'RELATION_ORGANIZATION_ID' => $relation->RELATION_ORGANIZATION_ID,
                    'RELATION_TYPE_ID' => $idRelationType
                ]);
            }
        }


        if (is_countable($request->tagging_name)) {
            // created tagging
            for ($i=0; $i < sizeof($request->tagging_name); $i++) {
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

        // get salutation name for detail relation
        $preSalutation = "";
        $postSalutation = "";
        if ($relation->PRE_SALUTATION == null && $relation->POST_SALUTATION == null) {
            $preSalutation = "";
            $postSalutation = "";
        }else{
            if ($relation->PRE_SALUTATION == "" || $relation->PRE_SALUTATION == null) {
                $salutationPost = Salutation::find($relation->POST_SALUTATION);
                $postSalutation = $salutationPost->salutation_name;
            }else{
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
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            $relation->RELATION_ORGANIZATION_ID,
            $addTBK,
            $preSalutation,
            $postSalutation
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



        // cek abbrev apakah sama seperti sebelumnya
        $abbre = Relation::find($request->RELATION_ORGANIZATION_ID);
        $abbreOld = $abbre->RELATION_ORGANIZATION_ABBREVIATION;

        // cek jika sama tidak melakukan cek abbreviation existing
        if ($abbreOld != $request->RELATION_ORGANIZATION_ABBREVIATION) {
            // cek abbreviation
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
        }






        // // cek apakah ganti group apa engga
        // $oldRelation = Relation::find($request->RELATION_ORGANIZATION_ID);
        // $oldGroup = $oldRelation->RELATION_ORGANIZATION_GROUP;
        // if ($oldGroup !== $request->RELATION_ORGANIZATION_GROUP) {
        //     Relation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)
        //         ->update([
        //             'RELATION_ORGANIZATION_GROUP'         => $request->RELATION_ORGANIZATION_GROUP,
        //         ]);
        // }


        // cek apakah dia parent ?
        // $relationParent = Relation::find($request->RELATION_ORGANIZATION_ID);
        // $parentId = $relationParent->RELATION_ORGANIZATION_PARENT_ID;
        // if ($parentId == 0 && $request->RELATION_ORGANIZATION_PARENT_ID != null) {
        //     // cek satu group atau tidak
        //     $return = Relation::where('RELATION_ORGANIZATION_MAPPING', 'like', '%' . $request->RELATION_ORGANIZATION_PARENT_ID .".". '%')->get();
        //     if ($return->count() > 0) {
        //         // update parent to child
        //         $updateParent = Relation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_PARENT_ID)
        //                         ->update([
        //                             'RELATION_ORGANIZATION_PARENT_ID'         => 0,
        //                         ]);

        //         // update child to parent
        //         if ($updateParent) {
        //             Relation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)
        //                         ->update([
        //                             'RELATION_ORGANIZATION_PARENT_ID'         => $request->RELATION_ORGANIZATION_PARENT_ID,
        //                         ]);
        //         }
        //     }else{
        //         Relation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)
        //         ->update([
        //             'RELATION_ORGANIZATION_PARENT_ID'         => $request->RELATION_ORGANIZATION_PARENT_ID,
        //         ]);
        //     }
        // }


        // Cek Relation Perent Id
        // $parentID = $request->RELATION_ORGANIZATION_PARENT_ID;
        // if ($request->RELATION_ORGANIZATION_PARENT_ID == '' || $request->RELATION_ORGANIZATION_PARENT_ID == NULL) {
        //     Relation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)
        //         ->update([
        //             'RELATION_ORGANIZATION_PARENT_ID'         => 0,
        //         ]);
        // }else{
        //     Relation::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)
        //         ->update([
        //             'RELATION_ORGANIZATION_PARENT_ID'         => $parentID,
        //         ]);
        // }

        // ubah ke to lower dan huruf besar di awal
        $nameRelation = strtolower($request->RELATION_ORGANIZATION_NAME);
        $nameRelationNew = ucwords($nameRelation);

        $addTBK = $nameRelationNew;
        if ($request->MARK_TBK_RELATION == "1") {
            $addTBK = $nameRelationNew." Tbk.";
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
                'relation_status_id' => $request->relation_status_id
            ]);

        // Mapping Parent Id and Update
        // DB::select('call sp_set_mapping_relation_organization(?)', [$request->RELATION_ORGANIZATION_GROUP]);

        // check existing relation AKA
        $existingRelationAKA = MRelationAka::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->get();
        if ($existingRelationAKA->count()>0) {
            MRelationAka::where('RELATION_ORGANIZATION_ID', $request->RELATION_ORGANIZATION_ID)->delete();
        }

        // Created Mapping Relation AKA
        for ($i=0; $i < sizeof($request->m_relation_aka); $i++) {
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

        // print_r($request->m_relation_type);
        // die;

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
        for ($i=0; $i < sizeof($request->m_tagging); $i++) {
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
        }else{
            if ($request->PRE_SALUTATION == "" || $request->PRE_SALUTATION == null) {
                $salutationPost = Salutation::find($request->POST_SALUTATION);
                $postSalutation = $salutationPost->salutation_name;
            }else{
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
            'action_by'  => Auth::user()->email
        ]);

        return new JsonResponse([
            $request->RELATION_ORGANIZATION_ID,
            $addTBK,
            $preSalutation,
            $postSalutation
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_detail(Request $request){
        $detailRelation = Relation::find($request->id);
        // print_r($detailRelation);die;
        return response()->json($detailRelation);
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

    public function getCekAbbreviation(Request $request){


        if ($request->flag != "edit") {
            $flag = "0";
            $message = "Existing";
            $data = Relation::where('RELATION_ORGANIZATION_ABBREVIATION', trim(strtoupper($request->name)))->get();
            return response()->json($data);
            // if ($abbreviation->count() > 0) {
            //     $abbreviationName = $abbreviation[0]->RELATION_ORGANIZATION_ABBREVIATION;
            //     if ($abbreviationName == trim(strtoupper($request->abbreviation))) {
            //         return $message;
            //     }
            // }
        }else{
            // cek abbrev apakah sama seperti sebelumnya
            // dd($request->id);
            $abbre = Relation::find($request->id);
            $abbreOld = $abbre->RELATION_ORGANIZATION_ABBREVIATION;
            // dd($abbreOld);

            // cek jika sama tidak melakukan cek abbreviation existing
            if ($abbreOld != trim(strtoupper($request->name))) {
                // dd("masuk sini");
                // cek abbreviation
                $flag = "0";
                $message = "Abbreviation already exists";
                $abbreviation = Relation::where('RELATION_ORGANIZATION_ABBREVIATION', trim(strtoupper($request->name)))->get();
                return response()->json($abbreviation);
                // if ($abbreviation->count() > 0) {
                //     $abbreviationName = $abbreviation[0]->RELATION_ORGANIZATION_ABBREVIATION;
                //     if ($abbreviationName == trim(strtoupper($request->abbreviation))) {
                //         return new JsonResponse([
                //             $flag,
                //             $message
                //         ], 201, [
                //             'X-Inertia' => true
                //         ]);
                //     }
                // }
            }
        }


    }
}
