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
        Schema::create('m_for_employee_bank_account', function (Blueprint $table) {
            $table->bigIncrements('M_FOR_EMPLOYEE_BANK_ACCOUNT_ID')->unique()->primary();
            $table->unsignedBigInteger('FOR_BANK_ACCOUNT_ID')->nullable();
            $table->unsignedBigInteger('EMPLOYEE_BANK_ACCOUNT_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_for_employee_bank_account');
    }
};
