<?php

namespace App\Http\Controllers;

use App\Models\RPluginProcess;
use App\Models\TChatDetail;
use App\Models\TTagPluginProcess;
use App\Models\TChat;
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
        // cek sudah ada apa belum di tplug
        $cekExisting = TTagPluginProcess::where('PLUGIN_PROCESS_ID', $request->PLUGIN_PROCESS_ID)->where('TAG_ID', $request->TAG_ID)->first();
        // dd($cekExisting);
        $idTTagRelation="";
        if ($cekExisting == null) {
            # code...
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

            $idTTagRelation = $tTagRelation->TAG_PLUGIN_PROCESS_ID;
    
    
        }

        // register type chatnya apa?
        $createTypeChat = TChat::create([
            "TAG_ID"               => $request->TAG_ID,
            "CHAT_TITLE"           => $request->TITLE_CHAT,
            "CHAT_OBJECT"          => $request->OBJECT_CHAT,
            "CREATED_CHAT_DATE"    => now(),
            "CREATED_CHAT_BY"      => Auth::user()->id,
        ]);

        // create message chat
        if ($createTypeChat) {
            TChatDetail::create([
                "CHAT_ID"                  => $createTypeChat->CHAT_ID,
                "CHAT_DETAIL_TEXT"             => $request->INITIATE_YOUR_CHAT,
                "CHAT_DETAIL_DOCUMENT_ID"      => null,
                "CREATED_CHAT_DETAIL_DATE"     => now(),
                "CREATED_CHAT_DETAIL_BY"       => Auth::user()->id,
            ]);
        }


        return new JsonResponse([
            $idTTagRelation,
            $request->PLUGIN_PROCESS_ID,
            "Add Plugin Success",
            (string)$createTypeChat->CHAT_ID,
            $request->TAG_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getTPlugin(Request $request){
        $data = TTagPluginProcess::get();
        return response()->json($data);
    }
}
