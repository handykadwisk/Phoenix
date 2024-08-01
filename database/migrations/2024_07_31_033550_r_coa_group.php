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
        Schema::create('r_coa_group', function (Blueprint $table) {
            $table->increments('COA_GROUP_ID')->primary();
            $table->string('COA_GROUP_CODE')->nullable();
            $table->string('COA_GROUP_PARENT')->nullable();
            $table->integer('COA_CLASS_ID')->nullable();
            $table->string('COA_GROUP_TITLE')->nullable();
            $table->string('COA_GROUP_CREATED_BY')->nullable();
            $table->dateTime('COA_GROUP_CREATED_DATE')->nullable();
            $table->string('COA_GROUP_LAST_UPDATE_BY')->nullable();
            $table->dateTime('COA_GROUP_LAST_UPDATE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_coa_group');
    }
};
