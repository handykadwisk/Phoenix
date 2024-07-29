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
        Schema::create('t_person_education', function (Blueprint $table) {
            $table->bigIncrements('PERSON_EDUCATION_ID')->unique()->primary();
            $table->unsignedBigInteger('PERSON_ID')->nullable();
            $table->date('PERSON_EDUCATION_START')->nullable();
            $table->date('PERSON_EDUCATION_END')->nullable();
            $table->unsignedBigInteger('EDUCATION_DEGREE_ID')->nullable();
            $table->string('PERSON_EDUCATION_MAJOR', 255)->nullable();
            $table->string('PERSON_EDUCATION_SCHOOL', 255)->nullable();
            $table->bigInteger('PERSON_EDUCATION_CREATED_BY')->nullable();
            $table->timestamp('PERSON_EDUCATION_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_person_education');
    }
};
