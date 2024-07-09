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
        Schema::create('t_report_cash_advance', function (Blueprint $table) {
            $table->increments('REPORT_CASH_ADVANCE_ID')->primary();
            $table->foreignId('EXPENSES_ID')->nullable();
            $table->smallInteger('USED_BY')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_REQUESTED_BY')->nullable();
            $table->dateTime('REPORT_CASH_ADVANCE_REQUESTED_DATE')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_UPDATED_BY')->nullable();
            $table->dateTime('REPORT_CASH_ADVANCE_UPDATED_DATE')->nullable();
            $table->smallInteger('FIRST_APPROVAL_BY')->nullable();
            $table->string('FIRST_APPROVAL_USER')->nullable();
            $table->dateTime('FIRST_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('FIRST_APPROVAL_STATUS')->nullable();
            $table->text('FIRST_APPROVAL_NOTE')->nullable();
            $table->smallInteger('SECOND_APPROVAL_BY')->nullable();
            $table->string('SECOND_APPROVAL_USER')->nullable();
            $table->dateTime('SECOND_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('SECOND_APPROVAL_STATUS')->nullable();
            $table->text('SECOND_APPROVAL_NOTE')->nullable();
            $table->text('REPORT_CASH_ADVANCE_REQUEST_NOTE')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_REFUND_TYPE')->nullable();
            $table->string('REPORT_CASH_ADVANCE_REFUND_PROOF')->nullable();
            $table->smallInteger('FA_APPROVAL_BY')->nullable();
            $table->string('FA_APPROVAL_USER')->nullable();
            $table->dateTime('FA_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('FA_APPROVAL_STATUS')->nullable();
            $table->text('FA_APPROVAL_NOTE')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_report_cash_advance');
    }
};