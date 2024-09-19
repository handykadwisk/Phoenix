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
        Schema::create('r_reimburse_notes', function (Blueprint $table) {
            $table->increments('REIMBURSE_NOTES_ID')->primary();
            $table->string('REIMBURSE_NOTES_NAME')->nullable();
            $table->dateTime('REIMBURSE_NOTES_CREATED_AT')->nullable();
            $table->dateTime('REIMBURSE_NOTES_UPDATED_AT')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_reimburse_notes');
    }
};