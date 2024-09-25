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
        Schema::create('m_pin_chat_detail', function (Blueprint $table) {
            $table->bigIncrements('PIN_CHAT_DETAIL_ID')->unique()->primary();
            $table->bigInteger('PIN_CHAT_DETAIL')->nullable();
            $table->bigInteger('CHAT_DETAIL_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_pin_chat_detail');
    }
};
