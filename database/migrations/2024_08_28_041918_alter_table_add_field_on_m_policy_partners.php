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
        Schema::table('m_policy_partner', function (Blueprint $table) {
            $table->integer('BROKERAGE_FEE_VAT')->comment('0:Exclude VAT; 1:Include VAT')->nullable();
            $table->decimal('BROKERAGE_FEE_PPN',20,2)->default(0);
            $table->decimal('BROKERAGE_FEE_PPH',20,2)->default(0);
            $table->decimal('BROKERAGE_FEE_NETT_AMOUNT',20,2)->default(0);
            $table->integer('ENGINEERING_FEE_VAT')->comment('0:Exclude VAT; 1:Include VAT')->nullable();
            $table->decimal('ENGINEERING_FEE_PPN',20,2)->default(0);
            $table->decimal('ENGINEERING_FEE_PPH',20,2)->default(0);
            $table->decimal('ENGINEERING_FEE_NETT_AMOUNT',20,2)->default(0);
            $table->integer('CONSULTANCY_FEE_VAT')->comment('0:Exclude VAT; 1:Include VAT')->nullable();
            $table->decimal('CONSULTANCY_FEE_PPN',20,2)->default(0);
            $table->decimal('CONSULTANCY_FEE_PPH',20,2)->default(0);
            $table->decimal('CONSULTANCY_FEE_NETT_AMOUNT',20,2)->default(0);
            $table->integer('PAYABLE')->comment('0:Relation; 1:Fresnel')->nullable();
            $table->integer('M_PKS_RELATION_ID')->nullable();
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
