<?php

namespace App\Http\Controllers;

use App\Models\MPinChatDetail;
use App\Models\TChat;
use App\Models\TChatDetail;
use App\Models\TPinChat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class TDetailChatController extends Controller
{
    public function getMessage(Request $request){
        // $data = TChatDetail::select(DB::raw('DATE(CREATED_MESSAGE_CHAT_DATE) as date'), DB::raw('count(*) as total'))->groupBy('date')->with('tUser')->get();
        // return response()->json($data);
        $data = TChatDetail::with('tUser')
        ->where('CHAT_ID', $request->typeChatId)
        ->get()
        ->groupBy(function($date) {
            return Carbon::parse($date->CREATED_CHAT_DETAIL_DATE)->format('Y-m-d');
        });
        return response()->json($data);
    }

    public function store(Request $request){
        // dd($request);
        $createMessage = TChatDetail::create([
            "CHAT_ID"                      => $request->CHAT_ID,
            "CHAT_DETAIL_TEXT"             => $request->INITIATE_YOUR_CHAT,
            "CHAT_DETAIL_DOCUMENT_ID"      => null,
            "CREATED_CHAT_DETAIL_DATE"     => now(),
            "CREATED_CHAT_DETAIL_BY"       => Auth::user()->id,
        ]);

        return new JsonResponse([
            $request->CHAT_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getTypeChatByTagId(Request $request){
        $data = TChat::where('TAG_ID', $request->tagIdChat)->with('tUser')->get();
        return response()->json($data);
    }


    public function pin_message(Request $request) {
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
}
