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
        Schema::create('t_person_emergency_contact', function (Blueprint $table) {
            $table->bigIncrements('PERSON_EMERGENCY_CONTACT_ID')->unique()->primary();
            $table->unsignedBigInteger('PERSON_ID')->nullable();
            $table->string('PERSON_EMERGENCY_CONTACT_NAME')->nullable();
            $table->string('PERSON_EMERGENCY_CONTACT_NUMBER')->nullable();
            $table->unsignedBigInteger('PERSON_RELATIONSHIP_ID')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_person_emergency_contact');
    }
};
