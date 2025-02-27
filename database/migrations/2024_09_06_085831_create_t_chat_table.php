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
        Schema::create('t_chat', function (Blueprint $table) {
            $table->bigIncrements('CHAT_ID')->unique()->primary();
            $table->string('CHAT_TITLE', 255)->nullable();
            $table->string('CHAT_OBJECT', 255)->nullable();
            $table->smallInteger('CHAT_STATUS')->nullable()->comment('0 = Active, 1 = InActive')->default(0);
            $table->string('TAG_ID', 255)->nullable();
            $table->dateTime('CREATED_CHAT_DATE')->nullable();
            $table->bigInteger('CREATED_CHAT_BY')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_chat');
    }
};
