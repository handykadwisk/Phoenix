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
            $table->increments('TAG_RELATION_ID');
            $table->unsignedBigInteger('TAG_ID')->nullable();
            $table->unsignedBigInteger('RELATION_ORGANIZATION_ID')->nullable();
            $table->foreign('TAG_ID')->references('TAG_ID')->on('t_tag')->onDelete('cascade');
            $table->foreign('RELATION_ORGANIZATION_ID')->references('RELATION_ORGANIZATION_ID')->on('t_relation')->onDelete('cascade');
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
