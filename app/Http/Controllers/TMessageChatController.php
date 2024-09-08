<?php

namespace App\Http\Controllers;

use App\Models\TMessageChat;
use App\Models\TTypeChat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class TMessageChatController extends Controller
{
    public function getMessage(Request $request){
        // $data = TMessageChat::select(DB::raw('DATE(CREATED_MESSAGE_CHAT_DATE) as date'), DB::raw('count(*) as total'))->groupBy('date')->with('tUser')->get();
        // return response()->json($data);
        $data = TMessageChat::with('tUser')
        ->where('TYPE_CHAT_ID', $request->typeChatId)
        ->get()
        ->groupBy(function($date) {
            return Carbon::parse($date->CREATED_MESSAGE_CHAT_DATE)->format('Y-m-d');
        });
        return response()->json($data);
    }

    public function store(Request $request){
        // dd($request);
        $createMessage = TMessageChat::create([
            "TYPE_CHAT_ID"                  => $request->TYPE_CHAT_ID,
            "USER_ID"                       => Auth::user()->id,
            "MESSAGE_CHAT_TEXT"             => $request->INITIATE_YOUR_CHAT,
            "MESSAGE_CHAT_DOCUMENT_ID"      => null,
            "CREATED_MESSAGE_CHAT_DATE"     => now(),
            "CREATED_MESSAGE_CHAT_BY"       => Auth::user()->id,
        ]);

        return new JsonResponse([
            $request->TYPE_CHAT_ID
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function getTypeChatByTagId(Request $request){
        $data = TTypeChat::where('TAG_ID', $request->tagIdChat)->get();
        return response()->json($data);
    }
}
