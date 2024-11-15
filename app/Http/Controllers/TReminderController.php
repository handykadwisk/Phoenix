<?php

namespace App\Http\Controllers;

use App\Models\MReminderMethodNotification;
use App\Models\MReminderParticipant;
use App\Models\RMethodNotification;
use App\Models\RReminderTier;
use App\Models\TDetailReminder;
use App\Models\TReminder;
use App\Models\TReminderData;
use App\Models\UserLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

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
        // get data r setting untuk ambil waktu reminder start dan reminder endnya
        $reminderStart = DB::table('r_setting')->where('SETTING_VARIABLE', "reminder_start")->first();
        $reminderEnd = DB::table('r_setting')->where('SETTING_VARIABLE', "reminder_end")->first();
        // Waktu mulai
        $startTime = Carbon::createFromFormat('H:i', $reminderStart->SETTING_VALUE);

        // Waktu selesai
        $endTime = Carbon::createFromFormat('H:i', $reminderEnd->SETTING_VALUE);

        // Hitung selisih waktu dalam jam
        $diffInHours = $startTime->diffInHours($endTime);

        // get tanggal dari beberapa hari
        $dates = collect();
        $dateFromData = $request->REMINDER_START_DATE;
        for ($i = 0; $i <= $request->REMINDER_DAYS; $i++) {
            $dates->push(Carbon::parse($dateFromData)->addDays($i)->toDateString());
        }
        $dates->pop();

        // Tentukan waktu mulai dan durasi
        $start = Carbon::parse($reminderStart->SETTING_VALUE); // jam mulai dari r setting variable = reminder_start
        $totalHours = $diffInHours; // hasil dari perhitungan reminderStar dan reminderEnd
        $intervalCount = $request->REMINDER_TIMES;
        $intervalDuration = $totalHours / $intervalCount; // 4 jam per interval

        // Collection untuk menyimpan hasil interval
        $intervals = collect();

        // Loop untuk menambahkan waktu mulai tiap interval
        for ($i = 0; $i < $intervalCount; $i++) {
            $intervals->push($start->copy()->addHours($i * $intervalDuration)->format('H:i'));
        }


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


        // created reminder data
        // 1. Get Data Participant By Reminder ID
        $dataReminderParticipant = MReminderParticipant::where('REMINDER_ID', $createReminder->REMINDER_ID)->get();
        for ($i = 0; $i < sizeof($dataReminderParticipant); $i++) {
            for ($a = 0; $a < sizeof($dates); $a++) {
                for ($c = 0; $c < sizeof($intervals); $c++) {
                    $reminderData = TReminderData::create([
                        "REMINDER_DATA_DATE"            => $dates[$a],
                        "REMINDER_ID"                   => $dataReminderParticipant[$i]['REMINDER_ID'],
                        "USER_ID"                       => $dataReminderParticipant[$i]['USER_ID'],
                        "REMINDER_TIER_ID"              => $dataReminderParticipant[$i]['REMINDER_TIER_ID'],
                        "REMINDER_DATA_STATUS"          => 1
                    ]);

                    // update TReminderData
                    TReminderData::where('REMINDER_DATA_ID', $reminderData['REMINDER_DATA_ID'])->update([
                        "REMINDER_DATA_HOUR"        => $intervals[$c]
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
            Auth::user()->id
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_reminder(Request $request)
    {
        $data = TReminder::where('REMINDER_CREATED_BY', $request->idUser)->get();
        return response()->json($data);
    }

    public function get_detail_reminder(Request $request)
    {
        $data = TReminder::with('mReminderParticipant')->with('mMethodReminder')->where('REMINDER_ID', $request->idReminder)->first();
        return response()->json($data);
    }

    public function edit(Request $request)
    {
        // dd($request);
        // update TReminder 
        $updateReminder = TReminder::where('REMINDER_ID', $request->REMINDER_ID)
            ->update([
                "REMINDER_TITLE"        => $request->REMINDER_TITLE,
                "REMINDER_TIMES"        => $request->REMINDER_TIMES,
                "REMINDER_DAYS"         => $request->REMINDER_DAYS,
                "REMINDER_START_DATE"   => $request->REMINDER_START_DATE,
                "REMINDER_DESKRIPSI"    => $request->REMINDER_DESKRIPSI,
                "REMINDER_UPDATED_BY"   => Auth::user()->id,
                "REMINDER_UPDATED_DATE" => now()
            ]);


        // cek existing mapping participant
        $existingMappingParticipant = MReminderParticipant::where('REMINDER_ID', $request->REMINDER_ID)->get();
        if ($existingMappingParticipant->count() > 0) {
            MReminderParticipant::where('REMINDER_ID', $request->REMINDER_ID)->delete();
        }
        // create Reminder Participant
        if (is_countable($request->PARTICIPANT)) {
            for ($i = 0; $i < sizeof($request->PARTICIPANT); $i++) {
                $userId = $request->PARTICIPANT[$i]['USER_ID'];
                $tierId = $request->PARTICIPANT[$i]['REMINDER_TIER_ID'];

                if ($userId !== null) {
                    $createTierParticipant = MReminderParticipant::create([
                        "REMINDER_ID"               => $request->REMINDER_ID,
                        "REMINDER_TIER_ID"          => $tierId,
                        "USER_ID"                   => $userId
                    ]);
                }
            }
        }

        // cek existing mapping participant
        $existingMethodNotification = MReminderMethodNotification::where('REMINDER_ID', $request->REMINDER_ID)->get();
        if ($existingMethodNotification->count() > 0) {
            MReminderMethodNotification::where('REMINDER_ID', $request->REMINDER_ID)->delete();
        }
        if (is_countable($request->NOTIFICATION)) {
            for ($i = 0; $i < sizeof($request->NOTIFICATION); $i++) {
                $notificationId = $request->NOTIFICATION[$i]['METHOD_NOTIFICATION_ID'];
                // create mapping method notification
                $createMappingNotification = MReminderMethodNotification::create([
                    "REMINDER_ID"                   => $request->REMINDER_ID,
                    "METHOD_NOTIFICATION_ID"        => $notificationId,
                ]);
            }
        }

        // Created Log
        UserLog::create([
            'created_by' => Auth::user()->id,
            'action'     => json_encode([
                "description" => "Update Reminder (Reminder)",
                "module"      => "Reminder",
                "id"          => $request->REMINDER_ID
            ]),
            'action_by'  => Auth::user()->user_login
        ]);

        return new JsonResponse([
            "Reminder Success Edited",
            $request->REMINDER_ID,
            Auth::user()->id
        ], 201, [
            'X-Inertia' => true
        ]);
    }

    public function get_reminder_start(Request $request)
    {
        $data = DB::table('r_setting')->where('SETTING_VARIABLE', "reminder_start")->first();


        return response()->json($data);
    }

    public function get_reminder_end(Request $request)
    {
        $data = DB::table('r_setting')->where('SETTING_VARIABLE', "reminder_end")->first();


        return response()->json($data);
    }

    public function get_detail_reminder_new(Request $request)
    {
        $data = TDetailReminder::where('DETAIL_REMINDER_USER_TO', $request->userIdLogin)->where('DETAIL_REMINDER_USER_STATUS_READ', 0)->get();

        return response()->json($data);
    }
}
