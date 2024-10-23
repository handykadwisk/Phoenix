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
        Schema::create('m_expenses_document', function (Blueprint $table) {
            $table->increments('EXPENSES_DOCUMENT_ID')->primary();
            $table->smallInteger('EXPENSES_DOCUMENT_EXPENSES_DETAIL_ID');
            $table->smallInteger('EXPENSES_DOCUMENT_EXPENSES_DETAIL_DOCUMENT_ID');
            $table->dateTime('EXPENSES_DOCUMENT_CREATED_AT');
            $table->smallInteger('EXPENSES_DOCUMENT_CREATED_BY');
            $table->dateTime('EXPENSES_DOCUMENT_UPDATED_AT')->nullable();
            $table->smallInteger('EXPENSES_DOCUMENT_UPDATED_BY')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_expenses_document');
    }
};