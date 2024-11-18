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
        Schema::create('t_receipt', function (Blueprint $table) {
            $table->increments('RECEIPT_ID')->primary();
            $table->integer('RECEIPT_DOCUMENT_ID')->nullable();
            $table->smallInteger('RECEIPT_CURRENCY_ID')->nullable();
            $table->smallInteger('RECEIPT_BANK_ID')->nullable();
            $table->bigInteger('RECEIPT_JOURNAL_ID')->nullable();
            $table->bigInteger('RECEIPT_JOURNAL_ID_ADD_RECEIPT')->nullable();
            $table->integer('RECEIPT_RELATION_ORGANIZATION_ID')->nullable();
            $table->string('RECEIPT_NUMBER')->nullable();
            $table->string('RECEIPT_NAME')->nullable();
            $table->date('RECEIPT_DATE')->nullable();
            $table->decimal('RECEIPT_VALUE', 16, 2)->nullable();
            $table->string('RECEIPT_COUNTED_AS')->nullable();
            $table->decimal('RECEIPT_EXCHANGE_RATE', 16, 2)->nullable();
            $table->text('RECEIPT_MEMO')->nullable();
            $table->tinyInteger('RECEIPT_STATUS')->nullable();
            $table->integer('RECEIPT_CREATED_BY')->nullable();
            $table->dateTime('RECEIPT_CREATED_AT')->nullable();
            $table->integer('RECEIPT_UPDATED_BY')->nullable();
            $table->dateTime('RECEIPT_UPDATED_AT')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_receipt');
    }
};