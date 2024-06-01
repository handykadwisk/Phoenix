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
        Schema::create('m_relation_aka', function (Blueprint $table) {
            $table->increments('RELATION_AKA_ID');
            $table->unsignedBigInteger('RELATION_ORGANIZATION_ID');
            $table->string('RELATION_AKA_NAME');
            $table->foreign('RELATION_ORGANIZATION_ID')->references('RELATION_ORGANIZATION_ID')->on('t_relation')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_relation_aka');
    }
};
