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
        Schema::create('t_installment', function (Blueprint $table) {
            $table->increments('INSTALLMENT_ID')->primary();
            $table->integer('INSURANCE_PANEL_ID');
            $table->integer('INSTALLMENT_TERM');
            $table->decimal('INSTALLMENT_PERCENTAGE');
            $table->date('INSTALLMENT_DUE_DATE');
            $table->decimal('INSTALLMENT_AR');
            $table->decimal('INSTALLMENT_AP');
            $table->decimal('INSTALLMENT_GROSS_BF');
            $table->decimal('INSTALLMENT_VAT');
            $table->decimal('INSTALLMENT_PPH_23');
            $table->decimal('INSTALLMENT_NET_BF');
            $table->decimal('INSTALLMENT_ADMIN_COST');
            $table->decimal('INSTALLMENT_POLICY_COST');

            // $table->foreign('INSURANCE_PANEL_ID')->references('IP_ID')->on('t_insurance_panel');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_installment');
    }
};
