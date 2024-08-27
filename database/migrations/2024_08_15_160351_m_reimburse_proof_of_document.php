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
        Schema::create('m_reimburse_proof_of_document', function (Blueprint $table) {
            $table->increments('REIMBURSE_PROOF_OF_DOCUMENT_ID')->primary();
            $table->smallInteger('REIMBURSE_PROOF_OF_DOCUMENT_REIMBURSE_ID');
            $table->smallInteger('REIMBURSE_PROOF_OF_DOCUMENT_REIMBURSE_DOCUMENT_ID');
            $table->dateTime('REIMBURSE_PROOF_OF_DOCUMENT_CREATED_AT');
            $table->smallInteger('REIMBURSE_PROOF_OF_DOCUMENT_CREATED_BY');
            $table->dateTime('REIMBURSE_PROOF_OF_DOCUMENT_UPDATED_AT')->nullable();
            $table->smallInteger('REIMBURSE_PROOF_OF_DOCUMENT_UPDATED_BY')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_reimburse_proof_of_document');
    }
};