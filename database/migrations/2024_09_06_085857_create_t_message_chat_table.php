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
        Schema::create('t_message_chat', function (Blueprint $table) {
            $table->bigIncrements('MESSAGE_CHAT_ID')->unique()->primary();
            $table->bigInteger('TYPE_CHAT_ID')->nullable();
            $table->bigInteger('USER_ID')->nullable();
            $table->text('MESSAGE_CHAT_TEXT')->nullable();
            $table->bigInteger('MESSAGE_CHAT_DOCUMENT_ID')->nullable();
            $table->dateTime('CREATED_MESSAGE_CHAT_DATE')->nullable();
            $table->bigInteger('CREATED_MESSAGE_CHAT_BY')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_message_chat');
    }
};
