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
        Schema::create('t_relation', function (Blueprint $table) {
            $table->bigIncrements('RELATION_ORGANIZATION_ID')->unique()->primary();
            $table->string('RELATION_ORGANIZATION_NAME')->nullable();
            $table->unsignedBigInteger('RELATION_ORGANIZATION_PARENT_ID')->nullable();
            $table->string('RELATION_ORGANIZATION_ABBREVIATION')->nullable();
            $table->string('RELATION_ORGANIZATION_AKA')->nullable();
            $table->unsignedBigInteger('RELATION_ORGANIZATION_GROUP')->nullable();
            $table->string('RELATION_ORGANIZATION_CREATED_BY')->nullable();
            $table->timestamp('RELATION_ORGANIZATION_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('RELATION_ORGANIZATION_UPDATED_BY')->nullable();
            $table->timestamp('RELATION_ORGANIZATION_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('RELATION_ORGANIZATION_DESCRIPTION')->nullable();
            $table->string('RELATION_ORGANIZATION_ALIAS')->nullable();
            $table->string('RELATION_ORGANIZATION_EMAIL')->nullable();
            $table->string('RELATION_ORGANIZATION_MAPPING')->nullable();
            $table->bigInteger('HR_MANAGED_BY_APP')->nullable();
            $table->bigInteger('RELATION_ORGANIZATION_LOGO_ID')->nullable();
            $table->string('RELATION_ORGANIZATION_SIGNATURE_NAME')->nullable();
            $table->string('RELATION_ORGANIZATION_SIGNATURE_TITLE')->nullable();
            $table->string('RELATION_ORGANIZATION_BANK_ACCOUNT_NUMBER')->nullable();
            $table->string('RELATION_ORGANIZATION_BANK_ACCOUNT_NAME')->nullable();
            $table->bigInteger('RELATION_LOB_ID')->nullable();
            $table->bigInteger('salutation_id')->nullable();
            $table->bigInteger('relation_status_id')->nullable();
            $table->bigInteger('is_deleted')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_relation');
    }
};
