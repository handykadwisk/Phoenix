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
        Schema::table('m_policy_initial_premium', function (Blueprint $table) {
            $table->decimal('SUM_INSURED',20,2)->nullable()->change();
            $table->decimal('RATE',20,2)->nullable()->change();
            $table->decimal('INITIAL_PREMIUM',20,2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
