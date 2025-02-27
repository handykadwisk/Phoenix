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
        Schema::create('m_bank_account_relation', function (Blueprint $table) {
            $table->bigIncrements('M_BANK_ACCOUNT_RELATION_ID')->unique()->primary();
            $table->unsignedBigInteger('RELATION_ORGANIZATION_ID')->nullable();
            $table->bigInteger('BANK_ID')->nullable();
            $table->string('ACCOUNT_NAME', 255)->nullable();
            $table->string('ACCOUNT_NUMBER', 255)->nullable();
            $table->string('NPWP_NAME', 255)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_bank_account_relation');
    }
};
