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
        Schema::create('r_cash_advance_differents', function (Blueprint $table) {
            $table->increments('CASH_ADVANCE_DIFFERENTS_ID')->primary();
            $table->string('CASH_ADVANCE_DIFFERENTS_NAME')->nullable();
            $table->dateTime('CASH_ADVANCE_DIFFERENTS_CREATED_AT')->nullable();
            $table->dateTime('CASH_ADVANCE_DIFFERENTS_UPDATED_AT')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_cash_advance_differents');
    }
};
