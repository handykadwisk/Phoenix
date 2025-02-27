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
        Schema::create('t_request_time_off_exception', function (Blueprint $table) {
            $table->increments('ID')->primary();
            $table->integer('EMPLOYEE_ID')->nullable();
            $table->integer('REQUEST_TO')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_request_time_off_exception');
    }
};
