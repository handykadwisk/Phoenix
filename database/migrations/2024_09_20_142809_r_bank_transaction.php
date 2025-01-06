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
        Schema::create('r_bank_transaction', function (Blueprint $table) {
            $table->increments('BANK_TRANSACTION_ID')->primary();
            $table->integer('BANK_ID');
            $table->integer('BANK_TRANSACTION_CURRENCY_ID')->nullable();
            $table->integer('BANK_TRANSACTION_COA_CODE')->nullable();
            $table->string('BANK_TRANSACTION_NAME')->nullable();
            $table->string('BANK_TRANSACTION_ACCOUNT_NUMBER')->nullable();
            $table->string('BANK_TRANSACTION_ACCOUNT_NAME')->nullable();
            $table->text('BANK_TRANSACTION_ADDRESS')->nullable();
            $table->string('BANK_TRANSACTION_NAME_INVOICE')->nullable();
            $table->tinyInteger('BANK_TRANSACTION_FOR_INVOICE')->nullable();
            $table->tinyInteger('BANK_TRANSACTION_FOR_INVOICE_DEFAULT')->nullable();
            $table->integer('BANK_TRANSACTION_CREATED_BY')->nullable();
            $table->dateTime('BANK_TRANSACTION_CREATED_AT')->nullable();
            $table->integer('BANK_TRANSACTION_UPDATED_BY')->nullable();
            $table->dateTime('BANK_TRANSACTION_UPDATED_AT')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_bank_transaction');
    }
};