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
        Schema::create('m_relation_baa', function (Blueprint $table) {
            $table->increments('M_RELATION_BAA_ID')->primary()->unique();
            $table->integer('RELATION_BAA_ID')->nullable();
            $table->bigInteger('RELATION_ORGANIZATION_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_relation_baa');
    }
};
