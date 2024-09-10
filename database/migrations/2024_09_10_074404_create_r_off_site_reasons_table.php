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
        Schema::create('r_off_site_reason', function (Blueprint $table) {
            $table->increments('OFF_SITE_REASON_ID')->primary();
            $table->string('OFF_SITE_REASON_NAME', 255)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_off_site_reason');
    }
};
