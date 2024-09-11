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
        Schema::create('t_attendance_setting', function (Blueprint $table) {
            $table->increments('ATTENDANCE_SETTING_ID')->primary();
            $table->unsignedBigInteger('COMPANY_ID')->nullable();
            $table->string('ATTENDANCE_NAME', 255)->nullable();
            $table->date('ATTENDANCE_EFFECTIVE_FROM')->nullable();
            $table->date('ATTENDANCE_EFFECTIVE_LAST')->nullable();
            $table->integer('ATTENDANCE_TYPE')->comment('0: fixed work schedule, 1: shift work schedule')->nullable();
            $table->string('ATTENDANCE_WORKING_HOURS', 255)->nullable();
            $table->string('ATTENDANCE_CHECK_IN_TIME', 255)->nullable();
            $table->string('ATTENDANCE_CHECK_OUT_TIME', 255)->nullable();
            $table->string('ATTENDANCE_BREAK_HOURS', 255)->nullable();
            $table->string('ATTENDANCE_BREAK_START_TIME', 255)->nullable();
            $table->string('ATTENDANCE_BREAK_END_TIME', 255)->nullable();
            $table->integer('ATTENDANCE_LATE_COMPENSATION')->comment('LATE CheckIn in minutes')->nullable();
            $table->integer('ATTENDANCE_EARLY_COMPENSATION')->comment('Early CheckOutIn minutes')->nullable();
            $table->integer('ATTENDANCE_MARKING')->comment('1: Strict Mode. 2: Lenient Mode')->nullable();
            $table->decimal('ATTENDANCE_DISTANCE_THRESHOLD', 20, 17)->nullable();
            $table->decimal('ATTENDANCE_LATITUDE_OFFICE', 20, 17)->nullable();
            $table->decimal('ATTENDANCE_LONGITUDE_OFFICE', 20, 17)->nullable();
            $table->decimal('ATTENDANCE_LOCATION_MIN_LATITUDE', 20, 17)->nullable();
            $table->decimal('ATTENDANCE_LOCATION_MIN_LONGITUDE', 20, 17)->nullable();
            $table->decimal('ATTENDANCE_LOCATION_MAX_LATITUDE', 20, 17)->nullable();
            $table->decimal('ATTENDANCE_LOCATION_MAX_LONGITUDE', 20, 17)->nullable();
            $table->dateTime('ATTENDANCE_CREATED_DATE')->nullable();
            $table->dateTime('ATTENDANCE_CREATED_BY')->nullable();
            $table->integer('ATTENDANCE_STATUS')->comment('0: ACTIVE, 1: INACTIVE')->nullable();

            // $table->foreign('ORGANIZATION_ID')->references('ORGANIZATION_ID')->on('t_company_office')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_attendance_setting');
    }
};
