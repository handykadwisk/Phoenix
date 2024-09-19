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
        Schema::create('t_employee_bank_account', function (Blueprint $table) {
            $table->bigIncrements('EMPLOYEE_BANK_ACCOUNT_ID')->unique()->primary();
            $table->bigInteger('EMPLOYEE_ID')->nullable();
            $table->string('EMPLOYEE_BANK_ACCOUNT_NAME', 255)->nullable();
            $table->string('EMPLOYEE_BANK_ACCOUNT_NUMBER', 255)->nullable();
            $table->string('EMPLOYEE_BANK_ACCOUNT_FOR')->nullable()->comment("1.Payroll 2.Cash Advance 3.Petty Cash 4.Loan");
            $table->bigInteger('BANK_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_employee_bank_account');
    }
};
