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
        Schema::create('m_endorsement_installment', function (Blueprint $table) {
            $table->increments('ENDORSEMENT_INSTALLMENT_ID')->primary();
            $table->unsignedInteger('ENDORSEMENT_ID');
            $table->integer('ENDORSEMENT_INSTALLMENT_TERM')->nullable();
            $table->decimal('ENDORSEMENT_INSTALLMENT_RATE',20,2)->nullable();
            $table->date('ENDORSEMENT_INSTALLMENT_DUE_DATE')->nullable();
            $table->decimal('ENDORSEMENT_INSTALLMENT_AMOUNT',20,2)->nullable();

            $table->foreign('ENDORSEMENT_ID')->references('ENDORSEMENT_ID')->on('t_endorsement');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_endorsement_installment');
    }
};
