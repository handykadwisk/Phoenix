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
            $table->increments('CASH_ADVANCE_DETAIL_ID');
            $table->smallInteger('CASH_ADVANCE_ID')->nullable();
            $table->date('CASH_ADVANCE_DETAIL_START_DATE')->nullable();
            $table->date('CASH_ADVANCE_DETAIL_END_DATE')->nullable();
            $table->text('CASH_ADVANCE_DETAIL_PURPOSE')->nullable();
            $table->text('CASH_ADVANCE_DETAIL_LOCATION')->nullable();
            $table->smallInteger('CASH_ADVANCE_DETAIL_RELATION_ORGANIZATION_ID')->nullable();
            $table->string('CASH_ADVANCE_DETAIL_RELATION_NAME')->nullable();
            $table->string('CASH_ADVANCE_DETAIL_RELATION_POSITION')->nullable();
            $table->decimal('CASH_ADVANCE_DETAIL_AMOUNT', 16, 2)->nullable();
            $table->boolean('CASH_ADVANCE_DETAIL_STATUS')->nullable();
            $table->string('CASH_ADVANCE_DETAIL_DOCUMENT_ID')->nullable();
            $table->text('CASH_ADVANCE_DETAIL_NOTE')->nullable();
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