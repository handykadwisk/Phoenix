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
        //merubah tipe data bigint menjadi int di tabel t_policy 
        Schema::table('t_policy', function (Blueprint $table) {
            $table->integer('RELATION_ID')->unsigned()->nullable(false)->change();
            $table->integer('POLICY_STATUS_ID')->unsigned()->nullable(true)->change();
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
