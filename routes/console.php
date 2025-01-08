<?php

use App\Events\GotMessage;
use App\Events\ReminderMessage;
use App\Mail\SendEmail;
use App\Models\MReminderMethodNotification;
use App\Models\TDetailReminder;
use App\Models\TReminder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schedule;

// Jalankan Send Email For Reminder
Schedule::call(function () {
    // get tanggal dan dan waktu sekarang
    $dateNow  = date('Y-m-d');
    $hoursNow = date('H:i');

    $dataReminderData = DB::table('t_reminder_data')->where('REMINDER_DATA_DATE', $dateNow)->where('REMINDER_DATA_HOUR', $hoursNow)->get();
    // dd($dataReminderData);
    if ($dataReminderData->count() > 0) {

        foreach ($dataReminderData as $value) {
            $userId         = $value->USER_ID;
            $reminderTierId = $value->REMINDER_TIER_ID;
            $reminderId     = $value->REMINDER_ID;

            // get t_reminder
            $dataReminder = TReminder::where('REMINDER_ID', $reminderId)->first();
            // create detail reminder
            $createDetailReminder = TDetailReminder::create([
                "REMINDER_DATA_ID"                  => $value->REMINDER_DATA_ID,
                "REMINDER_DETAIL_USER_FROM"         => $dataReminder->REMINDER_CREATED_BY,
                "REMINDER_DETAIL_USER_TO"           => $userId,
                "REMINDER_DETAIL_USER_STATUS_READ"  => 0,
            ]);
            // for 
            event(new ReminderMessage($createDetailReminder));


            // send email reminder jika memilih metode pengiriman lewat email
            $getNotifReminder = MReminderMethodNotification::where('REMINDER_ID', $reminderId)->where('METHOD_NOTIFICATION_ID', 2)->first();
            if ($getNotifReminder != null) {
                // get data user untuk dapetin emailnya
                $dataUser = DB::table('t_user')->where('id', $userId)
                    ->leftJoin('t_employee', 't_employee.EMPLOYEE_ID', '=', 't_user.employee_id')
                    ->first();
                $emailUser = $dataUser->EMPLOYEE_EMAIL;
                $data = [
                    'subject'   => 'Reminder Email',
                    'view'  => "viewEmail.viewEmail"
                ];

                Mail::to($emailUser)->send(new SendEmail($data));
            }
        }
    } else {
        echo "gaada";
    }



    // Mail::to("har.subhan@gmail.com")->send(new ReminderMail());
})->everyMinute();
