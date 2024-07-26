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
        Schema::table('m_policy_insured_detail', function (Blueprint $table) {
            $table->unsignedInteger('CURRENCY_ID')->nullable();
            $table->foreign('CURRENCY_ID')->references('CURRENCY_ID')->on('r_currency')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
