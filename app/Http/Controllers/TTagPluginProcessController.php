<?php

namespace App\Http\Controllers;

use App\Models\RPluginProcess;
use App\Models\TTagPluginProcess;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TTagPluginProcessController extends Controller
{
    public function getPlugin(Request $request){
        $data = RPluginProcess::get();
        return response()->json($data);
    }

    public function store(Request $request){
// dd($request);
        $tTagRelation = TTagPluginProcess::create([
            "TAG_ID" => $request->TAG_ID,
            "PLUGIN_PROCESS_ID" => $request->PLUGIN_PROCESS_ID
        ]);


        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Created (Plugin).",
                "module"      => "Plugin",
                "id"          => $tTagRelation->TAG_PLUGIN_PROCESS_ID
            ]),
            'action_by'  => Auth::user()->email
        ]);


        return new JsonResponse([
            $tTagRelation->TAG_PLUGIN_PROCESS_ID,
            "Add Plugin Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getTPlugin(Request $request){
        $data = TTagPluginProcess::get();
        return response()->json($data);
    }
}
