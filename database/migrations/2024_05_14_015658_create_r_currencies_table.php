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
        Schema::create('r_currency', function (Blueprint $table) {
            // $table->id();
            // $table->timestamps();
            $table->increments('CURRENCY_ID')->primary();
            $table->string('CURRENCY_SYMBOL')->nullable();
            $table->string('CURRENCY_NAME')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_currency');
    }
};
