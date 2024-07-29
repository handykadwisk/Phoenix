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
        Schema::create('t_person_certificate', function (Blueprint $table) {
            $table->bigIncrements('PERSON_CERTIFICATE_ID')->unique()->primary();
            $table->unsignedBigInteger('PERSON_ID')->nullable();
            $table->string('PERSON_CERTIFICATE_NAME', 255)->nullable();
            $table->integer('PERSON_CERTIFICATE_IS_QUALIFICATION')->nullable()->comment("0. no, 1.yes");
            $table->integer('CERTIFICATE_QUALIFICATION_ID')->nullable();
            $table->integer('PERSON_CERTIFICATE_POINT')->nullable();
            $table->date('PERSON_CERTIFICATE_START_DATE')->nullable();
            $table->date('PERSON_CERTIFICATE_EXPIRES_DATE')->nullable();
            $table->bigInteger('PERSON_CERTIFICATE_CREATED_BY')->nullable();
            $table->timestamp('PERSON_CERTIFICATE_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->bigInteger('PERSON_CERTIFICATE_UPDATED_BY')->nullable();
            $table->timestamp('PERSON_CERTIFICATE_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('PERSON_CERTIFICATE_IS_DELETED')->nullable()->comment("0. ACTIVE 1. INACTIVE");
            $table->integer('PERSON_DOCUMENT_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_person_certificate');
    }
};
