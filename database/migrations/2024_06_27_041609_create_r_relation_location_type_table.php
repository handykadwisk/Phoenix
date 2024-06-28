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
        Schema::create('r_relation_location_type', function (Blueprint $table) {
            $table->bigIncrements('RELATION_LOCATION_TYPE_ID')->unique()->primary();
            $table->string('RELATION_LOCATION_TYPE_NAME', 255)->nullable();
            $table->integer('RELATION_LOCATION_TYPE_ORDER')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_relation_location_type');
    }
};
