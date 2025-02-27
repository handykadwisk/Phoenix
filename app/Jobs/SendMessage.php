<?php

namespace App\Jobs;

use App\Events\GotMessage;
use App\Models\TChatDetail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public TChatDetail $message)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        GotMessage::dispatch([
            'CHAT_ID'                   => $this->message->CHAT_ID,
            'CHAT_DETAIL_ID'            => $this->message->CHAT_DETAIL_ID,
            'CREATED_CHAT_DETAIL_BY'    => $this->message->CREATED_CHAT_DETAIL_BY,
            'CHAT_DETAIL_TEXT'          => $this->message->CHAT_DETAIL_TEXT,
            'CREATED_CHAT_DETAIL_DATE'  => $this->message->CREATED_CHAT_DETAIL_DATE,
        ]);
    }
}
