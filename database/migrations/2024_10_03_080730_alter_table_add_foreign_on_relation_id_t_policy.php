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
            $table->bigInteger('RELATION_ID')->unsigned()->change();
            $table->foreign('RELATION_ID')->references('RELATION_ORGANIZATION_ID')->on('t_relation');
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
