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
        Schema::create('m_role_users', function (Blueprint $table) {
            $table->increments('role_user_id')->primary();
            $table->foreignId('role_id')->references('id')->on('t_role')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('t_user')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_role_users');
    }
};
