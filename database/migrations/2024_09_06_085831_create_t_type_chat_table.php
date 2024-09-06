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
        Schema::create('t_type_chat', function (Blueprint $table) {
            $table->bigIncrements('TYPE_CHAT_ID')->unique()->primary();
            $table->string('TYPE_CHAT_TITLE', 255)->nullable();
            $table->string('TYPE_CHAT_OBJECT', 255)->nullable();
            $table->dateTime('CREATED_TYPE_CHAT_DATE')->nullable();
            $table->bigInteger('CREATED_TYPE_CHAT_BY')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_type_chat');
    }
};
