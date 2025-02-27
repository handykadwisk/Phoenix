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
        Schema::create('m_for_person_bank_account', function (Blueprint $table) {
            $table->bigIncrements('M_FOR_PERSON_BANK_ACCOUNT')->unique()->primary();
            $table->unsignedBigInteger('FOR_BANK_ACCOUNT_ID')->nullable();
            $table->unsignedBigInteger('PERSON_BANK_ACCOUNT_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_for_person_bank_account');
    }
};
