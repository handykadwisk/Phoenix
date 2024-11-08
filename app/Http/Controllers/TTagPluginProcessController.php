<?php

namespace App\Http\Controllers;

use App\Models\RPluginProcess;
use App\Models\TChatDetail;
use App\Models\TTagPluginProcess;
use App\Models\TChat;
use App\Models\TChatDetailUser;
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
        $data = RPluginProcess::where('PLUGIN_PROCESS_SHOW_CONTEXT_MENU', 1)->get();
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
            $chatDetail = TChatDetail::create([
                "CHAT_ID"                      => $createTypeChat->CHAT_ID,
                "CHAT_DETAIL_TEXT"             => $request->INITIATE_YOUR_CHAT,
                "CHAT_DETAIL_DOCUMENT_ID"      => null,
                "CREATED_CHAT_DETAIL_DATE"     => now(),
                "CREATED_CHAT_DETAIL_BY"       => Auth::user()->id,
            ]);

            // untuk diri sendirinya
            TChatParticipant::create([
                'CHAT_ID'                       => $createTypeChat->CHAT_ID,
                'CHAT_PARTICIPANT_NAME'         => Auth::user()->name,
                'USER_ID'                       => Auth::user()->id,
                'DIVISION_ID'                   => null,
                'IS_DIVISION'                   => 0,
                'CHAT_PARTICIPANT_CREATED_BY'   => Auth::user()->id,
                'CHAT_PARTICIPANT_CREATED_DATE' => now()
            ]);
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
                        'CHAT_PARTICIPANT_CREATED_BY'   => Auth::user()->id,
                        'CHAT_PARTICIPANT_CREATED_DATE' => now()
                    ]);
                }
                // get data participant for message detail user
                $dataParticipant  = TChatParticipant::where('CHAT_ID', $createTypeChat->CHAT_ID)->get();
                for ($i = 0; $i < sizeof($dataParticipant); $i++) {
                    if ($dataParticipant[$i]['USER_ID'] != null) {
                        TChatDetailUser::create([
                            "CHAT_ID"                                   => $createTypeChat->CHAT_ID,
                            "CHAT_DETAIL_ID"                            => $chatDetail->CHAT_DETAIL_ID,
                            "CHAT_DETAIL_USER_TO"                       => $dataParticipant[$i]['USER_ID'],
                            "CHAT_DETAIL_USER_FROM"                     => Auth::user()->id,
                            "CHAT_DETAIL_USER_STATUS_READ"              => 0,
                            "CHAT_DETAIL_USER_STATUS_MENTION"           => 0,
                            "CHAT_DETAIL_USER_REPLY_DATE"               => null,
                            "CHAT_DETAIL_USER_RELATE_CHAT_DETAIL_ID"    => null,
                            "CHAT_DETAIL_USER_CREATED_DATE"             => now(),
                            "CHAT_DETAIL_USER_CREATED_ID"               => Auth::user()->id,
                        ]);
                    }
                }
            }
            // end add Perticipant
        }


        return new JsonResponse([
            $idTTagRelation,
            $request->PLUGIN_PROCESS_ID,
            "Add Plugin Success",
            (string)$createTypeChat->CHAT_ID,
            $request->TAG_ID,
            "Add Chat Success",
            Auth::user()->id
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
