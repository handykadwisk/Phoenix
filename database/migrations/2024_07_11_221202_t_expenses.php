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
        Schema::create('t_expenses', function (Blueprint $table) {
            $table->increments('EXPENSES_ID')->primary();
            $table->string('EXPENSES_NUMBER')->nullable();
            $table->smallInteger('EXPENSES_DIVISION')->nullable();
            $table->smallInteger('EXPENSES_COST_CENTER')->nullable();
            $table->smallInteger('EXPENSES_BRANCH')->nullable();
            $table->smallInteger('EXPENSES_USED_BY')->nullable();
            $table->smallInteger('EXPENSES_REQUESTED_BY')->nullable();
            $table->date('EXPENSES_REQUESTED_DATE')->nullable();
            $table->smallInteger('EXPENSES_FIRST_APPROVAL_BY')->nullable();
            $table->string('EXPENSES_FIRST_APPROVAL_USER')->nullable();
            $table->dateTime('EXPENSES_FIRST_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('EXPENSES_FIRST_APPROVAL_STATUS')->nullable();
            $table->text('EXPENSES_FIRST_APPROVAL_NOTE')->nullable();
            $table->smallInteger('EXPENSES_SECOND_APPROVAL_BY')->nullable();
            $table->string('EXPENSES_SECOND_APPROVAL_USER')->nullable();
            $table->dateTime('EXPENSES_SECOND_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('EXPENSES_SECOND_APPROVAL_STATUS')->nullable();
            $table->text('EXPENSES_SECOND_APPROVAL_NOTE')->nullable();
            $table->smallInteger('EXPENSES_THIRD_APPROVAL_BY')->nullable();
            $table->string('EXPENSES_THIRD_APPROVAL_USER')->nullable();
            $table->dateTime('EXPENSES_THIRD_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('EXPENSES_THIRD_APPROVAL_STATUS')->nullable();
            $table->text('EXPENSES_THIRD_APPROVAL_NOTE')->nullable();
            $table->text('EXPENSES_REQUEST_NOTE')->nullable();
            $table->smallInteger('EXPENSES_TYPE')->nullable();
            $table->smallInteger('EXPENSES_METHOD')->nullable();
            $table->date('EXPENSES_SETTLEMENT_DATE')->nullable();
            $table->decimal('EXPENSES_TOTAL_AMOUNT', 16, 2)->nullable();
            $table->decimal('EXPENSES_TOTAL_AMOUNT_APPROVE', 16, 2)->nullable();
            $table->decimal('EXPENSES_TOTAL_AMOUNT_DIFFERENT', 16, 2)->nullable();
            $table->datetime('EXPENSES_CREATED_AT')->nullable();
            $table->smallInteger('EXPENSES_CREATED_BY')->nullable();
            $table->dateTime('EXPENSES_UPDATED_AT')->nullable();
            $table->smallInteger('EXPENSES_UPDATED_BY')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_expenses');
    }
};