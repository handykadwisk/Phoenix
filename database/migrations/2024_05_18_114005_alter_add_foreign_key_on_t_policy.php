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
        Schema::table('t_policy', function (Blueprint $table) {
            $table->integer('INSURANCE_TYPE_ID')->unsigned()->change();
            $table->foreign('INSURANCE_TYPE_ID')->references('INSURANCE_TYPE_ID')->on('r_insurance_type');
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
