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
        Schema::create('t_reimburse', function (Blueprint $table) {
            $table->increments('REIMBURSE_ID')->primary();
            $table->string('REIMBURSE_NUMBER')->nullable();
            $table->string('REIMBURSE_DIVISION')->nullable();
            $table->smallInteger('REIMBURSE_USED_BY')->nullable();
            $table->smallInteger('REIMBURSE_REQUESTED_BY')->nullable();
            $table->dateTime('REIMBURSE_REQUESTED_DATE')->nullable();
            $table->smallInteger('REIMBURSE_FIRST_APPROVAL_BY')->nullable();
            $table->string('REIMBURSE_FIRST_APPROVAL_USER')->nullable();
            $table->dateTime('REIMBURSE_FIRST_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('REIMBURSE_FIRST_APPROVAL_STATUS')->nullable();
            $table->text('REIMBURSE_FIRST_APPROVAL_NOTE')->nullable();
            $table->smallInteger('REIMBURSE_SECOND_APPROVAL_BY')->nullable();
            $table->string('REIMBURSE_SECOND_APPROVAL_USER')->nullable();
            $table->dateTime('REIMBURSE_SECOND_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('REIMBURSE_SECOND_APPROVAL_STATUS')->nullable();
            $table->text('REIMBURSE_SECOND_APPROVAL_NOTE')->nullable();
            $table->smallInteger('REIMBURSE_THIRD_APPROVAL_BY')->nullable();
            $table->string('REIMBURSE_THIRD_APPROVAL_USER')->nullable();
            $table->dateTime('REIMBURSE_THIRD_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('REIMBURSE_THIRD_APPROVAL_STATUS')->nullable();
            $table->text('REIMBURSE_THIRD_APPROVAL_NOTE')->nullable();
            $table->text('REIMBURSE_REQUEST_NOTE')->nullable();
            $table->smallInteger('REIMBURSE_DELIVERY_METHOD_TRANSFER')->nullable();
            $table->decimal('REIMBURSE_TRANSFER_AMOUNT', 16, 2)->nullable();
            $table->dateTime('REIMBURSE_TRANSFER_DATE')->nullable();
            $table->string('REIMBURSE_FROM_BANK_ACCOUNT')->nullable();
            $table->smallInteger('REIMBURSE_DELIVERY_METHOD_CASH')->nullable();
            $table->decimal('REIMBURSE_CASH_AMOUNT', 16, 2)->nullable();
            $table->dateTime('REIMBURSE_RECEIVE_DATE')->nullable();
            $table->string('REIMBURSE_RECEIVE_NAME')->nullable();
            $table->decimal('REIMBURSE_TOTAL_AMOUNT', 16, 2)->nullable();
            $table->datetime('REIMBURSE_CREATED_AT')->nullable();
            $table->smallInteger('REIMBURSE_CREATED_BY')->nullable();
            $table->dateTime('REIMBURSE_UPDATED_AT')->nullable();
            $table->smallInteger('REIMBURSE_UPDATED_BY')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_reimburse');
    }
};
