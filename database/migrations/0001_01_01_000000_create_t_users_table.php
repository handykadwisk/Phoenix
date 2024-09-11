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
        Schema::create('t_user', function (Blueprint $table) {
            $table->id();
            $table->smallInteger('employee_id')->nullable();
            $table->smallInteger('relation_status_id')->nullable();
            $table->string('user_login')->unique()->nullable();
            $table->string('name');
            $table->foreignId('user_type_id')->nullable();
            $table->string('password');
            // $table->string('email')->unique()->nullable();
            // $table->foreignId('role_id')->nullable();
            $table->smallInteger('user_status')->default(1);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_user');
        Schema::dropIfExists('sessions');
    }
};