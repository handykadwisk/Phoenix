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
        Schema::create('t_exchange_rate_tax', function (Blueprint $table) {
            $table->increments('EXCHANGE_RATE_TAX_ID')->primary();
            $table->date('EXCHANGE_RATE_TAX_START_DATE');
            $table->date('EXCHANGE_RATE_TAX_END_DATE');
            $table->smallInteger('EXCHANGE_RATE_TAX_CREATED_BY');
            $table->dateTime('EXCHANGE_RATE_TAX_CREATED_AT');
            $table->smallInteger('EXCHANGE_RATE_TAX_UPDATED_BY')->nullable();
            $table->dateTime('EXCHANGE_RATE_TAX_UPDATED_AT')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_exchange_rate_tax');
    }
};