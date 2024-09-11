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
        Schema::create('t_exchange_rate_tax_detail', function (Blueprint $table) {
            $table->increments('EXCHANGE_RATE_TAX_DETAIL_ID')->primary();
            $table->bigInteger('EXCHANGE_RATE_TAX_ID');
            $table->smallInteger('EXCHANGE_RATE_TAX_DETAIL_CURRENCY_ID');
            $table->decimal('EXCHANGE_RATE_TAX_DETAIL_EXCHANGE_RATE', 16, 2);
            $table->smallInteger('EXCHANGE_RATE_TAX_DETAIL_CREATED_BY');
            $table->dateTime('EXCHANGE_RATE_TAX_DETAIL_CREATED_AT');
            $table->smallInteger('EXCHANGE_RATE_TAX_DETAIL_UPDATED_BY')->nullable();
            $table->dateTime('EXCHANGE_RATE_TAX_DETAIL_UPDATED_AT')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_exchange_rate_detail');
    }
};