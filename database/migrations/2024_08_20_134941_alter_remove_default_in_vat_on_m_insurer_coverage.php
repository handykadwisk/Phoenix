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
            $table->integer('BROKERAGE_FEE_VAT')->comment('0:Exclude VAT; 1:Include VAT')->nullable()->change();
            $table->integer('ENGINEERING_FEE_VAT')->comment('0:Exclude VAT; 1:Include VAT')->nullable()->change();
            $table->integer('CONSULTANCY_FEE_VAT')->comment('0:Exclude VAT; 1:Include VAT')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vat_on_m_insurer_coverage', function (Blueprint $table) {
            //
        });
    }
};
