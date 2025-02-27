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
        Schema::create('m_endorsement_premium', function (Blueprint $table) {
           $table->increments('ENDORSEMENT_PREMIUM_ID')->primary();
            $table->unsignedInteger('ENDORSEMENT_ID')->nullable();
            $table->integer('CURRENCY_ID')->nullable();
            $table->decimal('SUM_INSURED',20,2)->nullable();
            $table->decimal('RATE',20,2)->nullable();
            $table->decimal('ADDITIONAL_PREMIUM',20,2)->nullable();
            $table->integer('CREATED_BY')->nullable();
            $table->timestamp('CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('UPDATED_BY')->nullable();
            $table->timestamp('UPDATED_DATE')->nullable();
            $table->foreign('ENDORSEMENT_ID')->references('ENDORSEMENT_ID')->on('t_endorsement')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_endorsement_premium');
    }
};
