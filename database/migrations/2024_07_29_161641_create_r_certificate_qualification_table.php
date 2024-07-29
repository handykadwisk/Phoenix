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
        Schema::create('r_certificate_qualification', function (Blueprint $table) {
            $table->bigIncrements('CERTIFICATE_QUALIFICATION_ID')->unique()->primary();
            $table->string('CERTIFICATE_QUALIFICATION_NAME', 255)->nullable();
            $table->integer('CERTIFICATE_QUALIFICATION_RENEWAL_BY')->nullable()->comment("1. POINT | 2. EXP DATE");
            $table->integer('CERTIFICATE_QUALIFICATION_MAX_POINT')->nullable();
            $table->integer('CERTIFICATE_QUALIFICATION_LEVEL')->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_certificate_qualification');
    }
};
