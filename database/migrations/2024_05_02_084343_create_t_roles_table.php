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
        Schema::create('t_role', function (Blueprint $table) {
            $table->id();
            $table->string('role_name');
            $table->bigInteger('ROLE_CREATED_BY')->nullable();
            $table->timestamp('ROLE_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigInteger('ROLE_UPDATED_BY')->nullable();
            $table->timestamp('ROLE_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_role');
    }
};
