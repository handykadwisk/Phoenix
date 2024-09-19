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
        Schema::create('r_interest_insured', function (Blueprint $table) {
            $table->increments('INTEREST_INSURED_ID')->primary();
            $table->string('INTEREST_INSURED_NAME')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_interest_insured');
    }
};
