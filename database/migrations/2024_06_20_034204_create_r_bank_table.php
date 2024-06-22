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
        Schema::create('r_bank', function (Blueprint $table) {
            $table->bigIncrements('BANK_ID')->unique()->primary();
            $table->string('BANK_NAME', 255)->nullable();
            $table->string('BANK_ABBREVIATION')->nullable();
            $table->string('BANK_IDENTIFIER_CODE')->nullable();
            $table->string('BANK_CODE')->nullable();
            $table->string('BANK_CLEARING_CODE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_bank');
    }
};
