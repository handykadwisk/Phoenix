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
        Schema::create('r_method_notification', function (Blueprint $table) {
            $table->bigIncrements('METHOD_NOTIFICATION_ID')->unique()->primary();
            $table->string('METHOD_NOTIFICATION_NAME', 255)->nullable();
            $table->bigInteger('METHOD_NOTIFICATION_CREATED_BY')->nullable();
            $table->dateTime('METHOD_NOTIFICATION_CREATED_DATE')->nullable();
            $table->bigInteger('METHOD_NOTIFICATION_UPDATED_BY')->nullable();
            $table->dateTime('METHOD_NOTIFICATION_UPDATED_DATE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_method_notification');
    }
};
