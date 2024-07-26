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
        Schema::create('r_endorsement_type', function (Blueprint $table) {
            $table->increments('ENDORSEMENT_TYPE_ID')->primary();
            $table->string('ENDORSEMENT_TYPE_NAME')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_endorsement_type');
    }
};
