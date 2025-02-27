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
        Schema::table('t_endorsement', function (Blueprint $table) {
            $table->unsignedInteger('ENDORSEMENT_TYPE_ID');
            $table->foreign('ENDORSEMENT_TYPE_ID')->references('ENDORSEMENT_TYPE_ID')->on('r_endorsement_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
