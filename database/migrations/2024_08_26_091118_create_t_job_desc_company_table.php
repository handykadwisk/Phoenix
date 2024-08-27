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
        Schema::create('t_job_desc_company', function (Blueprint $table) {
            $table->bigIncrements('COMPANY_JOBDESC_ID')->unique()->primary();
            $table->string('COMPANY_JOBDESC_NAME')->nullable();
            $table->string('COMPANY_JOBDESC_ALIAS')->nullable();
            $table->text('COMPANY_JOBDESC_DESCRIPTION')->nullable();
            $table->unsignedBigInteger('COMPANY_JOBDESC_PARENT_ID')->nullable();
            $table->bigInteger('COMPANY_ID')->nullable();
            $table->bigInteger('COMPANY_JOBDESC_CREATED_BY')->nullable();
            $table->timestamp('COMPANY_JOBDESC_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigInteger('COMPANY_JOBDESC_UPDATED_BY')->nullable();
            $table->timestamp('COMPANY_JOBDESC_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->string('COMPANY_JOBDESC_MAPPING')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_job_desc_company');
    }
};
