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
        Schema::create('m_employee_contact', function (Blueprint $table) {
            $table->bigIncrements('M_EMPLOYEE_CONTACT_ID');
            $table->unsignedBigInteger('EMPLOYEE_ID');
            $table->unsignedBigInteger('EMPLOYEE_CONTACT_ID');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_employee_contact');
    }
};
