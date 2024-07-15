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
        Schema::table('t_insurance_panel', function (Blueprint $table) {
            $table->integer('IP_PREMIUM_TYPE')->nullable()->change();
            $table->integer('INSURANCE_ID')->nullable()->change();
            $table->decimal('IP_POLICY_INITIAL_PREMIUM',20,2)->nullable()->change();
            $table->decimal('IP_POLICY_SHARE',20,2)->nullable()->change();
            $table->decimal('IP_DISC_INSURANCE',20,2)->nullable()->change();
            $table->decimal('IP_PIP_AFTER_DISC',20,2)->nullable()->change();
            $table->decimal('IP_POLICY_BF',20,2)->nullable()->change();
            $table->decimal('IP_BF_AMOUNT',20,2)->nullable()->change();
            $table->decimal('IP_PPH_23',20,2)->nullable()->change();
            $table->decimal('IP_NET_BF',20,2)->nullable()->change();
            $table->decimal('IP_VAT_AMOUNT',20,2)->nullable()->change();
            $table->decimal('ENGINEERING_FEE',20,2)->nullable()->change();
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
