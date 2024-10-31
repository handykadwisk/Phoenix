<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('channel-name', function ($user) {
    // echo $user;
    return true;
});

Broadcast::channel('typingChat', function ($user) {
    return true; // Sesuaikan logika autorisasi
});
