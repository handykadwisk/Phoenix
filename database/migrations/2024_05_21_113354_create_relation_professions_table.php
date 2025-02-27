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
        Schema::create('r_profession', function (Blueprint $table) {
            $table->bigIncrements('RELATION_PROFESSION_ID')->unique()->primary();
            $table->string('RELATION_PROFESSION_NAME')->nullable();
            $table->text('RELATION_PROFESSION_DESC')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_profession');
    }
};
