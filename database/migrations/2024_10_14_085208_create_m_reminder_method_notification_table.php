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
        Schema::create('m_reminder_method_notification', function (Blueprint $table) {
            $table->bigIncrements('M_REMINDER_METHOD_NOTIFICATION_ID')->unique()->primary();
            $table->bigInteger('REMINDER_ID')->nullable();
            $table->bigInteger('METHOD_NOTIFICATION_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_reminder_method_notification');
    }
};
