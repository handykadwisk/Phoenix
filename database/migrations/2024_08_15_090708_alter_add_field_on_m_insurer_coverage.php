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
            $table->integer('BROKERAGE_FEE_VAT')->comment('0:Exclude VAT; 1:Include VAT')->default(0)->nullable();
            $table->decimal('BROKERAGE_FEE_PPN',20,2)->default(0);
            $table->decimal('BROKERAGE_FEE_PPH',20,2)->default(0);
            $table->decimal('BROKERAGE_FEE_NETT_AMOUNT',20,2)->default(0);
            $table->integer('ENGINEERING_FEE_VAT')->comment('0:Exclude VAT; 1:Include VAT')->default(0)->nullable();
            $table->decimal('ENGINEERING_FEE_PPN',20,2)->default(0);
            $table->decimal('ENGINEERING_FEE_PPH',20,2)->default(0);
            $table->decimal('ENGINEERING_FEE_NETT_AMOUNT',20,2)->default(0);
            $table->integer('CONSULTANCY_FEE_VAT')->comment('0:Exclude VAT; 1:Include VAT')->default(0)->nullable();
            $table->decimal('CONSULTANCY_FEE_PPN',20,2)->default(0);
            $table->decimal('CONSULTANCY_FEE_PPH',20,2)->default(0);
            $table->decimal('CONSULTANCY_FEE_NETT_AMOUNT',20,2)->default(0);
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
