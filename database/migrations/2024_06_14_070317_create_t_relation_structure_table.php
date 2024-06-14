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
        Schema::create('t_relation_structure', function (Blueprint $table) {
            $table->bigIncrements('RELATION_STRUCTURE_ID')->unique()->primary();
            $table->string('RELATION_STRUCTURE_NAME')->nullable();
            $table->string('RELATION_STRUCTURE_ALIAS')->nullable();
            $table->string('RELATION_STRUCTURE_DESCRIPTION')->nullable();
            $table->unsignedBigInteger('RELATION_STRUCTURE_PARENT_ID')->nullable();
            $table->unsignedBigInteger('RELATION_ORGANIZATION_ID')->nullable();
            $table->bigInteger('RELATION_STRUCTURE_CREATED_BY')->nullable();
            $table->timestamp('RELATION_STRUCTURE_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigInteger('RELATION_STRUCTURE_UPDATED_BY')->nullable();
            $table->timestamp('RELATION_STRUCTURE_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->string('RELATION_STRUCTURE_MAPPING')->nullable();
            $table->integer('RELATION_GRADE_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_relation_structure');
    }
};
