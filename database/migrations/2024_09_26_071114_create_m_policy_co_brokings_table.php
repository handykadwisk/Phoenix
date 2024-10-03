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
        Schema::create('m_policy_co_broking', function (Blueprint $table) {
            $table->increments('CO_BROKING_ID')->primary();
            $table->integer('POLICY_ID')->nullable();
            $table->integer('RELATION_ID')->nullable();
            $table->decimal('CO_BROKING_PERCENTAGE', 10, 2)->nullable();
            $table->tinyInteger('CO_BROKING_IS_LEADER')->comment('0:No, 1:Yes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_policy_co_broking');
    }
};
