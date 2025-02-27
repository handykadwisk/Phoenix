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
        Schema::create('t_insurance_panel', function (Blueprint $table) {
            $table->increments('IP_ID')->primary();
            $table->integer('POLICY_ID');
            $table->integer('POLICY_INITIAL_PREMIUM_ID');
            $table->integer('IP_PREMIUM_TYPE')->comment('1:Initial Premium; 2:Additional Premium; 3:Self Insured');
            $table->integer('INSURANCE_ID');
            $table->integer('IP_POLICY_LEADER')->comment('0:No; 1:Yes');
            $table->integer('IP_CURRENCY_ID');
            $table->integer('IP_TERM');
            $table->decimal('IP_POLICY_INITIAL_PREMIUM');
            $table->decimal('IP_POLICY_SHARE');
            $table->decimal('IP_DISC_INSURANCE');
            $table->decimal('IP_PIP_AFTER_DISC');
            $table->decimal('IP_POLICY_BF');
            $table->decimal('IP_BF_AMOUNT');
            $table->tinyInteger('IP_VAT')->comment('1:Include; 2:Exclude');
            $table->decimal('IP_PPH_23');
            $table->decimal('IP_NET_BF');
            $table->tinyInteger('IP_PAYMENT_METHOD')->comment('1:Direct Insurance; 2:Direct Fresnel');
            $table->decimal('IP_VAT_AMOUNT');
            $table->integer('IP_CREATED_BY')->nullable();
            $table->timestamp('IP_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('IP_UPDATED_BY')->nullable();
            $table->timestamp('IP_UPDATED_DATE')->nullable();

            // $table->foreign('POLICY_ID')->references('POLICY_ID')->on('t_policy');
            // $table->foreign('POLICY_INITIAL_PREMIUM_ID')->references('POLICY_INITIAL_PREMIUM_ID')->on('m_policy_initial_premium_id');
            // $table->foreign('INSURANCE_ID')->references('RELATION_ORGANITATION_ID')->on('t_relation');
            // $table->foreign('IP_CURRENCY_ID')->references('CURRENCY_ID')->on('r_currency');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_insurance_panel');
    }
};
