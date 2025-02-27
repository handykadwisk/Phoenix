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
        Schema::rename('m_policy_initial_premium', 'm_policy_premium');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('m_policy_premium', function (Blueprint $table) {
            //
        });
    }
};
