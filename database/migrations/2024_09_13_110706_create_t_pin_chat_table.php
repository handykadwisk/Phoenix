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
        Schema::create('t_pin_chat', function (Blueprint $table) {
            $table->bigIncrements('PIN_CHAT_ID')->unique()->primary();
            $table->smallInteger('PIN_CHAT')->nullable()->comment("1 = Pin, 0 = Unpin")->default(0);
            $table->bigInteger('CREATED_PIN_CHAT_BY')->nullable();
            $table->dateTime('CREATED_PIN_CHAT_DATE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_pin_chat');
    }
};
