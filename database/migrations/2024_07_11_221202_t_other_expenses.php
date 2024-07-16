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
        Schema::create('t_other_expenses', function (Blueprint $table) {
            $table->increments('OTHER_EXPENSES_ID')->primary();
            $table->string('OTHER_EXPENSES_NUMBER')->nullable();
            $table->string('OTHER_EXPENSES_DIVISION')->nullable();
            $table->smallInteger('OTHER_EXPENSES_USED_BY')->nullable();
            $table->smallInteger('OTHER_EXPENSES_REQUESTED_BY')->nullable();
            $table->dateTime('OTHER_EXPENSES_REQUESTED_DATE')->nullable();
            $table->smallInteger('OTHER_EXPENSES_FIRST_APPROVAL_BY')->nullable();
            $table->string('OTHER_EXPENSES_FIRST_APPROVAL_USER')->nullable();
            $table->dateTime('OTHER_EXPENSES_FIRST_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('OTHER_EXPENSES_FIRST_APPROVAL_STATUS')->nullable();
            $table->text('OTHER_EXPENSES_FIRST_APPROVAL_NOTE')->nullable();
            $table->smallInteger('OTHER_EXPENSES_SECOND_APPROVAL_BY')->nullable();
            $table->string('OTHER_EXPENSES_SECOND_APPROVAL_USER')->nullable();
            $table->dateTime('OTHER_EXPENSES_SECOND_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('OTHER_EXPENSES_SECOND_APPROVAL_STATUS')->nullable();
            $table->text('OTHER_EXPENSES_SECOND_APPROVAL_NOTE')->nullable();
            $table->smallInteger('OTHER_EXPENSES_THIRD_APPROVAL_BY')->nullable();
            $table->string('OTHER_EXPENSES_THIRD_APPROVAL_USER')->nullable();
            $table->dateTime('OTHER_EXPENSES_THIRD_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('OTHER_EXPENSES_THIRD_APPROVAL_STATUS')->nullable();
            $table->text('OTHER_EXPENSES_THIRD_APPROVAL_NOTE')->nullable();
            $table->text('OTHER_EXPENSES_REQUEST_NOTE')->nullable();
            $table->smallInteger('OTHER_EXPENSES_DELIVERY_METHOD_TRANSFER')->nullable();
            $table->decimal('OTHER_EXPENSES_TRANSFER_AMOUNT', 16, 2)->nullable();
            $table->dateTime('OTHER_EXPENSES_TRANSFER_DATE')->nullable();
            $table->string('OTHER_EXPENSES_FROM_BANK_ACCOUNT')->nullable();
            $table->smallInteger('OTHER_EXPENSES_DELIVERY_METHOD_CASH')->nullable();
            $table->decimal('OTHER_EXPENSES_CASH_AMOUNT', 16, 2)->nullable();
            $table->dateTime('OTHER_EXPENSES_RECEIVE_DATE')->nullable();
            $table->string('OTHER_EXPENSES_RECEIVE_NAME')->nullable();
            $table->decimal('OTHER_EXPENSES_TOTAL_AMOUNT', 16, 2)->nullable();
            $table->datetime('OTHER_EXPENSES_CREATED_AT')->nullable();
            $table->smallInteger('OTHER_EXPENSES_CREATED_BY')->nullable();
            $table->dateTime('OTHER_EXPENSES_UPDATED_AT')->nullable();
            $table->smallInteger('OTHER_EXPENSES_UPDATED_BY')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_other_expenses');
    }
};
