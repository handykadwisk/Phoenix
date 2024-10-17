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
        Schema::create('t_request_time_off', function (Blueprint $table) {
            $table->increments('REQUEST_TIME_OFF_ID')->primary();
            $table->integer('EMPLOYEE_ID')->nullable();
            $table->integer('IS_REDUCE_LEAVE')->comment('0:No, 1:Yes')->nullable();
            $table->integer('TIME_OFF_TYPE_ID')->nullable();
            $table->date('DATE_OF_LEAVE')->nullable();
            $table->integer('SUBSTITUTE_PIC')->comment('EMPLOYEE_ID')->nullable();
            $table->integer('SECOND_SUBSTITUTE_PIC')->comment('EMPLOYEE_ID')->nullable();
            $table->integer('FILE_ID')->comment('object_file_id')->nullable();
            $table->string('DESCRIPTION', 255)->comment('DESC REQUEST')->nullable();
            $table->dateTime('REQUEST_DATE')->nullable();
            $table->integer('REQUEST_TO')->nullable();
            $table->dateTime('APPROVED_DATE')->nullable();
            $table->integer('APPROVED_BY')->nullable();
            $table->integer('STATUS')->comment('0: REQUEST, 1:REJECT, 2:APPROVE')->nullable();
            $table->string('NOTE', 255)->comment('NOTE BY APPROVER')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_request_time_off');
    }
};
