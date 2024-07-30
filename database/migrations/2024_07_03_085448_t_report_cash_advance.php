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
            $table->smallInteger('CASH_ADVANCE_ID')->nullable();
            $table->string('REPORT_CASH_ADVANCE_NUMBER')->nullable();
            $table->string('REPORT_CASH_ADVANCE_DIVISION')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_USED_BY')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_REQUESTED_BY')->nullable();
            $table->dateTime('REPORT_CASH_ADVANCE_REQUESTED_DATE')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_FIRST_APPROVAL_BY')->nullable();
            $table->string('REPORT_CASH_ADVANCE_FIRST_APPROVAL_USER')->nullable();
            $table->dateTime('REPORT_CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_FIRST_APPROVAL_STATUS')->nullable();
            $table->text('REPORT_CASH_ADVANCE_FIRST_APPROVAL_NOTE')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_SECOND_APPROVAL_BY')->nullable();
            $table->string('REPORT_CASH_ADVANCE_SECOND_APPROVAL_USER')->nullable();
            $table->dateTime('REPORT_CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_SECOND_APPROVAL_STATUS')->nullable();
            $table->text('REPORT_CASH_ADVANCE_SECOND_APPROVAL_NOTE')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_THIRD_APPROVAL_BY')->nullable();
            $table->string('REPORT_CASH_ADVANCE_THIRD_APPROVAL_USER')->nullable();
            $table->dateTime('REPORT_CASH_ADVANCE_THIRD_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_THIRD_APPROVAL_STATUS')->nullable();
            $table->text('REPORT_CASH_ADVANCE_THIRD_APPROVAL_NOTE')->nullable();
            $table->text('REPORT_CASH_ADVANCE_REQUEST_NOTE')->nullable();
            $table->decimal('REPORT_CASH_ADVANCE_REFUND_AMOUNT', 16, 2)->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_REFUND_TYPE')->nullable();
            $table->string('REPORT_CASH_ADVANCE_REFUND_PROOF')->nullable();
            $table->decimal('REPORT_CASH_ADVANCE_TOTAL_AMOUNT', 16, 2)->nullable();
            $table->decimal('REPORT_CASH_ADVANCE_TOTAL_AMOUNT_APPROVE', 16, 2)->nullable();
            $table->decimal('REPORT_CASH_ADVANCE_TOTAL_AMOUNT_DIFFERENT', 16, 2)->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_CREATED_BY')->nullable();
            $table->datetime('REPORT_CASH_ADVANCE_CREATED_AT')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_UPDATED_BY')->nullable();
            $table->dateTime('REPORT_CASH_ADVANCE_UPDATED_AT')->nullable();
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
