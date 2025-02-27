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
            $table->integer('IP_IS_DELETED')->comment('1:Yes; 0:No')->nullable();
            $table->text('IP_IS_DELETED_NOTE')->nullable();
            $table->integer('IP_IS_DELETED_BY')->nullable();
            $table->timestamp('IP_IS_DELETED_DATE')->nullable();
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
