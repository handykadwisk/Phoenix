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
        Schema::table('m_policy_insured_detail', function (Blueprint $table) {
            $table->unsignedInteger('INTEREST_INSURED_ID')->nullable();
            $table->string('REMARKS')->nullable();
            $table->decimal('BF_FULL_AMOUNT',20,2)->default(0);
            $table->decimal('BF_NETT_AMOUNT',20,2)->default(0);
            $table->decimal('EF_FULL_AMOUNT',20,2)->default(0);
            $table->decimal('EF_NETT_AMOUNT',20,2)->default(0);
            $table->decimal('DISC_CF_PERCENTAGE',20,2)->default(0);
            $table->decimal('DISC_CF_AMOUNT',20,2)->default(0);
            $table->decimal('CF_NETT_AMOUNT',20,2)->default(0);
            $table->decimal('INCOME_NETT_AMOUNT',20,2)->default(0);
            $table->foreign('INTEREST_INSURED_ID')->references('INTEREST_INSURED_ID')->on('r_interest_insured')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
