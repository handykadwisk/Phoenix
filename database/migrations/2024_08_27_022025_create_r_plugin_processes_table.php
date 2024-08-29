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
        Schema::create('r_plugin_process', function (Blueprint $table) {
            $table->bigIncrements('PLUGIN_PROCESS_ID')->unique()->primary();
            $table->string('PLUGIN_PROCESS_NAME', 255)->nullable();
            $table->string('PLUG_PROCESS_CLASS', 255)->nullable();
            $table->text('PLUGIN_PROCESS_DESCRIPTION')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_plugin_process');
    }
};
