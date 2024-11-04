<?php

namespace App\Http\Controllers;

use App\Models\MRelationAgent;
use App\Models\MRelationBaa;
use App\Models\Policy;
use App\Models\Relation;
use App\Models\TPerson;
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

        return Inertia::render('Agent/Agent', []);
    }


    public function index_baa()
    {

        return Inertia::render('BAA/Baa', []);
    }

    public function getRelationAgent($request)
    {

        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $clientId = 3;

        $query = Relation::query()->whereHas('mRelationType', function ($q) use ($clientId) {
            // Query the name field in status table
            $q->where('RELATION_TYPE_ID', 'like', '%' . $clientId . '%');
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
    public function getRelationAgentJson(Request $request)
    {
        $data = $this->getRelationAgent($request);
        // print_r($data);
        // die;
        return response()->json($data);
    }

    // add store agent
    public function store(Request $request)
    {

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
            'action_by'  => Auth::user()->user_login
        ]);


        return new JsonResponse([
            $agent->RELATION_AGENT_ID,
            $nameAgentNew
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getMRelationAgent(Request $request)
    {
        // $data = MRelationAgent::with('relation')->where('RELATION_AGENT_ID', $request->id)->get();
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = MRelationAgent::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $query->leftJoin('t_relation', 'm_relation_agents.RELATION_ORGANIZATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')->where('RELATION_AGENT_ID', $request->id);

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

    public function relationAgent(Request $request)
    {
        $clientId = 1;
        $data = Relation::where('is_deleted', '<>', 1)->whereHas('mRelationType', function ($q) use ($clientId) {
            // Query the name field in status table
            $q->where('RELATION_TYPE_ID', 'like', '%' . $clientId . '%');
        })->whereDoesntHave('MRelationAgent', function (Builder $query) {
            $query->whereNotNull('RELATION_ORGANIZATION_ID');
        })->get();

        return response()->json($data);
    }

    public function addMRelationAgent(Request $request)
    {


        for ($i = 0; $i < sizeof($request->name_relation); $i++) {
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
                'action_by'  => Auth::user()->user_login
            ]);
        }
        return new JsonResponse([
            $request->idAgent,
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function deleteAgent(Request $request)
    {
        MRelationAgent::where('M_RELATION_AGENT_ID', $request->id)->delete();

        return new JsonResponse([
            $request->id,
        ], 201, [
            'X-Inertia' => true
        ]);
    }



    // for BAA
    public function getBAA(Request $request)
    {
        // $data = MRelationAgent::with('relation')->where('RELATION_AGENT_ID', $request->id)->get();
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = Relation::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $newSearch = json_decode($request->newFilter, true);
        $query->leftJoin('m_relation_type', 't_relation.RELATION_ORGANIZATION_ID', '=', 'm_relation_type.RELATION_ORGANIZATION_ID')->where('RELATION_TYPE_ID', "12");

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
            } else {
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

    public function getMRelationBAA(Request $request)
    {
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

    public function addMRelationBaa(Request $request)
    {


        for ($i = 0; $i < sizeof($request->name_relation); $i++) {
            $nameRelation = trim($request->name_relation[$i]);

            // get id relation from name relation
            $idRelation = Relation::select('RELATION_ORGANIZATION_ID')->where('RELATION_ORGANIZATION_NAME', $nameRelation)->first();
            $idRelationNew = $idRelation['RELATION_ORGANIZATION_ID'];

            // add Store M Relation Agent
            $mRelationBaa = MRelationBaa::create([
                "RELATION_BAA_ID" =>  $request->idBaa,
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
                'action_by'  => Auth::user()->user_login
            ]);
        }
        return new JsonResponse([
            $request->idBaa,
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function relationBaa(Request $request)
    {
        $clientId = 1;
        $data = Relation::where('is_deleted', '<>', 1)->whereHas('mRelationType', function ($q) use ($clientId) {
            // Query the name field in status table
            $q->where('RELATION_TYPE_ID', 'like', '%' . $clientId . '%');
        })->whereDoesntHave('MRelationBaa', function (Builder $query) {
            $query->whereNotNull('RELATION_ORGANIZATION_ID');
        })->get();

        return response()->json($data);
    }

    public function deleteBaa(Request $request)
    {
        MRelationBaa::where('M_RELATION_BAA_ID', $request->id)->delete();

        return new JsonResponse([
            $request->id,
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getRelationByIdPerson(Request $request)
    {
        $data = TPerson::leftJoin('t_relation', 't_person.RELATION_ORGANIZATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')->where('PERSON_ID', $request->idPerson)->first();

        return response()->json($data);
    }

    public function getPolicyByRelationId(Request $request)
    {

        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        $query = Policy::query();
        $sortModel = $request->input('sort');
        $filterModel = json_decode($request->input('filter'), true);
        $query->leftJoin('t_relation', 't_policy.RELATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')->where('t_policy.RELATION_ID', $request->id)->first();

        if ($sortModel) {
            $sortModel = explode(';', $sortModel);
            foreach ($sortModel as $sortItem) {
                list($colId, $sortDirection) = explode(',', $sortItem);
                $query->orderBy($colId, $sortDirection);
            }
        }

        if ($filterModel) {
            foreach ($filterModel as $colId => $filterValue) {
                if ($colId === 'POLICY_NUMBER') {
                    $query->where('POLICY_NUMBER', 'LIKE', '%' . $filterValue . '%');
                }
                // elseif ($colId === 'policy_inception_date') {
                //     $query->where('policy_inception_date', '<=', date('Y-m-d', strtotime($filterValue)))
                //           ->where('policy_due_date', '>=', date('Y-m-d', strtotime($filterValue)));
                // }
            }
        }

        $data = $query->paginate($perPage, ['*'], 'page', $page);
        // $data = Policy::leftJoin('t_relation', 't_policy.RELATION_ID', '=', 't_relation.RELATION_ORGANIZATION_ID')->where('t_policy.RELATION_ID', $request->id)->first();

        return response()->json($data);
    }
}
