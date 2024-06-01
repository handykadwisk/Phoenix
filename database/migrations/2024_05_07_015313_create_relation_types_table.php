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
        Schema::create('r_relation_type', function (Blueprint $table) {
            $table->bigIncrements('RELATION_TYPE_ID')->unique()->primary();
            $table->string('RELATION_TYPE_NAME')->nullable();
            $table->longText('RELATION_TYPE_DESCRIPTION')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_relation_type');
    }
};
