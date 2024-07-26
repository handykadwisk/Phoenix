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
        Schema::table('t_installment', function (Blueprint $table) {
            $table->decimal('INSTALLMENT_PERCENTAGE',20,2)->change();
            $table->decimal('INSTALLMENT_AR',20,2)->change();
            $table->decimal('INSTALLMENT_AP',20,2)->change();
            $table->decimal('INSTALLMENT_GROSS_BF',20,2)->change();
            $table->decimal('INSTALLMENT_VAT',20,2)->change();
            $table->decimal('INSTALLMENT_PPH_23',20,2)->change();
            $table->decimal('INSTALLMENT_NET_BF',20,2)->change();
            $table->decimal('INSTALLMENT_ADMIN_COST',20,2)->change();
            $table->decimal('INSTALLMENT_POLICY_COST',20,2)->change();
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
