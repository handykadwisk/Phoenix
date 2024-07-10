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
        Schema::create('r_salutation', function (Blueprint $table) {
            $table->increments('salutation_id')->primary();
            $table->string('salutation_name')->nullable();
            $table->string('salutation_desc')->nullable();
            $table->integer('relation_status_id')->nullable();
            $table->smallInteger('salutation_profession')->nullable()->comment("Pre = 1, Post = 2");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_salutation');
    }
};
