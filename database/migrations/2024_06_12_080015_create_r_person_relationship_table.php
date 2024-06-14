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
        Schema::create('r_person_relationship', function (Blueprint $table) {
            $table->bigIncrements('PERSON_RELATIONSHIP_ID')->unique()->primary();
            $table->string('PERSON_RELATIONSHIP_NAME')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_person_relationship');
    }
};
