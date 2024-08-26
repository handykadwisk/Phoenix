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
        Schema::create('m_policy_exchange_rate', function (Blueprint $table) {
            $table->increments('POLICY_EXCHANGE_RATE_ID')->primary();
            $table->integer('POLICY_ID')->nullable();
            $table->integer('CURRENCY_ID')->nullable();
            $table->date('POLICY_EXCHANGE_RATE_DATE')->nullable();
            $table->decimal('POLICY_EXCHANGE_RATE_AMOUNT',20,2)->default(1)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_policy_exchange_rate');
    }
};
