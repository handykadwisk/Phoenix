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
            $table->increments('EXPENSES_ID')->primary();
            $table->string('EXPENSES_NUMBER')->nullable();
            $table->integer('EXPENSES_TYPE')->nullable();
            $table->string('DIVISION')->nullable();
            $table->smallInteger('USED_BY')->nullable();
            $table->smallInteger('EXPENSES_REQUESTED_BY')->nullable();
            $table->dateTime('EXPENSES_REQUESTED_DATE')->nullable();
            $table->smallInteger('EXPENSES_UPDATED_BY')->nullable();
            $table->dateTime('EXPENSES_UPDATED_DATE')->nullable();
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
            $table->text('EXPENSES_REQUEST_NOTE')->nullable();
            $table->smallInteger('FA_APPROVAL_BY')->nullable();
            $table->string('FA_APPROVAL_USER')->nullable();
            $table->dateTime('FA_APPROVAL_CHANGE_STATUS_DATE')->nullable();
            $table->smallInteger('FA_APPROVAL_STATUS')->nullable();
            $table->text('FA_APPROVAL_NOTE')->nullable();
            $table->decimal('EXPENSES_TOTAL_AMOUNT', 16, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_cash_advance');
    }
};