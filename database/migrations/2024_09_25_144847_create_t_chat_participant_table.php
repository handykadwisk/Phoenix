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
        Schema::create('t_chat_participant', function (Blueprint $table) {
            $table->bigIncrements('CHAT_PARTICIPANT_ID')->unique()->primary();
            $table->bigInteger('CHAT_ID')->nullable();
            $table->string('CHAT_PARTICIPANT_NAME', 255)->nullable();
            $table->bigInteger('USER_ID')->nullable();
            $table->bigInteger('DIVISION_ID')->nullable();
            $table->smallInteger('IS_DIVISION')->nullable()->comment('0 = No, 1 = Yes');
            $table->bigInteger('CHAT_PARTICIPANT_CREATED_BY')->nullable();
            $table->dateTime('CHAT_PARTICIPANT_CREATED_DATE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_chat_participant');
    }
};
