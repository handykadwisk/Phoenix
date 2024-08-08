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
        Schema::create('r_for_account_bank', function (Blueprint $table) {
            $table->bigIncrements('FOR_BANK_ACCOUNT_ID');
            $table->string('FOR_BANK_ACCOUNT_NAME', 255)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_for_account_bank');
    }
};
