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
        Schema::create('t_cash_advance', function (Blueprint $table) {
            $table->increments('CASH_ADVANCE_ID')->primary();
            $table->string('CASH_ADVANCE_NUMBER')->nullable();
            $table->smallInteger('CASH_ADVANCE_DIVISION')->nullable();
            $table->smallInteger('CASH_ADVANCE_COST_CENTER')->nullable();
            $table->smallInteger('CASH_ADVANCE_BRANCH')->nullable();
            $table->smallInteger('CASH_ADVANCE_USED_BY')->nullable();
            $table->smallInteger('CASH_ADVANCE_REQUESTED_BY')->nullable();
            $table->date('CASH_ADVANCE_REQUESTED_DATE')->nullable();
            $table->smallInteger('CASH_ADVANCE_FIRST_APPROVAL_BY')->nullable();
            $table->string('CASH_ADVANCE_FIRST_APPROVAL_USER')->nullable();
            $table->dateTime('CASH_ADVANCE_FIRST_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('CASH_ADVANCE_FIRST_APPROVAL_STATUS')->nullable();
            $table->text('CASH_ADVANCE_FIRST_APPROVAL_NOTE')->nullable();
            $table->smallInteger('CASH_ADVANCE_SECOND_APPROVAL_BY')->nullable();
            $table->string('CASH_ADVANCE_SECOND_APPROVAL_USER')->nullable();
            $table->dateTime('CASH_ADVANCE_SECOND_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('CASH_ADVANCE_SECOND_APPROVAL_STATUS')->nullable();
            $table->text('CASH_ADVANCE_SECOND_APPROVAL_NOTE')->nullable();
            $table->smallInteger('CASH_ADVANCE_THIRD_APPROVAL_BY')->nullable();
            $table->string('CASH_ADVANCE_THIRD_APPROVAL_USER')->nullable();
            $table->dateTime('CASH_ADVANCE_THIRD_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('CASH_ADVANCE_THIRD_APPROVAL_STATUS')->nullable();
            $table->text('CASH_ADVANCE_THIRD_APPROVAL_NOTE')->nullable();
            $table->text('CASH_ADVANCE_REQUEST_NOTE')->nullable();
            $table->smallInteger('CASH_ADVANCE_DELIVERY_METHOD_TRANSFER')->nullable();
            $table->decimal('CASH_ADVANCE_TRANSFER_AMOUNT', 16, 2)->nullable();
            $table->dateTime('CASH_ADVANCE_TRANSFER_DATE')->nullable();
            $table->string('CASH_ADVANCE_BANK_ACCOUNT')->nullable();
            $table->smallInteger('CASH_ADVANCE_DELIVERY_METHOD_CASH')->nullable();
            $table->decimal('CASH_ADVANCE_CASH_AMOUNT', 16, 2)->nullable();
            $table->dateTime('CASH_ADVANCE_RECEIVE_DATE')->nullable();
            $table->string('CASH_ADVANCE_RECEIVE_NAME')->nullable();
            $table->decimal('CASH_ADVANCE_TOTAL_AMOUNT', 16, 2)->nullable();
            $table->datetime('CASH_ADVANCE_CREATED_AT')->nullable();
            $table->smallInteger('CASH_ADVANCE_CREATED_BY')->nullable();
            $table->dateTime('CASH_ADVANCE_UPDATED_AT')->nullable();
            $table->smallInteger('CASH_ADVANCE_UPDATED_BY')->nullable();
        });
        
        // Schema::create('t_cash_advance', function (Blueprint $table) {
        //     $table->increments('EXPENSES_ID')->primary();
        //     $table->string('EXPENSES_NUMBER')->nullable();
        //     $table->integer('EXPENSES_TYPE')->nullable();
        //     $table->string('DIVISION')->nullable();
        //     $table->smallInteger('USED_BY')->nullable();
        //     $table->smallInteger('EXPENSES_REQUESTED_BY')->nullable();
        //     $table->dateTime('EXPENSES_REQUESTED_DATE')->nullable();
        //     $table->smallInteger('EXPENSES_UPDATED_BY')->nullable();
        //     $table->dateTime('EXPENSES_UPDATED_DATE')->nullable();
        //     $table->smallInteger('FIRST_APPROVAL_BY')->nullable();
        //     $table->string('FIRST_APPROVAL_USER')->nullable();
        //     $table->dateTime('FIRST_APPROVAL_CHANGE_STATUS_DATE')->nullable();
        //     $table->smallInteger('FIRST_APPROVAL_STATUS')->nullable();
        //     $table->text('FIRST_APPROVAL_NOTE')->nullable();
        //     $table->smallInteger('SECOND_APPROVAL_BY')->nullable();
        //     $table->string('SECOND_APPROVAL_USER')->nullable();
        //     $table->dateTime('SECOND_APPROVAL_CHANGE_STATUS_DATE')->nullable();
        //     $table->smallInteger('SECOND_APPROVAL_STATUS')->nullable();
        //     $table->text('SECOND_APPROVAL_NOTE')->nullable();
        //     $table->text('EXPENSES_REQUEST_NOTE')->nullable();
        //     $table->smallInteger('DELIVERY_METHOD')->nullable();
        //     $table->smallInteger('FA_APPROVAL_BY')->nullable();
        //     $table->string('FA_APPROVAL_USER')->nullable();
        //     $table->dateTime('FA_APPROVAL_CHANGE_STATUS_DATE')->nullable();
        //     $table->smallInteger('FA_APPROVAL_STATUS')->nullable();
        //     $table->text('FA_APPROVAL_NOTE')->nullable();
        //     $table->decimal('EXPENSES_TOTAL_AMOUNT', 16, 2)->nullable();
        //     $table->datetimes('CASH_ADVANCE_CREATED_AT');
        //     $table->smallInteger('CASH_ADVANCE_CREATED_BY');
        //     $table->datetimes('CASH_ADVANCE_UPDATED_AT');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_cash_advance');
    }
};