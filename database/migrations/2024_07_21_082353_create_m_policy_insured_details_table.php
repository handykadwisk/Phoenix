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
        Schema::create('m_policy_insured_detail', function (Blueprint $table) {
            $table->increments('POLICY_INSURED_DETAIL_ID')->primary();
            $table->unsignedInteger('POLICY_INSURED_ID')->nullable();
            $table->unsignedInteger('POLICY_COVERAGE_ID')->nullable();
            $table->decimal('CONSULTANCY_FEE',20,2)->default(0)->nullable();
            $table->decimal('PREMIUM_AMOUNT',20,2)->default(0)->nullable();
            $table->decimal('DISC_BF_PERCENTAGE',20,2)->default(0)->nullable();
            $table->decimal('DISC_BF_AMOUNT',20,2)->default(0)->nullable();
            $table->decimal('DISC_ADMIN_PERCENTAGE',20,2)->default(0)->nullable();
            $table->decimal('DISC_ADMIN_AMOUNT',20,2)->default(0)->nullable();
            $table->decimal('DISC_EF_PERCENTAGE',20,2)->default(0)->nullable();
            $table->decimal('DISC_EF_AMOUNT',20,2)->default(0)->nullable();
            $table->decimal('PREMIUM_TO_INSURED',20,2)->default(0)->nullable();
            $table->foreign('POLICY_INSURED_ID')->references('POLICY_INSURED_ID')->on('m_policy_insured')->onDelete('cascade');
            $table->foreign('POLICY_COVERAGE_ID')->references('POLICY_COVERAGE_ID')->on('m_policy_coverage')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_policy_insured_detail');
    }
};
