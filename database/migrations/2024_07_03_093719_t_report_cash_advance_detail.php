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
        Schema::create('t_report_cash_advance_detail', function (Blueprint $table) {
            $table->increments('REPORT_CASH_ADVANCE_DETAIL_ID')->primary();
            $table->foreignId('REPORT_CASH_ADVANCE_ID')->nullable();
            $table->date('REPORT_CASH_ADVANCE_DETAIL_START_DATE')->nullable();
            $table->date('REPORT_CASH_ADVANCE_DETAIL_END_DATE')->nullable();
            $table->text('REPORT_CASH_ADVANCE_DETAIL_PURPOSE')->nullable();
            $table->text('REPORT_CASH_ADVANCE_DETAIL_LOCATION')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID')->nullable();
            $table->string('REPORT_CASH_ADVANCE_DETAIL_RELATION_NAME')->nullable();
            $table->string('REPORT_CASH_ADVANCE_DETAIL_RELATION_POSITION')->nullable();
            $table->decimal('REPORT_CASH_ADVANCE_DETAIL_AMOUNT', 15, 2)->nullable();
            $table->string('REPORT_CASH_ADVANCE_DETAIL_DOCUMENT_ID')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_DETAIL_APPROVAL')->nullable();
            $table->smallInteger('REPORT_CASH_ADVANCE_DETAIL_COST_CLASSIFICATION')->nullable();
            $table->decimal('REPORT_CASH_ADVANCE_DETAIL_AMOUNT_APPROVE', 16, 2)->nullable();
            $table->text('REPORT_CASH_ADVANCE_DETAIL_REMARKS')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_report_cash_advance_detail');
    }
};