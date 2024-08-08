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
        Schema::create('t_person_contact', function (Blueprint $table) {
            $table->bigIncrements('PERSON_CONTACT_ID')->unique()->primary();
            $table->string('PERSON_PHONE_NUMBER')->nullable();
            $table->string('PERSON_EMAIL')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_person_contact');
    }
};
