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
        Schema::create('t_relation_division', function (Blueprint $table) {
            $table->bigIncrements('RELATION_DIVISION_ID')->unique()->primary();
            $table->string('RELATION_DIVISION_NAME')->nullable();
            $table->string('RELATION_DIVISION_ALIAS')->nullable();
            $table->string('RELATION_DIVISION_INITIAL')->nullable();
            $table->text('RELATION_DIVISION_DESCRIPTION')->nullable();
            $table->unsignedBigInteger('RELATION_DIVISION_PARENT_ID')->nullable();
            $table->bigInteger('RELATION_ORGANIZATION_ID')->nullable();
            $table->string('RELATION_DIVISION_MAPPING')->nullable();
            $table->bigInteger('RELATION_DIVISION_CREATED_BY')->nullable();
            $table->timestamp('RELATION_DIVISION_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigInteger('RELATION_DIVISION_UPDATED_BY')->nullable();
            $table->timestamp('RELATION_DIVISION_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_relation_division');
    }
};
