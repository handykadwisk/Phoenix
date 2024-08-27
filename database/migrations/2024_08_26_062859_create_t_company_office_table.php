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
        Schema::create('t_company_office', function (Blueprint $table) {
            $table->bigIncrements('COMPANY_OFFICE_ID')->unique()->primary();
            $table->string('COMPANY_OFFICE_NAME')->nullable();
            $table->string('COMPANY_OFFICE_ALIAS')->nullable();
            $table->text('COMPANY_OFFICE_DESCRIPTION')->nullable();
            $table->unsignedBigInteger('COMPANY_OFFICE_PARENT_ID')->nullable();
            $table->bigInteger('COMPANY_ID')->nullable();
            $table->bigInteger('COMPANY_OFFICE_CREATED_BY')->nullable();
            $table->timestamp('COMPANY_OFFICE_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigInteger('COMPANY_OFFICE_UPDATED_BY')->nullable();
            $table->timestamp('COMPANY_OFFICE_UPDATE_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->string('COMPANY_OFFICE_MAPPING')->nullable();
            $table->string('COMPANY_OFFICE_ADDRESS', 225)->nullable();
            $table->string('COMPANY_OFFICE_PHONENUMBER')->nullable();
            $table->string('COMPANY_OFFICE_PROVINCE', 225)->nullable();
            $table->string('COMPANY_OFFICE_REGENCY', 225)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_company_office');
    }
};
