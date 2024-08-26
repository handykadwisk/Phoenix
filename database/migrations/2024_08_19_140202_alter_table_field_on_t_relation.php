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
        Schema::table('t_relation', function (Blueprint $table) {
            $table->string('RELATION_ORGANIZATION_NPWP')->after('RELATION_ORGANIZATION_BANK_ACCOUNT_NAME')->nullable();
            $table->string('RELATION_ORGANIZATION_DATE_OF_BIRTH')->after('RELATION_ORGANIZATION_NPWP')->nullable();
            $table->bigInteger('DEFAULT_PAYABLE')->after('RELATION_ORGANIZATION_DATE_OF_BIRTH')->nullable()->comment("0 = By Relation, 1 = By Fresnel");
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
