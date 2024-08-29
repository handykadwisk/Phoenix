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
        Schema::create('t_tag_plugin_process', function (Blueprint $table) {
            $table->bigIncrements('TAG_PLUGIN_PROCESS_ID')->unique()->primary();
            $table->string('TAG_ID', 255)->nullable();
            $table->bigInteger('PLUGIN_PROCESS_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_tag_plugin_process');
    }
};
