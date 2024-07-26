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
        Schema::create('m_policy_coverage_detail', function (Blueprint $table) {
            $table->increments('POLICY_COVERAGE_DETAIL_ID')->primary();
            $table->unsignedInteger('POLICY_COVERAGE_ID')->nullable();
            $table->unsignedInteger('CURRENCY_ID')->nullable();
            $table->decimal('SUM_INSURED',20,2)->default(0)->nullable();
            $table->decimal('RATE',20,2)->default(0)->nullable();
            $table->decimal('GROSS_PREMIUM',20,2)->default(0)->nullable();
            $table->decimal('LOST_LIMIT_PERCENTAGE',20,2)->default(0)->nullable();
            $table->decimal('LOST_LIMIT_AMOUNT',20,2)->default(0)->nullable();
            $table->decimal('LOST_LIMIT_SCALE',20,2)->default(0)->nullable();
            $table->decimal('INSURANCE_DISC_PERCENTAGE',20,2)->default(0)->nullable();
            $table->decimal('INSURANCE_DISC_AMOUNT',20,2)->default(0)->nullable();
            $table->decimal('PREMIUM',20,2)->default(0)->nullable();
            $table->foreign('POLICY_COVERAGE_ID')->references('POLICY_COVERAGE_ID')->on('m_policy_coverage')->onDelete('cascade');
            $table->foreign('CURRENCY_ID')->references('CURRENCY_ID')->on('r_currency')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_policy_coverage_detail');
    }
};
