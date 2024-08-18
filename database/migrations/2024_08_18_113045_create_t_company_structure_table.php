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
        Schema::create('t_company_structure', function (Blueprint $table) {
            $table->bigIncrements('COMPANY_STRUCTURE_ID')->unique()->primary();
            $table->string('COMPANY_STRUCTURE_NAME')->nullable();
            $table->string('COMPANY_STRUCTURE_ALIAS')->nullable();
            $table->string('COMPANY_STRUCTURE_DESCRIPTION')->nullable();
            $table->unsignedBigInteger('COMPANY_STRUCTURE_PARENT_ID')->nullable();
            $table->unsignedBigInteger('COMPANY_ID')->nullable();
            $table->bigInteger('COMPANY_STRUCTURE_CREATED_BY')->nullable();
            $table->timestamp('COMPANY_STRUCTURE_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigInteger('COMPANY_STRUCTURE_UPDATED_BY')->nullable();
            $table->timestamp('COMPANY_STRUCTURE_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->string('COMPANY_STRUCTURE_MAPPING')->nullable();
            $table->integer('COMPANY_GRADE_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_company_structure');
    }
};
