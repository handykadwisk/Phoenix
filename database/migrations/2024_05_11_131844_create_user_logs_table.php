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
        Schema::create('t_user_log', function (Blueprint $table) {
            $table->id();
            $table->integer('created_by');
            $table->timestamp('created_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->text('action');
            $table->string('action_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_user_log');
    }
};
