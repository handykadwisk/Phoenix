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
        Schema::create('m_employee_attendance', function (Blueprint $table) {
            $table->increments('M_EMPLOYEE_ATTENDANCE_ID')->primary();
            $table->integer('ATTENDANCE_TYPE')->comment('0: fixed work schedule, 1: shift work schedule')->nullable();
            $table->integer('ATTENDANCE_SETTING_ID')->comment('for not selecting attendance type anymore')->nullable();
            $table->integer('EMPLOYEE_ID')->nullable();
            $table->string('M_EMPLOYEE_ATTENDANCE_NOTE', 255)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_employee_attendance');
    }
};
