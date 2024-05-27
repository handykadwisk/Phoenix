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
        Schema::create('t_cash_advance', function (Blueprint $table) {
            $table->increments('CA_ID')->primary();
            $table->string('CA_NUMBER')->nullable();
            $table->smallInteger('REQUEST_BY');
            $table->smallInteger('USER_BY');
            $table->string('DIVISION');
            $table->date('REQUEST_DATE');
            $table->smallInteger('APPROVE_BY');
            $table->text('NOTE');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_cash_advance');
    }
};