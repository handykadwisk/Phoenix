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
        Schema::create('r_insurance_type', function (Blueprint $table) {
            // $table->id();
            // $table->timestamps();
            $table->increments('INSURANCE_TYPE_ID')->primary();
            $table->string('INSURANCE_TYPE_NAME')->nullable();
            $table->string('INSURANCE_TYPE_INITIAL')->nullable();
            $table->text('INSURANCE_TYPE_DESCRIPTION')->nullable();
            $table->smallInteger('INSURANCE_TYPE_STATUS')->nullable();
            $table->integer('INSURANCE_TYPE_CREATED_BY')->nullable();
            $table->dateTime('INSURANCE_TYPE_CREATE_DATE')->nullable();
            $table->integer('INSURANCE_TYPE_UPDATED_BY')->nullable();
            $table->dateTime('INSURANCE_TYPE_UPDATED_DATE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_insurance_type');
    }
};
