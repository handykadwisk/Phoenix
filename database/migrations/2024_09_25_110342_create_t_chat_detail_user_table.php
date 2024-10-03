<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('t_chat_detail_user', function (Blueprint $table) {
            $table->bigIncrements('CHAT_DETAIL_USER_ID')->primary()->unique();
            $table->bigInteger('CHAT_ID')->nullable();
            $table->bigInteger('CHAT_DETAIL_ID')->nullable();
            $table->bigInteger('CHAT_DETAIL_USER_TO')->nullable();
            $table->bigInteger('CHAT_DETAIL_USER_FROM')->nullable();
            $table->bigInteger('CHAT_DETAIL_USER_STATUS_READ')->nullable()->comment('0 = unread, 1 = read');
            $table->dateTime('CHAT_DETAIL_USER_READ_DATE')->nullable();
            $table->bigInteger('CHAT_DETAIL_USER_STATUS_MENTION')->nullable()->comment('0 = tidak di mention, 1 = mention');
            $table->dateTime('CHAT_DETAIL_USER_REPLY_DATE')->nullable();
            $table->bigInteger('CHAT_DETAIL_USER_RELATE_CHAT_DETAIL_ID');
            $table->dateTime('CHAT_DETAIL_USER_CREATED_DATE')->nullable();
            $table->bigInteger('CHAT_DETAIL_USER_CREATED_ID')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_chat_detail_user');
    }
};
