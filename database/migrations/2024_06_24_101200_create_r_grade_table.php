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
        Schema::create('r_grade', function (Blueprint $table) {
            $table->bigIncrements('GRADE_ID')->unique()->primary();
            $table->string('GRADE_NAME')->nullable();
            $table->string('GRADE_AKA')->nullable();
            $table->integer('GRADE_LEVEL')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_grade');
    }
};
