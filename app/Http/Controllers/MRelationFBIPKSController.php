<?php

namespace App\Http\Controllers;

use App\Models\MRelationFBIPKS;
use App\Models\Relation;
use App\Models\UserLog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MRelationFBIPKSController extends Controller
{
    public function index()
    {

        return Inertia::render('FBIBYPKS/Index', [
        ]);
    }

    // for FBI
    public function getRelationFBI(Request $request){
        // $data = MRelationAgent::with('relation')->where('RELATION_AGENT_ID', $request->id)->get();
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = Relation::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);
        $query->leftJoin('m_relation_type', 't_relation.RELATION_ORGANIZATION_ID', '=', 'm_relation_type.RELATION_ORGANIZATION_ID')->where('RELATION_TYPE_ID', "13");

        if ($sortModel) {
            $sortModel = explode(';', $sortModel); 
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection); 
            }
        }

        if ($request->newFilter !== "") {
            if ($newSearch[0]["flag"] !== "") {
                $query->where('RELATION_ORGANIZATION_NAME', 'LIKE', '%' . $newSearch[0]['flag'] . '%');
            }else{
                // dd("masuk sini");
                foreach ($newSearch[0] as $keyId => $searchValue) {
                    if ($keyId === 'RELATION_ORGANIZATION_NAME') {
                        $query->where('RELATION_ORGANIZATION_NAME', 'LIKE', '%' . $searchValue . '%');
                    }
                }
            }
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }

    public function getMRelationFBI(Request $request){
        // $data = MRelationAgent::with('relation')->where('RELATION_AGENT_ID', $request->id)->get();
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = MRelationFBIPKS::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $query->leftJoin('t_relation', 'm_relation_fbi.RELATION_ORGANIZATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')->where('RELATION_FBI_ID', $request->id);

        if ($sortModel) {
            $sortModel = explode(';', $sortModel); 
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection); 
            }
        }

        if ($filterModel) {
            foreach ($filterModel as $colId => $filterValue) {
                if ($colId === 'RELATION_ORGANIZATION_ALIAS') {
                    $query->where('RELATION_ORGANIZATION_ALIAS', 'LIKE', '%' . $filterValue . '%');
                } 
                // elseif ($colId === 'policy_inception_date') {
                //     $query->where('policy_inception_date', '<=', date('Y-m-d', strtotime($filterValue)))
                //           ->where('policy_due_date', '>=', date('Y-m-d', strtotime($filterValue)));
                // }
            }
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($data);
    }

    
    public function relationFbi(Request $request){
        $clientId = 1;
        $data = Relation::whereHas('mRelationType', function($q) use($clientId) {
            // Query the name field in status table
            $q->where('RELATION_TYPE_ID', 'like', '%'.$clientId.'%');
        })->whereDoesntHave('MRelationFbi', function (Builder $query) {
            $query->whereNotNull('RELATION_ORGANIZATION_ID');
        })->get();

        return response()->json($data);
    }

    public function addMRelationFBI(Request $request){
        for ($i=0; $i < sizeof($request->name_relation); $i++) { 
            $nameRelation = trim($request->name_relation[$i]);
            $idFBI = $request->idFBI;

            // get id relation from name relation
            $idRelation = Relation::select('RELATION_ORGANIZATION_ID')->where('RELATION_ORGANIZATION_NAME', $nameRelation)->first();
            $idRelationNew = $idRelation['RELATION_ORGANIZATION_ID'];

            // add Store M Relation Agent
            $mRelationBaa = MRelationFBIPKS::create([
                "RELATION_FBI_ID" =>  $idFBI,
                "RELATION_ORGANIZATION_ID" => $idRelationNew,
            ]);

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Created (M Relation FBI).",
                    "module"      => "M Relation FBI",
                    "id"          => $mRelationBaa->M_RELATION_BAA_ID
                ]),
                'action_by'  => Auth::user()->user_login
            ]);
        }
        return new JsonResponse([
            $request->idFBI,
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function deleteFBI(Request $request){
        MRelationFBIPKS::where('M_RELATION_FBI_ID', $request->id)->delete();

        return new JsonResponse([
            $request->id,
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
