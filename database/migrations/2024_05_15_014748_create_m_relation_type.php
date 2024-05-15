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
        Schema::create('m_relation_type', function (Blueprint $table) {
            $table->increments('RELATION_ORGANIZATION_TYPE_ID')->primary();
            $table->integer('RELATION_ORGANIZATION_ID')->nullable();
            $table->integer('RELATION_TYPE_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_relation_type');
    }
};
