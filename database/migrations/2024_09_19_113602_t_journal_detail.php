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
        Schema::create('t_journal_detail', function (Blueprint $table) {
            $table->increments('JOURNAL_DETAIL_ID')->primary();
            $table->bigInteger('JOURNAL_ID');
            $table->string('JOURNAL_DETAIL_COA_CODE');
            $table->string('JOURNAL_DETAIL_DESC');
            $table->smallInteger('JOURNAL_DETAIL_CURRENCY_ID');
            $table->decimal('JOURNAL_DETAIL_ORIG', 18, 2);
            $table->decimal('JOURNAL_DETAIL_EX_RATE', 10, 2);
            $table->decimal('JOURNAL_DETAIL_SUM', 18, 2);
            $table->smallInteger('JOURNAL_DETAIL_TYPE');
            $table->integer('JOURNAL_DETAIL_CREATED_BY');
            $table->dateTime('JOURNAL_DETAIL_CREATED_AT');
            $table->integer('JOURNAL_DETAIL_UPDATED_BY');
            $table->dateTime('JOURNAL_DETAIL_UPDATED_AT');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_journal_detail');
    }
};