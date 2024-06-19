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
        Schema::create('t_relation_office', function (Blueprint $table) {
            $table->bigIncrements('RELATION_OFFICE_ID')->unique()->primary();
            $table->string('RELATION_OFFICE_NAME')->nullable();
            $table->string('RELATION_OFFICE_ALIAS')->nullable();
            $table->text('RELATION_OFFICE_DESCRIPTION')->nullable();
            $table->unsignedBigInteger('RELATION_OFFICE_PARENT_ID')->nullable();
            $table->bigInteger('RELATION_ORGANIZATION_ID')->nullable();
            $table->bigInteger('RELATION_OFFICE_CREATED_BY')->nullable();
            $table->timestamp('RELATION_OFFICE_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigInteger('RELATION_OFFICE_UPDATED_BY')->nullable();
            $table->timestamp('RELATION_OFFICE_UPDATE_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->string('RELATION_OFFICE_MAPPING')->nullable();
            $table->string('RELATION_OFFICE_ADDRESS', 225)->nullable();
            $table->string('RELATION_OFFICE_PROVINCE', 225)->nullable();
            $table->string('RELATION_OFFICE_REGENCY', 225)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_relation_office');
    }
};
