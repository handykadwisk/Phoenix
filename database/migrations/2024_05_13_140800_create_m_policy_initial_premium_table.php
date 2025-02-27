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
        Schema::create('m_policy_initial_premium', function (Blueprint $table) {
            // $table->id();
            // $table->timestamps();
            $table->increments('POLICY_INITIAL_PREMIUM_ID')->primary();
            $table->integer('POLICY_ID')->nullable();
            $table->integer('CURRENCY_ID')->nullable();
            $table->decimal('SUM_INSURED')->nullable();
            $table->decimal('RATE')->nullable();
            $table->decimal('INITIAL_PREMIUM')->nullable();
            $table->integer('INSTALLMENT')->nullable();
            $table->integer('CREATED_BY')->nullable();
            $table->timestamp('CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('UPDATED_BY')->nullable();
            $table->timestamp('UPDATED_DATE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_policy_initial_premium');
    }
};
