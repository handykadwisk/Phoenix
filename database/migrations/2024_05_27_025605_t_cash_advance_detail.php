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
        Schema::create('t_cash_advance_detail', function (Blueprint $table) {
            $table->increments('EXPENSES_DETAIL_ID');
            $table->smallInteger('EXPENSES_ID')->nullable();
            $table->date('EXPENSES_DETAIL_DATE')->nullable();
            $table->text('EXPENSES_DETAIL_PURPOSE')->nullable();
            $table->text('EXPENSES_DETAIL_LOCATION')->nullable();
            $table->smallInteger('RELATION_ORGANIZATION_ID')->nullable();
            $table->string('EXPENSES_DETAIL_RELATION_NAME')->nullable();
            $table->string('EXPENSES_DETAIL_RELATION_POSITION')->nullable();
            $table->decimal('EXPENSES_DETAIL_AMOUNT', 16, 2)->nullable();
            $table->boolean('EXPENSES_DETAIL_STATUS')->nullable();
            $table->string('EXPENSES_DETAIL_DOCUMENT_ID')->nullable();
            $table->text('EXPENSES_DETAIL_NOTE')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_cash_advance_detail');
    }
};