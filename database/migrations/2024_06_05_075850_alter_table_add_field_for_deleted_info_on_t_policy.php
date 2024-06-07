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
            $table->integer('POLICY_IS_DELETED')->comment('1:Yes; 0:No')->nullable();
            $table->text('POLICY_IS_DELETED_NOTE')->nullable();
            $table->integer('POLICY_IS_DELETED_BY')->nullable();
            $table->timestamp('POLICY_IS_DELETED_DATE')->nullable();
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
