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
        Schema::create('r_loss_limit_scale', function (Blueprint $table) {
            $table->increments('LOSS_LIMIT_ID')->primary();
            $table->decimal('LOSS_LIMIT_PERCENTAGE', 5, 2)->nullable();
            $table->decimal('PREMIUM_SCALE_PERCENTAGE', 5, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_loss_limit_scale');
    }
};
