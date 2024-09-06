<?php

namespace App\Http\Controllers;

use App\Models\RPluginProcess;
use App\Models\TMessageChat;
use App\Models\TTagPluginProcess;
use App\Models\TTypeChat;
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
        $createTypeChat = TTypeChat::create([
            "TYPE_CHAT_TITLE"           => $request->TITLE_CHAT,
            "TYPE_CHAT_OBJECT"          => $request->OBJECT_CHAT,
            "CREATED_TYPE_CHAT_DATE"    => now(),
            "CREATED_TYPE_CHAT_BY"      => Auth::user()->id,
        ]);

        // create message chat
        if ($createTypeChat) {
            TMessageChat::create([
                "TYPE_CHAT_ID"                  => $createTypeChat->TYPE_CHAT_ID,
                "USER_ID"                       => Auth::user()->id,
                "MESSAGE_CHAT_TEXT"             => $request->INITIATE_YOUR_CHAT,
                "MESSAGE_CHAT_DOCUMENT_ID"      => null,
                "CREATED_MESSAGE_CHAT_DATE"     => now(),
                "CREATED_MESSAGE_CHAT_BY"       => Auth::user()->id,
            ]);
        }


        return new JsonResponse([
            $idTTagRelation,
            $request->PLUGIN_PROCESS_ID,
            "Add Plugin Success",
            (string)$createTypeChat->TYPE_CHAT_ID,
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getTPlugin(Request $request){
        $data = TTagPluginProcess::get();
        return response()->json($data);
    }
}
