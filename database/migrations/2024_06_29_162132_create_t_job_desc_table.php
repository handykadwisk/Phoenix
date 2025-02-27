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
        Schema::create('t_job_desc', function (Blueprint $table) {
            $table->bigIncrements('RELATION_JOBDESC_ID')->unique()->primary();
            $table->string('RELATION_JOBDESC_NAME')->nullable();
            $table->string('RELATION_JOBDESC_ALIAS')->nullable();
            $table->text('RELATION_JOBDESC_DESCRIPTION')->nullable();
            $table->unsignedBigInteger('RELATION_JOBDESC_PARENT_ID')->nullable();
            $table->bigInteger('RELATION_ORGANIZATION_ID')->nullable();
            $table->bigInteger('RELATION_JOBDESC_CREATED_BY')->nullable();
            $table->timestamp('RELATION_JOBDESC_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigInteger('RELATION_JOBDESC_UPDATED_BY')->nullable();
            $table->timestamp('RELATION_JOBDESC_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->string('RELATION_JOBDESC_MAPPING')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_job_desc');
    }
};
