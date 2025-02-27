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
        Schema::create('m_employee_document', function (Blueprint $table) {
            $table->bigIncrements('M_EMPLOYEE_DOCUMENT_ID')->unique()->primary();
            $table->unsignedBigInteger('EMPLOYEE_ID')->nullable();
            $table->unsignedBigInteger('DOCUMENT_ID')->nullable();
            $table->unsignedBigInteger('CATEGORY_DOCUMENT')->nullable()->comment("1 = KTP, 2 = Other Document");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_employee_document');
    }
};
