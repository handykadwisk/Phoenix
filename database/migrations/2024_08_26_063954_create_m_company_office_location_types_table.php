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
        Schema::create('m_company_office_location_type', function (Blueprint $table) {
            $table->bigIncrements('M_COMPANY_OFFICE_LOCATION_TYPE_ID')->unique()->primary();
            $table->unsignedBigInteger('COMPANY_OFFICE_ID')->nullable();
            $table->unsignedBigInteger('LOCATION_TYPE_ID')->nullable();
            $table->foreign('COMPANY_OFFICE_ID')->references('COMPANY_OFFICE_ID')->on('t_company_office')->onDelete('cascade');
            $table->foreign('LOCATION_TYPE_ID')->references('RELATION_LOCATION_TYPE_ID')->on('r_relation_location_type')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_company_office_location_type');
    }
};
