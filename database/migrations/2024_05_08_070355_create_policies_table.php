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
        Schema::create('t_policy', function (Blueprint $table) {
            $table->increments('POLICY_ID')->primary();
            $table->unsignedBigInteger('RELATION_ID')->nullable();
            $table->string('POLICY_NUMBER')->nullable();
            $table->integer('INSURANCE_TYPE_ID')->nullable();
            $table->string('POLICY_THE_INSURED')->nullable();
            $table->time('POLICY_INCEPTION_DATE')->nullable();
            $table->time('POLICY_DUE_DATE')->nullable();
            $table->unsignedBigInteger('POLICY_STATUS_ID')->nullable();
            $table->integer('POLICY_INSURANCE_PANEL')->nullable();
            $table->integer('POLICY_SHARE')->nullable();
            $table->string('POLICY_CREATED_BY')->nullable();
            $table->timestamp('POLICY_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('POLICY_UPDATED_BY')->nullable();
            $table->timestamp('POLICY_UPDATED_DATE')->nullable();
        });

        // Schema::create('t_policy_initial_premium', function (Blueprint $table) {
        //     $table->increments('POLICY_INITIAL_PREMIUM_ID')->primary();
        //     $table->integer('POLICY_ID')->nullable();
        //     $table->integer('CURRENCY_ID')->nullable();
        //     $table->decimal('SUM_INSURED')->nullable();
        //     $table->decimal('RATE')->nullable();
        //     $table->decimal('INITIAL_PREMIUM')->nullable();
        //     $table->integer('INSTALLMENT')->nullable();
        //     $table->string('CREATED_BY')->nullable();
        //     $table->timestamp('CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
        //     $table->string('UPDATED_BY')->nullable();
        //     $table->timestamp('UPDATED_DATE')->nullable();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('policies');
    }
};
