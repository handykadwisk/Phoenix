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
            $table->increments('RELATION_ORGANIZATION_TYPE_ID');
            $table->unsignedBigInteger('RELATION_ORGANIZATION_ID');
            $table->unsignedBigInteger('RELATION_TYPE_ID');
            $table->foreign('RELATION_ORGANIZATION_ID')->references('RELATION_ORGANIZATION_ID')->on('t_relation')->onDelete('cascade');
            $table->foreign('RELATION_TYPE_ID')->references('RELATION_TYPE_ID')->on('t_relation_type')->onDelete('cascade');
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
