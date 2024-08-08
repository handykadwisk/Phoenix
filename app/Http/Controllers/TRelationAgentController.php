<?php

namespace App\Http\Controllers;

use App\Models\MRelationAgent;
use App\Models\MRelationBaa;
use App\Models\Relation;
use App\Models\TRelationAgent;
use App\Models\UserLog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TRelationAgentController extends Controller
{
    public function index()
    {

        return Inertia::render('Agent/Agent', [
        ]);
    }

    
    public function index_baa()
    {

        return Inertia::render('BAA/Baa', [
        ]);
    }

    public function getRelationAgent($request)
    {

        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $clientId = 3;

        $query = Relation::query()->whereHas('mRelationType', function($q) use($clientId) {
                // Query the name field in status table
                $q->where('RELATION_TYPE_ID', 'like', '%'.$clientId.'%');
            });
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        
        if ($sortModel) {
            $sortModel = explode(';', $sortModel); 
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection); 
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

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return $data;
        // dd($searchQuery->RELATION_ORGANIZATION_NAME);
        // $clientId = 3;
        // $nullName = "is null";
        // $data = Relation::orderBy('RELATION_ORGANIZATION_ID', 'desc')->whereHas('mRelationType', function($q) use($clientId) {
        //     // Query the name field in status table
        //     $q->where('RELATION_TYPE_ID', 'like', '%'.$clientId.'%');
        // });
        // // ->whereDoesntHave('MRelationAgent', function (Builder $query) {
        // //     $query->whereNotNull('RELATION_ORGANIZATION_ID');
        // // });
        // if ($searchQuery) {
        //     if ($searchQuery->input('RELATION_ORGANIZATION_NAME')) {
        //             $data->where('RELATION_ORGANIZATION_NAME', 'like', '%'.$searchQuery->RELATION_ORGANIZATION_NAME.'%');
        //     }
        // } 
        // // dd($data->toSql());
        // return $data->paginate($dataPerPage);
    }

    // for get json agent
    public function getRelationAgentJson(Request $request){
        $data = $this->getRelationAgent($request);
        // print_r($data);
        // die;
        return response()->json($data);
    }

    // add store agent
    public function store(Request $request){
        
        // ubah ke huruf awal kapital
        $nameAgent = strtolower($request->RELATION_AGENT_NAME);
        $nameAgentNew = ucwords($nameAgent);



        $agent = TRelationAgent::create([
            'RELATION_AGENT_NAME' => $nameAgent,
            'RELATION_AGENT_ALIAS' => $nameAgent,
            'RELATION_AGENT_DESCRIPTION' => $request->RELATION_AGENT_DESCRIPTION,
            'RELATION_AGENT_CREATED_BY' => Auth::user()->id,
            'RELATION_AGENT_CREATED_DATE' => now(),
        ]);

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Agent).",
                "module"      => "Agent",
                "id"          => $agent->RELATION_AGENT_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $agent->RELATION_AGENT_ID,
            $nameAgentNew
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getMRelationAgent(Request $request){
        // $data = MRelationAgent::with('relation')->where('RELATION_AGENT_ID', $request->id)->get();
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = MRelationAgent::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $query->leftJoin('t_relation', 'm_relation_agents.RELATION_ORGANIZATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')->where('RELATION_AGENT_ID', $request->idAgent);

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

    public function relationAgent(Request $request){
        $clientId = 1;
        $data = Relation::whereHas('mRelationType', function($q) use($clientId) {
            // Query the name field in status table
            $q->where('RELATION_TYPE_ID', 'like', '%'.$clientId.'%');
        })->whereDoesntHave('MRelationAgent', function (Builder $query) {
            $query->whereNotNull('RELATION_ORGANIZATION_ID');
        })->get();

        return response()->json($data);
    }

    public function addMRelationAgent(Request $request){
        

        for ($i=0; $i < sizeof($request->name_relation); $i++) { 
            $nameRelation = trim($request->name_relation[$i]);

            // get id relation from name relation
            $idRelation = Relation::select('RELATION_ORGANIZATION_ID')->where('RELATION_ORGANIZATION_NAME', $nameRelation)->first();
            $idRelationNew = $idRelation['RELATION_ORGANIZATION_ID'];

            // add Store M Relation Agent
            $mRelationAgent = MRelationAgent::create([
                "RELATION_AGENT_ID" =>  $request->idAgent,
                "RELATION_ORGANIZATION_ID" => $idRelationNew,
            ]);

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Created (M Relation Agent).",
                    "module"      => "M Relation Agent",
                    "id"          => $mRelationAgent->M_RELATION_AGENT_ID
                ]),
                'action_by'  => Auth::user()->email
            ]);
        }
        return new JsonResponse([
            $request->idAgent,
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function deleteAgent(Request $request){
        MRelationAgent::where('M_RELATION_AGENT_ID', $request->id)->delete();

        return new JsonResponse([
            $request->id,
        ], 201, [
            'X-Inertia' => true
        ]);
    }



    // for BAA
    public function getRelationBAA(Request $request){
        // $data = MRelationAgent::with('relation')->where('RELATION_AGENT_ID', $request->id)->get();
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = Relation::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $query->where('relation_status_id', "2");

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

    public function getMRelationBAA(Request $request){
        // $data = MRelationAgent::with('relation')->where('RELATION_AGENT_ID', $request->id)->get();
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = MRelationBaa::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $query->leftJoin('t_relation', 'm_relation_baa.RELATION_ORGANIZATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')->where('RELATION_BAA_ID', $request->id);

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

    public function addMRelationBaa(Request $request){
        

        for ($i=0; $i < sizeof($request->name_relation); $i++) { 
            $nameRelation = trim($request->name_relation[$i]);

            // get id relation from name relation
            $idRelation = Relation::select('RELATION_ORGANIZATION_ID')->where('RELATION_ORGANIZATION_NAME', $nameRelation)->first();
            $idRelationNew = $idRelation['RELATION_ORGANIZATION_ID'];

            // add Store M Relation Agent
            $mRelationBaa = MRelationBaa::create([
                "RELATION_BAA_ID" =>  $request->idAgent,
                "RELATION_ORGANIZATION_ID" => $idRelationNew,
            ]);

            // Created Log
            UserLog::create([
                'created_by' => Auth::user()->id,
                'action'     => json_encode([
                    "description" => "Created (M Relation BAA).",
                    "module"      => "M Relation BAA",
                    "id"          => $mRelationBaa->M_RELATION_BAA_ID
                ]),
                'action_by'  => Auth::user()->email
            ]);
        }
        return new JsonResponse([
            $request->idAgent,
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function relationBaa(Request $request){
        $clientId = 1;
        $data = Relation::whereHas('mRelationType', function($q) use($clientId) {
            // Query the name field in status table
            $q->where('RELATION_TYPE_ID', 'like', '%'.$clientId.'%');
        })->whereDoesntHave('MRelationBaa', function (Builder $query) {
            $query->whereNotNull('RELATION_ORGANIZATION_ID');
        })->get();

        return response()->json($data);
    }

    public function deleteBaa(Request $request){
        MRelationBaa::where('M_RELATION_BAA_ID', $request->id)->delete();

        return new JsonResponse([
            $request->id,
        ], 201, [
            'X-Inertia' => true
        ]);
    }
}
