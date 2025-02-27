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
        Schema::create('m_address_employee', function (Blueprint $table) {
            $table->bigIncrements('M_ADDRESS_EMPLOYEE_ID')->unique()->primary();
            $table->unsignedBigInteger('EMPLOYEE_ID')->nullable();
            $table->unsignedBigInteger('ADDRESS_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_address_employee');
    }
};
