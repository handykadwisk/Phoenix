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
            $table->integer('POLICY_STATUS_ID')->comment('1:Current; 0:Lapse')->nullable()->change();            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::table('policy_status_id_on_t_policy', function (Blueprint $table) {
        //     //
        // });
    }
};
