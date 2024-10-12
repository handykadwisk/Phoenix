<?php

namespace App\Http\Controllers;

use App\Models\RPluginProcess;
use App\Models\TChatDetail;
use App\Models\TTagPluginProcess;
use App\Models\TChat;
use App\Models\TChatParticipant;
use App\Models\TCompanyDivision;
use App\Models\TParticipantChat;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TTagPluginProcessController extends Controller
{
    public function getPlugin(Request $request)
    {
        $data = RPluginProcess::get();
        return response()->json($data);
    }

    public function store(Request $request)
    {
        // dd($request);
        // cek sudah ada apa belum di tplug
        $cekExisting = TTagPluginProcess::where('PLUGIN_PROCESS_ID', $request->PLUGIN_PROCESS_ID)->where('TAG_ID', $request->TAG_ID)->first();
        // dd($cekExisting);
        $idTTagRelation = "";
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
                'action_by'  => Auth::user()->user_login
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

            // add Participant
            $arrayParticipant = is_countable($request->PARTICIPANT);
            if ($arrayParticipant) {
                for ($i = 0; $i < sizeof($request->PARTICIPANT); $i++) {
                    $valueParticipant = trim($request->PARTICIPANT[$i]['value']);
                    $nameParticipant = trim($request->PARTICIPANT[$i]['label']);

                    // cek division or no
                    $is_division = 0;
                    $idDivision  = null;
                    $userId = null;
                    $isDivision = TCompanyDivision::where('COMPANY_DIVISION_ALIAS', $nameParticipant)->get();
                    if ($isDivision->count() > 0) {
                        $is_division = "1";
                        $idDivision = $isDivision[0]['COMPANY_DIVISION_ID'];
                    } else {
                        // User_id Participant
                        $symbol = '+';
                        $posisi = strpos($valueParticipant, $symbol);
                        $userId = substr($valueParticipant, $posisi + 1);
                    }

                    // created add participant
                    $addParticipant = TChatParticipant::create([
                        'CHAT_ID'                       => $createTypeChat->CHAT_ID,
                        'CHAT_PARTICIPANT_NAME'         => $nameParticipant,
                        'USER_ID'                       => $userId,
                        'DIVISION_ID'                   => $idDivision,
                        'IS_DIVISION'                   => $is_division,
                        'CREATED_CHAT_PARTICIPANT_BY'   => Auth::user()->id,
                        'CREATED_CHAT_PARTICIPANT_DATE' => now()
                    ]);
                }
            }
            // end add Perticipant



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
            $request->TAG_ID,
            "Add Chat Success"
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getTPlugin(Request $request)
    {
        $data = TTagPluginProcess::get();
        return response()->json($data);
    }
}
