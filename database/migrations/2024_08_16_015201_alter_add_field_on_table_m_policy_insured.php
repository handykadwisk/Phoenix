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
        Schema::table('m_policy_insured', function (Blueprint $table) {
            $table->decimal('DISC_ADMIN_COST_PERCENTAGE',20,2)->default(0);
            $table->decimal('DISC_ADMIN_COST_AMOUNT',20,2)->default(0);
            $table->decimal('ADMIN_COST_NETT_AMOUNT',20,2)->default(0);
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
