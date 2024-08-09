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
        Schema::table('t_person', function (Blueprint $table) {
            $table->smallInteger('PERSON_IS_BAA')->after('TAX_STATUS_ID')->nullable()->comment("1= Yes, 0= No")->default(0);
            $table->smallInteger('PERSON_IS_VIP')->after('PERSON_IS_BAA')->nullable()->comment("1= Yes, 0= No")->default(0);
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
