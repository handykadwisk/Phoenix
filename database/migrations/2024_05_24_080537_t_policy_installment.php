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
        Schema::create('t_policy_installment', function (Blueprint $table) {
            $table->increments('POLICY_INSTALLMENT_ID')->primary();
            $table->integer('POLICY_ID');
            $table->integer('POLICY_INSTALLMENT_TERM')->nullable();
            $table->decimal('POLICY_INSTALLMENT_PERCENTAGE',20,2)->nullable();
            $table->date('INSTALLMENT_DUE_DATE')->nullable();
            $table->decimal('POLICY_INSTALLMENT_AMOUNT',20,2)->nullable();

            // $table->foreign('POLICY_ID')->references('POLICY_ID')->on('t_policy');
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
