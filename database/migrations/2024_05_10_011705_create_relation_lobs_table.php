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
        Schema::create('r_relation_lob', function (Blueprint $table) {
            $table->increments('RELATION_LOB_ID')->primary();
            $table->text('RELATION_LOB_NAME')->nullable();
            $table->longText('RELATION_LOB_DESC')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_relation_lob');
    }
};
