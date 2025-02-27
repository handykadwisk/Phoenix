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
        Schema::create('m_person_address', function (Blueprint $table) {
            $table->bigIncrements('PERSON_ADDRESS_ID')->unique()->primary();
            $table->unsignedBigInteger('PERSON_ID')->nullable();
            $table->unsignedBigInteger('ADDRESS_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_person_address');
    }
};
