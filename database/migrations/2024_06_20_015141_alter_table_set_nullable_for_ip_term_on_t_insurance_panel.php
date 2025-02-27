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
        Schema::table('t_insurance_panel', function (Blueprint $table) {
            $table->integer('IP_TERM')->nullable()->change();
            $table->unsignedInteger('ENDORSEMENT_ID')->nullable()->change();
            $table->foreign('ENDORSEMENT_ID')->references('ENDORSEMENT_ID')->on('t_endorsement');
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
