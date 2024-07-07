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
        Schema::create('t_permission', function (Blueprint $table) {
            $table->bigIncrements('PERMISSION_ID')->unique()->primary();
            $table->string('PERMISSION_NAME')->nullable();
            $table->string('PERMISSION_CLASS_NAME')->nullable();
            $table->bigInteger('PERMISSION_CREATED_BY')->nullable();
            $table->timestamp('PERMISSION_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigInteger('PERMISSION_UPDATED_BY')->nullable();
            $table->timestamp('PERMISSION_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->string('PERMISSION_FLAG')->nullable();
            $table->bigInteger('PERMISSION_DELETED_BY')->nullable();
            $table->timestamp('PERMISSION_DELETED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_permission');
    }
};
