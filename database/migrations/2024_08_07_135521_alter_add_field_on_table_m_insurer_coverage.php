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
        Schema::table('m_insurer_coverage', function (Blueprint $table) {
            $table->unsignedInteger('INTEREST_INSURED_ID')->nullable();
            $table->string('REMARKS')->nullable();
            $table->decimal('BROKERAGE_FEE_PERCENTAGE',20,2)->default(0);
            $table->decimal('ENGINEERING_FEE_PERCENTAGE',20,2)->default(0);
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
