<?php

namespace App\Http\Controllers;

use App\Models\MRelationAgent;
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

    public function getRelationAgent($dataPerPage = 5, $searchQuery = null)
    {

        // dd($searchQuery->RELATION_ORGANIZATION_NAME);
        $clientId = 3;
        $nullName = "is null";
        $data = Relation::orderBy('RELATION_ORGANIZATION_ID', 'desc')->whereHas('mRelationType', function($q) use($clientId) {
            // Query the name field in status table
            $q->where('RELATION_TYPE_ID', 'like', '%'.$clientId.'%');
        });
        // ->whereDoesntHave('MRelationAgent', function (Builder $query) {
        //     $query->whereNotNull('RELATION_ORGANIZATION_ID');
        // });
        if ($searchQuery) {
            if ($searchQuery->input('RELATION_ORGANIZATION_NAME')) {
                    $data->where('RELATION_ORGANIZATION_NAME', 'like', '%'.$searchQuery->RELATION_ORGANIZATION_NAME.'%');
            }
        } 
        // dd($data->toSql());
        return $data->paginate($dataPerPage);
    }

    // for get json agent
    public function getRelationAgentJson(Request $request){
        $data = $this->getRelationAgent(5, $request);
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
        $data = MRelationAgent::with('relation')->where('RELATION_AGENT_ID', $request->id)->get();

        return response()->json($data);
    }

    public function relationAgent(Request $request){
        $clientId = 3;
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
}
