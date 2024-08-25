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
        Schema::create('t_employee_education', function (Blueprint $table) {
            $table->bigIncrements('EMPLOYEE_EDUCATION_ID')->unique()->primary();
            $table->unsignedBigInteger('EMPLOYEE_ID')->nullable();
            $table->date('EMPLOYEE_EDUCATION_START')->nullable();
            $table->date('EMPLOYEE_EDUCATION_END')->nullable();
            $table->unsignedBigInteger('EDUCATION_DEGREE_ID')->nullable();
            $table->string('EMPLOYEE_EDUCATION_MAJOR', 255)->nullable();
            $table->string('EMPLOYEE_EDUCATION_SCHOOL', 255)->nullable();
            $table->bigInteger('EMPLOYEE_EDUCATION_CREATED_BY')->nullable();
            $table->timestamp('EMPLOYEE_EDUCATION_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_employee_education');
    }
};
