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
        Schema::table('t_user', function (Blueprint $table) {
            $table->unsignedBigInteger('jobpost_id')->nullable();
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('t_user', function (Blueprint $table) {
            // $table->dropForeign(['jobpost_id']);
            $table->dropColumn(['jobpost_id']);
        });
    }
};
