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
        Schema::create('t_journal', function (Blueprint $table) {
            $table->increments('JOURNAL_ID')->primary();
            $table->string('JOURNAL_NUMBER')->nullable();
            $table->string('JOURNAL_TYPE_CODE')->nullable();
            $table->date('JOURNAL_DATE')->nullable();
            $table->text('JOURNAL_MEMO')->nullable();
            $table->smallInteger('JOURNAL_IS_POSTED')->nullable();
            $table->string('JOURNAL_POSTED_BY')->nullable();
            $table->dateTime('JOURNAL_POSTED_AT')->nullable();
            $table->integer('JOURNAL_CREATED_BY')->nullable();
            $table->dateTime('JOURNAL_CREATED_AT')->nullable();
            $table->string('JOURNAL_UPDATED_BY')->nullable();
            $table->dateTime('JOURNAL_UPDATED_AT')->nullable();
            $table->integer('TEMP')->nullable();
            $table->string('JOURNAL_NOTES')->nullable();
            $table->tinyInteger('JOURNAL_IS_DELETED')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_journal');
    }
};