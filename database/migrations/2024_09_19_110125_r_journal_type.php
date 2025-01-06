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
        Schema::create('r_journal_type', function (Blueprint $table) {
            $table->increments('JOURNAL_TYPE_ID')->primary();
            $table->string('JOURNAL_TYPE_CODE');
            $table->string('JOURNAL_TYPE_DESC');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_journal_type');
    }
};