<?php

namespace App\Http\Controllers;

use App\Models\TRelationAgent;
use App\Models\UserLog;
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
        $data = TRelationAgent::orderBy('RELATION_AGENT_ID', 'desc');
        if ($searchQuery) {
            if ($searchQuery->input('RELATION_AGENT_NAME')) {
                    $data->where('RELATION_AGENT_NAME', 'like', '%'.$searchQuery->RELATION_AGENT_NAME.'%');
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

    public function get_detail(Request $request){
        $data = TRelationAgent::find($request->id);

        return response()->json($data);
    }
}
