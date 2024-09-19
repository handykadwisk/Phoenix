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
        Schema::create('t_chat_detail', function (Blueprint $table) {
            $table->bigIncrements('CHAT_DETAIL_ID')->unique()->primary();
            $table->bigInteger('CHAT_ID')->nullable();
            $table->text('CHAT_DETAIL_TEXT')->nullable();
            $table->bigInteger('CHAT_DETAIL_DOCUMENT_ID')->nullable();
            $table->dateTime('CREATED_CHAT_DETAIL_DATE')->nullable();
            $table->bigInteger('CREATED_CHAT_DETAIL_BY')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_chat_detail');
    }
};
