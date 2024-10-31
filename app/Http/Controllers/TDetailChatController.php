<?php

namespace App\Http\Controllers;

use App\Jobs\SendMessage;
use App\Models\MPinChatDetail;
use App\Models\RPluginProcess;
use App\Models\TChat;
use App\Models\TChatDetail;
use App\Models\TChatDetailUser;
use App\Models\TChatParticipant;
use App\Models\TCompanyDivision;
use App\Models\TEmployee;
use App\Models\TPinChat;
use App\Models\TTagPluginProcess;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class TDetailChatController extends Controller
{
    public function getMessage(Request $request)
    {
        // $data = TChatDetail::select(DB::raw('DATE(CREATED_MESSAGE_CHAT_DATE) as date'), DB::raw('count(*) as total'))->groupBy('date')->with('tUser')->get();
        // return response()->json($data);
        $data = TChatDetail::with('pinChat')
            ->with('parent')
            ->with('chatDetailUser')
            ->where('CHAT_ID', $request->typeChatId)
            ->get()
            ->groupBy(function ($date) {
                return Carbon::parse($date->CREATED_CHAT_DETAIL_DATE)->format('Y-m-d');
            });
        return response()->json($data);
    }

    public function store(Request $request)
    {
        // dd($request);
        // save detail chat
        $createMessage = TChatDetail::create([
            "CHAT_ID"                      => $request->CHAT_ID,
            "CHAT_DETAIL_TEXT"             => $request->INITIATE_YOUR_CHAT,
            "CHAT_DETAIL_DOCUMENT_ID"      => null,
            "CREATED_CHAT_DETAIL_DATE"     => now(),
            "CREATED_CHAT_DETAIL_BY"       => Auth::user()->id,
            "CHAT_DETAIL_PARENT_ID"        => $request->CHAT_DETAIL_PARENT_ID
        ]);
        $modulChat = "Chat";

        SendMessage::dispatch($createMessage, $modulChat);

        // update table t_Chat_detail_user jika di reply
        if ($request->CHAT_DETAIL_PARENT_ID != null) {
            $getDetailChat = TChatDetailUser::where('CHAT_DETAIL_ID', $request->CHAT_DETAIL_PARENT_ID)->where('CHAT_DETAIL_USER_TO', Auth::user()->id)->get();
            if ($getDetailChat->count() > 0) {
                $updateTChatDetailUser = TChatDetailUser::where('CHAT_DETAIL_ID', $request->CHAT_DETAIL_PARENT_ID)->update([
                    "CHAT_DETAIL_USER_STATUS_MENTION"           => 0,
                    "CHAT_DETAIL_USER_REPLY_DATE"               => now(),
                    "CHAT_DETAIL_USER_RELATE_CHAT_DETAIL_ID"    => $createMessage->CHAT_DETAIL_ID
                ]);
            }
        }

        // create message jika ada mention
        $dataParticipant = is_countable($request->PARTICIPANT);
        if ($dataParticipant) {
            for ($i = 0; $i < sizeof($request->PARTICIPANT); $i++) {
                $idChatParticipant = $request->PARTICIPANT[$i]['id'];
                // get data chat participant
                $chatParticipant = TChatParticipant::where('CHAT_PARTICIPANT_ID', $idChatParticipant)->first();
                // cek yang di mention division or user 
                if ($chatParticipant->IS_DIVISION == 1 || $chatParticipant->IS_DIVISION == "1") {
                    // get Employee by division id
                    $dataDivision = TEmployee::where('DIVISION_ID', $chatParticipant->DIVISION_ID)->get();
                    for ($a = 0; $a < sizeof($dataDivision); $a++) {
                        $idEmployee = $dataDivision[$a]['EMPLOYEE_ID'];
                        // get user id by employee
                        $dataUser = User::where('employee_id', $idEmployee)->first();

                        // created t_chat_detail_user
                        $createMessage = TChatDetailUser::create([
                            "CHAT_ID"                                   => $request->CHAT_ID,
                            "CHAT_DETAIL_ID"                            => $createMessage->CHAT_DETAIL_ID,
                            "CHAT_DETAIL_USER_TO"                       => $dataUser->id,
                            "CHAT_DETAIL_USER_FROM"                     => Auth::user()->id,
                            "CHAT_DETAIL_USER_STATUS_READ"              => 0,
                            "CHAT_DETAIL_USER_STATUS_MENTION"           => 1,
                            "CHAT_DETAIL_USER_REPLY_DATE"               => null,
                            "CHAT_DETAIL_USER_RELATE_CHAT_DETAIL_ID"    => null,
                            "CHAT_DETAIL_USER_CREATED_DATE"             => now(),
                            "CHAT_DETAIL_USER_CREATED_ID"               => Auth::user()->id,
                        ]);
                    }
                } else {
                    // for mention user
                    $idUser = $chatParticipant->USER_ID;
                    // created t_chat_detail_user
                    $createMessage = TChatDetailUser::create([
                        "CHAT_ID"                                   => $request->CHAT_ID,
                        "CHAT_DETAIL_ID"                            => $createMessage->CHAT_DETAIL_ID,
                        "CHAT_DETAIL_USER_TO"                       => $idUser,
                        "CHAT_DETAIL_USER_FROM"                     => Auth::user()->id,
                        "CHAT_DETAIL_USER_STATUS_READ"              => 0,
                        "CHAT_DETAIL_USER_STATUS_MENTION"           => 1,
                        "CHAT_DETAIL_USER_REPLY_DATE"               => null,
                        "CHAT_DETAIL_USER_RELATE_CHAT_DETAIL_ID"    => null,
                        "CHAT_DETAIL_USER_CREATED_DATE"             => now(),
                        "CHAT_DETAIL_USER_CREATED_ID"               => Auth::user()->id,
                    ]);
                }
            }
        }

        // create message jika di reply akan muncul seperti di mention
        // get created by from chat_detail_id by id chat detail id
        if ($request->CHAT_DETAIL_PARENT_ID !== null) {
            $getCreatedBy = TChatDetail::where('CHAT_DETAIL_ID', $request->CHAT_DETAIL_PARENT_ID)->first();
            $createdById = $getCreatedBy->CREATED_CHAT_DETAIL_BY;
            if ($createdById) {
                $createMessage = TChatDetailUser::create([
                    "CHAT_ID"                                   => $request->CHAT_ID,
                    "CHAT_DETAIL_ID"                            => $createMessage->CHAT_DETAIL_ID,
                    "CHAT_DETAIL_USER_TO"                       => $createdById,
                    "CHAT_DETAIL_USER_FROM"                     => Auth::user()->id,
                    "CHAT_DETAIL_USER_STATUS_READ"              => 0,
                    "CHAT_DETAIL_USER_STATUS_MENTION"           => 1,
                    "CHAT_DETAIL_USER_REPLY_DATE"               => null,
                    "CHAT_DETAIL_USER_RELATE_CHAT_DETAIL_ID"    => null,
                    "CHAT_DETAIL_USER_CREATED_DATE"             => now(),
                    "CHAT_DETAIL_USER_CREATED_ID"               => Auth::user()->id,
                ]);
            }
        }




        return new JsonResponse([
            $request->CHAT_ID,
            Auth::user()->id
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_participant()
    {
        $employee = DB::table('t_user')
            ->select('t_user.name as PARTICIPANT_NAME', 't_user.id as PARTICIPANT_ID')
            ->leftJoin('t_employee', 't_user.employee_id', '=', 't_employee.EMPLOYEE_ID')
            ->whereNotNull('t_user.employee_id');

        $division = DB::table('t_company_division')
            ->select('COMPANY_DIVISION_ALIAS AS PARTICIPANT_NAME', 'COMPANY_DIVISION_ID AS PARTICIPANT_ID');

        $combined = $employee->unionAll($division)->get();

        return response()->json($combined);
    }

    public function getParticipantAll()
    {
        $employee = DB::table('t_user')
            ->select('t_user.name as PARTICIPANT_NAME', 't_user.id as PARTICIPANT_ID')
            ->leftJoin('t_employee', 't_user.employee_id', '=', 't_employee.EMPLOYEE_ID')
            ->whereNotNull('t_user.employee_id');

        // $division = DB::table('t_company_division')
        //     ->select('COMPANY_DIVISION_ALIAS AS PARTICIPANT_NAME', 'COMPANY_DIVISION_ID AS PARTICIPANT_ID');

        $combined = $employee->get();

        return response()->json($combined);
    }

    public function getDataParticipantById(Request $request)
    {
        $dataParticipant = TChatParticipant::where('CHAT_ID', $request->chatId)->get();

        return response()->json($dataParticipant);
    }

    public function getTypeChatByTagId(Request $request)
    {
        $data = TChat::where('TAG_ID', $request->tagIdChat)->where('CHAT_STATUS', 0)->with('tUser')->with('pinChat')
            ->orderBy('t_pin_chat.PIN_CHAT', 'DESC')
            ->orderBy('t_chat.CREATED_CHAT_DATE', 'DESC')
            ->select('t_chat.*', 't_pin_chat.PIN_CHAT', DB::raw('f_get_active_chat(t_chat_detail.CREATED_CHAT_DETAIL_DATE) AS STATUS'))
            ->leftJoin('t_pin_chat', 't_chat.CHAT_ID', '=', 't_pin_chat.CHAT_ID')
            ->leftJoin('t_chat_detail', 't_chat.CHAT_ID', '=', 't_chat_detail.CHAT_ID')
            ->distinct()
            ->get();
        // $data = TChat::select('t_chat.*','t_pin_chat.PIN_CHAT','t_pin_chat.CREATED_PIN_CHAT_BY')->where('TAG_ID', $request->tagIdChat)->with('tUser')
        // ->leftJoin('t_pin_chat', 't_chat.CHAT_ID', '=', 't_pin_chat.CHAT_ID')
        // ->orderBy('t_pin_chat.PIN_CHAT', 'DESC')
        // ->distinct()
        // ->toSql();
        // dd($data);

        return response()->json($data);
    }

    public function getChatPin(Request $request)
    {
        $data = TPinChat::select('t_pin_chat.*', 't_chat.CHAT_TITLE', 't_chat.TAG_ID', 't_chat.CREATED_CHAT_DATE')->with('tUser')
            ->leftJoin('t_chat', 't_pin_chat.CHAT_ID', '=', 't_chat.CHAT_ID')
            ->where('t_pin_chat.PIN_CHAT', 1)
            ->where('t_chat.TAG_ID', $request->tagIdChat)
            ->where('t_pin_chat.CREATED_PIN_CHAT_BY', $request->idAuthUser)
            ->get();
        // $data = TPinChat::select('t_pin_chat.*')->where('TAG_ID', $request->tagIdChat)->with('tUser')
        // ->leftJoin('t_pin_chat', 't_chat.CHAT_ID', '=', 't_pin_chat.CHAT_ID')
        // ->orderBy('t_pin_chat.PIN_CHAT', 'DESC')
        // ->where('t_pin_chat.PIN_CHAT', 1)
        // ->get();
        // dd($data);

        return response()->json($data);
    }




    public function pinMessageObject(Request $request)
    {
        // save t_pin_chat
        $pinChat = TPinChat::create([
            "PIN_CHAT"                      => 1,
            "CHAT_ID"                       => $request->idChatDetail,
            "CREATED_PIN_CHAT_DATE"         => now(),
            "CREATED_PIN_CHAT_BY"           => Auth::user()->id,
        ]);

        if ($pinChat) {
            // save m_pin_chat_detail
            $pinChat = MPinChatDetail::create([
                "PIN_CHAT_DETAIL"        => $pinChat->PIN_CHAT_ID,
                "CHAT_ID"         => $request->idChatDetail,
            ]);
        }

        // get TAG_ID chat_id 
        $getTagID = TChat::where('CHAT_ID', $request->idChatDetail)->first();


        return new JsonResponse([
            "Pin Message Success",
            $getTagID->TAG_ID,
            Auth::user()->id
        ], 201, [
            'X-Inertia' => true
        ]);
    }


    public function unPinMessageObject(Request $request)
    {

        // get data pin chat by id chat and created by
        $dataPinChat = TPinChat::where('CHAT_ID', $request->idChatDetail)->where('CREATED_PIN_CHAT_BY', Auth::user()->id)->first();


        if ($dataPinChat) {
            // delete
            TPinChat::where('PIN_CHAT_ID', $dataPinChat->PIN_CHAT_ID)->delete();
        }

        // get TAG_ID chat_id 
        $getTagID = TChat::where('CHAT_ID', $request->idChatDetail)->first();


        return new JsonResponse([
            "Unpin Message Success",
            $getTagID->TAG_ID,
            Auth::user()->id
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function pin_message(Request $request)
    {
        // save t_pin_chat
        $pinChat = TPinChat::create([
            "PIN_CHAT"                      => 1,
            "CHAT_DETAIL_ID"                => $request->idChatDetail,
            "CREATED_PIN_CHAT_DATE"         => now(),
            "CREATED_PIN_CHAT_BY"           => Auth::user()->id,
        ]);

        if ($pinChat) {
            // save m_pin_chat_detail
            $pinChat = MPinChatDetail::create([
                "PIN_CHAT_DETAIL"        => $pinChat->PIN_CHAT_ID,
                "CHAT_DETAIL_ID"         => $request->idChatDetail,
            ]);
        }


        return new JsonResponse([
            "Pin Message Success",
            $request->typeChatId
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function add_participant(Request $request)
    {
        // dd($request);
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
                    'CHAT_ID'                       => $request->CHAT_ID,
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
        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Add Participant Chat (Plugin).",
                "module"      => "Plugin",
                "id"          => $addParticipant->CHAT_PARTICIPANT_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            "Participant Success Added",
            $request->CHAT_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function remove_participant(Request $request)
    {
        if ($request) {
            $deleteParticipant = TChatParticipant::where('CHAT_PARTICIPANT_ID', $request->idParticipant)->delete();

            if ($deleteParticipant) {
                // Created Log
                UserLog::create([
                    'created_by' => Auth::user()->id,
                    'action'     => json_encode([
                        "description" => "Remove Participant Chat (Plugin).",
                        "module"      => "Plugin",
                        "id"          => $request->CHAT_ID
                    ]),
                    'action_by'  => Auth::user()->user_login
                ]);
            }
            return new JsonResponse([
                "Participant Success Removed",
                $request->CHAT_ID
            ], 201, [
                'X-Inertia' => true
            ]);
        }
    }

    public function getDataChatDetailUser(Request $request)
    {
        $dataChatDetailUser = TChatDetailUser::where('CHAT_DETAIL_USER_TO', $request->idAuthUser)->whereNull('CHAT_DETAIL_USER_REPLY_DATE')
            ->with('tChatDetail')
            ->leftJoin('t_chat', 't_chat.CHAT_ID', '=', 't_chat_detail_user.CHAT_ID')
            // ->with('tChat')
            // ->with('tChatDetail')
            // ->with('userFormTo')
            ->get()
            ->groupBy('CHAT_TITLE');

        return response()->json($dataChatDetailUser);
    }

    public function getDataChatDetailMention(Request $request)
    {
        $dataChatDetailUser = TChatDetailUser::where('CHAT_DETAIL_USER_FROM', $request->idAuthUser)
            ->with('tChatDetail')
            ->leftJoin('t_chat', 't_chat.CHAT_ID', '=', 't_chat_detail_user.CHAT_ID')
            // ->with('tChat')
            // ->with('tChatDetail')
            // ->with('userFormTo')
            ->get()
            ->groupBy('CHAT_TITLE');

        return response()->json($dataChatDetailUser);
    }

    public function actionUpdateReadMention(Request $request)
    {
        // update T_Chat_detail_user
        // get data TChatDetailUser
        $dataChatDetailUser = TChatDetailUser::where('CHAT_ID', $request->itemsChatId)->where('CHAT_DETAIL_USER_TO', $request->userId)->get();
        for ($i = 0; $i < sizeof($dataChatDetailUser); $i++) {
            if ($dataChatDetailUser[$i]['CHAT_DETAIL_USER_STATUS_READ'] == "0" || $dataChatDetailUser[$i]['CHAT_DETAIL_USER_STATUS_READ'] == 0) {
                $updateTChatDetailUser = TChatDetailUser::where('CHAT_ID', $request->itemsChatId)->where('CHAT_DETAIL_USER_TO', $request->userId)->update([
                    'CHAT_DETAIL_USER_STATUS_READ'          => '1',
                    'CHAT_DETAIL_USER_READ_DATE'            => now()
                ]);
            }
        }
    }

    public function get_plugin_chat(Request $request)
    {
        $data = RPluginProcess::get();

        return response()->json($data);
    }

    public function get_object_chat(Request $request)
    {
        $data = TChat::where('CHAT_STATUS', 0)->with('tUser')->with('pinChat')
            ->orderBy('t_pin_chat.PIN_CHAT', 'DESC')
            ->orderBy('t_chat.CREATED_CHAT_DATE', 'DESC')
            ->select('t_chat.*', 't_pin_chat.PIN_CHAT', DB::raw('f_get_active_chat(t_chat_detail.CREATED_CHAT_DETAIL_DATE) AS STATUS'))
            ->leftJoin('t_pin_chat', 't_chat.CHAT_ID', '=', 't_pin_chat.CHAT_ID')
            ->leftJoin('t_chat_detail', 't_chat.CHAT_ID', '=', 't_chat_detail.CHAT_ID')
            ->distinct()
            ->get();
        // $data = TChat::select('t_chat.*','t_pin_chat.PIN_CHAT','t_pin_chat.CREATED_PIN_CHAT_BY')->where('TAG_ID', $request->tagIdChat)->with('tUser')
        // ->leftJoin('t_pin_chat', 't_chat.CHAT_ID', '=', 't_pin_chat.CHAT_ID')
        // ->orderBy('t_pin_chat.PIN_CHAT', 'DESC')
        // ->distinct()
        // ->toSql();
        // dd($data);

        return response()->json($data);
    }
}
