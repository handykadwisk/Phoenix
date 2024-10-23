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
        Schema::create('t_expenses_detail', function (Blueprint $table) {
            $table->increments('EXPENSES_DETAIL_ID');
            $table->smallInteger('EXPENSES_ID')->nullable();
            $table->date('EXPENSES_DETAIL_DUE_DATE')->nullable();
            $table->smallInteger('EXPENSES_DETAIL_TYPE')->nullable();
            $table->smallInteger('EXPENSES_DETAIL_CURRENCY')->nullable();
            $table->decimal('EXPENSES_DETAIL_AMOUNT_VALUE', 16, 2)->nullable();
            $table->smallInteger('EXPENSES_DETAIL_RELATION_ORGANIZATION_ID')->nullable();
            $table->string('EXPENSES_DETAIL_REFF_NUMBER')->nullable();
            $table->text('EXPENSES_DETAIL_DESCRIPTION')->nullable();
            $table->smallInteger('EXPENSES_DETAIL_APPROVAL')->nullable();
            $table->smallInteger('EXPENSES_DETAIL_COST_CLASSIFICATION')->nullable();
            $table->decimal('EXPENSES_DETAIL_AMOUNT_VALUE_APPROVE', 16, 2)->nullable();
            $table->text('EXPENSES_DETAIL_REMARKS')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_expenses_detail');
    }
};