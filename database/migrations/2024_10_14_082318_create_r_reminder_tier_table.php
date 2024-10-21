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
        Schema::create('r_reminder_tier', function (Blueprint $table) {
            $table->bigIncrements('REMINDER_TIER_ID')->primary()->unique();
            $table->string('REMINDER_TIER_NAME', 255)->nullable();
            $table->bigInteger('REMINDER_TIER_CREATED_BY')->nullable();
            $table->dateTime('REMINDER_TIER_CREATED_DATE')->nullable();
            $table->bigInteger('REMINDER_TIER_UPDATED_BY')->nullable();
            $table->dateTime('REMINDER_TIER_UPDATED_DATE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_reminder_tier');
    }
};
