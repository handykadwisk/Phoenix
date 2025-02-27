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
        Schema::create('t_employee_attendance', function (Blueprint $table) {
            $table->increments('EMPLOYEE_ATTENDANCE_ID')->primary();
            $table->integer('ATTENDANCE_SETTING_ID')->nullable();
            $table->integer('EMPLOYEE_ID')->nullable();
            $table->date('EMPLOYEE_ATTENDANCE_CHECK_IN_DATE')->nullable();
            $table->string('EMPLOYEE_ATTENDANCE_CHECK_IN_TIME', 255)->nullable();
            $table->date('EMPLOYEE_ATTENDANCE_CHECK_OUT_DATE')->nullable();
            $table->string('EMPLOYEE_ATTENDANCE_CHECK_OUT_TIME', 255)->nullable();
            $table->decimal('EMPLOYEE_ATTENDANCE_LOCATION_LATITUDE', 20, 17)->nullable();
            $table->decimal('EMPLOYEE_ATTENDANCE_LOCATION_LONGITUDE', 20, 17)->nullable();
            $table->integer('EMPLOYEE_ATTENDANCE_LOCATION_TYPE')->comment('0: On Site, 1: Off Site')->nullable();
            $table->text('EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_IN')->nullable();
            $table->text('EMPLOYEE_ATTENDANCE_MESSAGE_CHECK_OUT')->nullable();
            $table->text('EMPLOYEE_ATTENDANCE_LOCATION_SYSTEM_MESSAGE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_employee_attendance');
    }
};
