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
        Schema::create('r_coa', function (Blueprint $table) {
            $table->increments('COA_ID')->primary();
            $table->string('COA_CODE')->nullable();
            $table->string('COA_CODE_PARENT')->nullable();
            $table->string('COA_GROUP_CODE')->nullable();
            $table->integer('CURRENCY_ID')->nullable();
            $table->string('COA_TITLE')->nullable();
            $table->tinyInteger('COA_TYPE')->nullable();
            $table->string('COA_CREATED_BY')->nullable();
            $table->dateTime('COA_CREATED_DATE')->nullable();
            $table->string('COA_LAST_UPDATE_BY')->nullable();
            $table->dateTime('COA_LAST_UPDATE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_coa');
    }
};
