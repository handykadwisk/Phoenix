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
        Schema::create('r_time_off_type', function (Blueprint $table) {
            $table->increments('TIME_OFF_TYPE_ID')->primary();
            $table->string('TIME_OFF_TYPE_NAME', 255)->nullable();
            $table->integer('TIME_OFF_TYPE_IS_NEED_DOCUMENT')->default(0)->comment('0:No, 1:Yes')->nullable();
            $table->integer('TIME_OFF_TYPE_IS_NOT_REDUCE_LEAVE')->default(0)->comment('0:No, 1:Yes')->nullable();
            $table->integer('TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_MONTH')->comment('month(s)')->nullable();
            $table->integer('TIME_OFF_TYPE_NOT_REDUCE_LEAVE_BY_DAY')->comment('Day(s)')->nullable();
            $table->string('TIME_OFF_TYPE_NOTE', 255)->nullable();
            $table->integer('TIME_OFF_TYPE_IS_ACTIVE')->default(0)->comment('0: YES,1: NO')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_time_off_type');
    }
};
