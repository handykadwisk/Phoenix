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
        Schema::create('m_person_contact', function (Blueprint $table) {
            $table->bigIncrements('M_PERSON_CONTACT_ID');
            $table->unsignedBigInteger('PERSON_ID');
            $table->unsignedBigInteger('PERSON_CONTACT_ID');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_person_contact');
    }
};
