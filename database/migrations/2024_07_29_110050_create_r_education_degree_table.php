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
        Schema::create('r_education_degree', function (Blueprint $table) {
            $table->bigIncrements('EDUCATION_DEGREE_ID')->unique()->primary();
            $table->string('EDUCATION_DEGREE_NAME', 255)->nullable();
            $table->bigInteger('EDUCATION_DEGREE_LEVEL')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_education_degree');
    }
};
