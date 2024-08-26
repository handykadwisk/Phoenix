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
        Schema::create('t_company', function (Blueprint $table) {
            $table->bigIncrements('COMPANY_ID')->unique()->primary();
            $table->string('COMPANY_NAME')->nullable();
            $table->unsignedBigInteger('COMPANY_PARENT_ID')->nullable();
            $table->string('COMPANY_ABBREVIATION')->nullable();
            $table->string('COMPANY_AKA')->nullable();
            $table->unsignedBigInteger('COMPANY_GROUP')->nullable();
            $table->string('COMPANY_CREATED_BY')->nullable();
            $table->timestamp('COMPANY_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable();
            $table->string('COMPANY_UPDATED_BY')->nullable();
            $table->timestamp('COMPANY_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable();
            $table->text('COMPANY_DESCRIPTION')->nullable();
            $table->string('COMPANY_ALIAS')->nullable();
            $table->string('COMPANY_EMAIL')->nullable();
            $table->string('COMPANY_WEBSITE')->nullable();
            $table->string('COMPANY_MAPPING')->nullable();
            $table->bigInteger('HR_MANAGED_BY_APP')->nullable()->comment("0 = No, 1 = Yes");
            $table->bigInteger('IS_TBK')->nullable();
            $table->bigInteger('COMPANY_LOGO_ID')->nullable();
            $table->string('COMPANY_SIGNATURE_NAME')->nullable();
            $table->string('COMPANY_SIGNATURE_TITLE')->nullable();
            $table->string('COMPANY_BANK_ACCOUNT_NUMBER')->nullable();
            $table->string('COMPANY_BANK_ACCOUNT_NAME')->nullable();
            $table->bigInteger('RELATION_PROFESSION_ID')->nullable();
            $table->bigInteger('RELATION_LOB_ID')->nullable();
            $table->bigInteger('PRE_SALUTATION')->nullable();
            $table->bigInteger('POST_SALUTATION')->nullable();
            $table->bigInteger('relation_status_id')->nullable();
            $table->bigInteger('is_deleted')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_company');
    }
};
