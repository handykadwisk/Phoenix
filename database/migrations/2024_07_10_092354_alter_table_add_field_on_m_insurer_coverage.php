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
        Schema::table('m_insurer_coverage', function (Blueprint $table) {
            $table->integer('POLICY_COVERAGE_ID')->after('CURRENCY_ID')->nullable();
            $table->decimal('BROKERAGE_FEE',20,2)->default(0);
            $table->decimal('CONSULTANCY_FEE',20,2)->default(0);
            $table->decimal('ENGINEERING_FEE',20,2)->default(0);
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
