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
        Schema::create('t_company_division', function (Blueprint $table) {
            $table->bigIncrements('COMPANY_DIVISION_ID')->unique()->primary();
            $table->string('COMPANY_DIVISION_NAME')->nullable();
            $table->string('COMPANY_DIVISION_ALIAS')->nullable();
            $table->string('COMPANY_DIVISION_INITIAL')->nullable();
            $table->text('COMPANY_DIVISION_DESCRIPTION')->nullable();
            $table->unsignedBigInteger('COMPANY_DIVISION_PARENT_ID')->nullable();
            $table->bigInteger('COMPANY_ID')->nullable();
            $table->string('COMPANY_DIVISION_MAPPING')->nullable();
            $table->bigInteger('COMPANY_DIVISION_CREATED_BY')->nullable();
            $table->timestamp('COMPANY_DIVISION_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigInteger('COMPANY_DIVISION_UPDATED_BY')->nullable();
            $table->timestamp('COMPANY_DIVISION_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_company_division');
    }
};
