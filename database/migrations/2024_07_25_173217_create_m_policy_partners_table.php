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
        Schema::create('m_policy_partner', function (Blueprint $table) {
            $table->increments('POLICY_PARTNER_ID')->primary();
            $table->unsignedBigInteger('POLICY_ID')->nullable();
            $table->integer('INCOME_TYPE')->nullable();
            $table->string('PARTNER_NAME')->nullable();
            $table->decimal('BROKERAGE_FEE_PERCENTAGE',20,2)->default(0)->nullable();
            $table->decimal('BROKERAGE_FEE_AMOUNT',20,2)->default(0)->nullable();
            $table->decimal('ENGINEERING_FEE_PERCENTAGE',20,2)->default(0)->nullable();
            $table->decimal('ENGINEERING_FEE_AMOUNT',20,2)->default(0)->nullable();
            $table->decimal('ADMIN_COST',20,2)->default(0)->nullable();
            $table->decimal('CONSULTANCY_FEE_PERCENTAGE',20,2)->default(0)->nullable();
            $table->decimal('CONSULTANCY_FEE_AMOUNT',20,2)->default(0)->nullable();
            $table->foreign('POLICY_ID')->references('POLICY_ID')->on('t_policy')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_policy_partner');
    }
};
