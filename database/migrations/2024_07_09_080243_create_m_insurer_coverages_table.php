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
        Schema::create('m_insurer_coverage', function (Blueprint $table) {
            $table->increments('INSURER_COVERAGE_ID')->primary();
            $table->unsignedInteger('IP_ID')->nullable();
            $table->unsignedInteger('CURRENCY_ID')->nullable();
            $table->string('COVERAGE_NAME')->nullable();
            $table->decimal('GROSS_PREMI',20,2)->default(0);
            $table->decimal('ADMIN_COST',20,2)->default(0);
            $table->decimal('DISC_BROKER',20,2)->default(0);
            $table->decimal('DISC_CONSULTATION',20,2)->default(0);
            $table->decimal('DISC_ADMIN',20,2)->default(0);
            $table->decimal('NETT_PREMI',20,2)->default(0);
            $table->decimal('FEE_BASED_INCOME',20,2)->default(0);
            $table->decimal('AGENT_COMMISION',20,2)->default(0);
            $table->decimal('ACQUISITION_COST',20,2)->default(0);
            $table->foreign('IP_ID')->references('IP_ID')->on('t_insurance_panel')->onDelete('cascade');
            $table->foreign('CURRENCY_ID')->references('CURRENCY_ID')->on('r_currency')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_insurer_coverage');
    }
};
