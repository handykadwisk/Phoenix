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
        Schema::create('t_tag', function (Blueprint $table) {
            $table->bigIncrements('TAG_ID')->unique()->primary();
            $table->string('TAG_NAME')->nullable();
            $table->bigInteger('TAG_CREATED_BY')->nullable();
            $table->timestamp('TAG_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable();
            $table->bigInteger('TAG_UPDATED_BY')->nullable();
            $table->timestamp('TAG_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_tag');
    }
};
