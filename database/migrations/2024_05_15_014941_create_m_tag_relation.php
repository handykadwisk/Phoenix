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
        Schema::create('m_tag_relation', function (Blueprint $table) {
            $table->increments('TAG_RELATION_ID')->primary();
            $table->bigInteger('TAG_ID')->nullable();
            $table->bigInteger('RELATION_ORGANIZATION_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_tag_relation');
    }
};
