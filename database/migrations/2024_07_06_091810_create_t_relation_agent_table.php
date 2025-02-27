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
        Schema::create('t_relation_agent', function (Blueprint $table) {
            $table->increments('RELATION_AGENT_ID')->primary()->unique();
            $table->string('RELATION_AGENT_NAME')->nullable();
            $table->string('RELATION_AGENT_DESCRIPTION')->nullable();
            $table->bigInteger('RELATION_AGENT_CREATED_BY')->nullable();
            $table->timestamp('RELATION_AGENT_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->bigInteger('RELATION_AGENT_UPDATED_BY')->nullable();
            $table->timestamp('RELATION_AGENT_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->bigInteger('RELATION_AGENT_PARENT')->nullable();
            $table->string('RELATION_AGENT_ALIAS')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_relation_agent');
    }
};
