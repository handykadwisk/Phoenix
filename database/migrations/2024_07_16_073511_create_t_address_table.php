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
        Schema::create('t_address', function (Blueprint $table) {
            $table->bigIncrements('ADDRESS_ID')->unique()->primary();
            $table->bigInteger('ADDRESS_CATEGORY')->nullable()->comment("1. Person");
            $table->bigInteger('ADDRESS_LOCATION_TYPE')->nullable()->comment("1. KTP 2. DOMISILI 3. Other");
            $table->text('ADDRESS_DETAIL')->nullable();
            $table->string('ADDRESS_RT_NUMBER', 255)->nullable();
            $table->string('ADDRESS_RW_NUMBER', 255)->nullable();
            $table->string('ADDRESS_VILLAGE', 255)->nullable();
            $table->string('ADDRESS_DISTRICT', 255)->nullable();
            $table->string('ADDRESS_PROVINCE', 255)->nullable();
            $table->string('ADDRESS_REGENCY', 255)->nullable();
            $table->bigInteger('ADDRESS_STATUS')->nullable()->comment('jika ADDRESS_LOCATION_TYPE = 1{null} | ADDRESS_LOCATION_TYPE != 1{1.current 2. past 3. family }');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_address');
    }
};
