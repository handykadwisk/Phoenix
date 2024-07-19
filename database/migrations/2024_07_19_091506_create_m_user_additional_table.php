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
        Schema::create('m_user_additional', function (Blueprint $table) {
            $table->bigIncrements('user_additional_id')->unique()->primary();
            $table->unsignedBigInteger('user_id');
            $table->string('user_language');
            $table->integer('user_additional_created_by')->nullable();
            $table->timestamp('user_additional_created_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('user_additional_updated_by')->nullable();
            $table->timestamp('user_additional_updated_date')->nullable();
            $table->foreign('user_id')->references('id')->on('t_user')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_user_additional');
    }
};
