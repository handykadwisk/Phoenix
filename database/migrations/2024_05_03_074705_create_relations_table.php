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
        Schema::create('t_relation', function (Blueprint $table) {
            $table->increments('RELATION_ID')->primary();
            $table->string('RELATION_NAME')->nullable();
            $table->unsignedBigInteger('RELATION_PARENT_ID')->nullable();
            $table->string('RELATION_ABBREVIATION')->nullable();
            $table->string('RELATION_AKA')->nullable();
            $table->unsignedBigInteger('RELATION_GROUP_ID')->nullable();
            $table->string('RELATION_MAPPING_ID')->nullable();
            $table->string('RELATION_IS_MANAGED_HR')->nullable();
            $table->string('RELATION_CREATED_BY')->nullable();
            $table->string('RELATION_UPDATE_BY')->nullable();
            $table->timestamp('RELATION_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('RELATION_UPDATED_DATE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_relation');
    }
};
