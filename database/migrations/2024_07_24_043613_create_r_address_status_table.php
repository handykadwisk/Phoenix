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
        Schema::create('r_address_status', function (Blueprint $table) {
            $table->bigIncrements('ADDRESS_STATUS_ID')->unique()->primary();
            $table->string('ADDRESS_STATUS_NAME', 15)->nullable();
            $table->text('ADDRESS_STATUS_DESCRIPTION')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_address_status');
    }
};
