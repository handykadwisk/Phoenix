<?php

namespace App\Http\Controllers;

use App\Models\MReminderMethodNotification;
use App\Models\MReminderParticipant;
use App\Models\RMethodNotification;
use App\Models\RReminderTier;
use App\Models\TReminder;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TReminderController extends Controller
{
    public function getReminderTier(Request $request)
    {
        $data = RReminderTier::get();
        return response()->json($data);
    }

    // get data method notification
    public function getMethodNotification(Request $request)
    {
        $data = RMethodNotification::get();
        return response()->json($data);
    }

    // proses add reminder
    public function store(Request $request)
    {

        // Create Reminder To Database t_reminder
        $createReminder = TReminder::create([
            "REMINDER_TITLE"                        => $request->REMINDER_TITLE,
            "REMINDER_TIMES"                        => $request->REMINDER_TIMES,
            "REMINDER_DAYS"                         => $request->REMINDER_DAYS,
            "REMINDER_START_DATE"                   => $request->REMINDER_START_DATE,
            "REMINDER_DESKRIPSI"                    => $request->REMINDER_DESKRIPSI,
            "REMINDER_CREATED_BY"                   => Auth::user()->id,
            "REMINDER_CREATED_DATE"                 => now()
        ]);

        // for mapping participant
        if ($createReminder) {
            if (is_countable($request->PARTICIPANT)) {
                for ($i = 0; $i < sizeof($request->PARTICIPANT); $i++) {
                    $nameTier = $request->PARTICIPANT[$i]['TIER'];
                    $nameParticipant = $request->PARTICIPANT[$i]['PARTICIPANT_ID'];
                    for ($a = 0; $a < sizeof($nameParticipant); $a++) {
                        $value = $nameParticipant[$a]['value'];
                        // User_id Participant
                        $symbol = '+';
                        $posisi = strpos($value, $symbol);
                        $userId = substr($value, $posisi + 1);

                        // get Id Tier
                        $idTier = RReminderTier::where('REMINDER_TIER_NAME', $nameTier)->first();
                        // create mapping participant
                        $createTierParticipant = MReminderParticipant::create([
                            "REMINDER_ID"               => $createReminder->REMINDER_ID,
                            "REMINDER_TIER_ID"          => $idTier->REMINDER_TIER_ID,
                            "USER_ID"                   => $userId
                        ]);
                    }
                }
            }
        }

        // for mapping method notification
        if ($createReminder) {
            if (is_countable($request->NOTIFICATION)) {
                for ($i = 0; $i < sizeof($request->NOTIFICATION); $i++) {
                    $notificationId = $request->NOTIFICATION[$i]['NOTIFICATION_ID'];
                    // create mapping method notification
                    $createMappingNotification = MReminderMethodNotification::create([
                        "REMINDER_ID"                   => $createReminder->REMINDER_ID,
                        "METHOD_NOTIFICATION_ID"        => $notificationId,
                    ]);
                }
            }
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Create Reminder (Reminder)",
                "module"      => "Reminder",
                "id"          => $createReminder->REMINDER_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            "Reminder Success Created",
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_reminder(Request $request)
    {
        $data = TReminder::get();
        return response()->json($data);
    }

    public function get_detail_reminder(Request $request)
    {
        $data = TReminder::with('mReminderParticipant')->where('REMINDER_ID', $request->idReminder)->first();
        return response()->json($data);
    }
}
