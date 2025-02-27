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
        Schema::create('m_policy_insured', function (Blueprint $table) {
            $table->increments('POLICY_INSURED_ID')->primary();
            $table->unsignedInteger('POLICY_ID')->nullable();
            $table->string('POLICY_INSURED_NAME')->nullable();
            $table->foreign('POLICY_ID')->references('POLICY_ID')->on('t_policy')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_policy_insured');
    }
};
