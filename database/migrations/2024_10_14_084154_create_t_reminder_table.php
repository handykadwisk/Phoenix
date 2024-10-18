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
        Schema::create('t_reminder', function (Blueprint $table) {
            $table->bigIncrements('REMINDER_ID')->unique()->primary();
            $table->string('REMINDER_TITLE', 255)->nullable();
            $table->string('REMINDER_TIMES', 20)->nullable();
            $table->string('REMINDER_DAYS', 20)->nullable();
            $table->dateTime('REMINDER_START_DATE')->nullable();
            $table->smallInteger("REMINDER_STATUS")->nullable()->comment('0 = Active, 1 = Inactive')->default(0);
            $table->text('REMINDER_DESKRIPSI')->nullable();
            $table->bigInteger('REMINDER_CREATED_BY')->nullable();
            $table->dateTime('REMINDER_CREATED_DATE')->nullable();
            $table->bigInteger('REMINDER_UPDATED_BY')->nullable();
            $table->dateTime('REMINDER_UPDATED_DATE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_reminder');
    }
};
