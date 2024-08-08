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
        Schema::create('m_cash_advance_report_document', function (Blueprint $table) {
            $table->increments('CASH_ADVANCE_DOCUMENT_ID')->primary();
            $table->smallInteger('CASH_ADVANCE_DOCUMENT_REPORT_CASH_ADVANCE_DETAIL_ID');
            $table->smallInteger('CASH_ADVANCE_DOCUMENT_REPORT_CASH_ADVANCE_DETAIL_DOCUMENT_ID');
            $table->dateTime('CASH_ADVANCE_DOCUMENT_CREATED_AT');
            $table->smallInteger('CASH_ADVANCE_DOCUMENT_CREATED_BY');
            $table->dateTime('CASH_ADVANCE_DOCUMENT_UPDATED_AT')->nullable();
            $table->smallInteger('CASH_ADVANCE_DOCUMENT_UPDATED_BY')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_cash_advance_report_document');
    }
};
