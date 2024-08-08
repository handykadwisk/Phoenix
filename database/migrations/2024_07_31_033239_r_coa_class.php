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
        Schema::create('r_coa_class', function (Blueprint $table) {
            $table->increments('ID_COA_CLASS')->primary();
            $table->integer('COA_CLASS_ID')->nullable();
            $table->string('COA_CLASS_TITLE')->nullable();
            $table->integer('COA_CLASS_TYPE')->nullable()->comment('1: Assets\r\n2: Liabilities\r\n3: Equities\r\n4: Income\r\n5: Cost\r\n6: Expense');
            $table->string('COA_CLASS_CREATED_BY')->nullable();
            $table->dateTime('COA_CLASS_CREATED_DATE')->nullable();
            $table->string('COA_CLASS_LAST_UPDATE_BY')->nullable();
            $table->dateTime('COA_CLASS_LAST_UPDATE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_coa_class');
    }
};
