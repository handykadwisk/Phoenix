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
        Schema::create('t_person', function (Blueprint $table) {
            $table->bigIncrements('PERSON_ID')->unique()->primary();
            $table->string('PERSON_FIRST_NAME')->nullable();
            $table->string('PERSON_MIDDLE_NAME')->nullable();
            $table->string('PERSON_LAST_NAME')->nullable();
            $table->string('PERSON_NICKNAME')->nullable();
            $table->string('PERSON_GENDER')->nullable()->comment('m = male, f = female');
            $table->string('PERSON_BIRTH_PLACE')->nullable();
            $table->date('PERSON_BIRTH_DATE')->nullable();
            $table->string('PERSON_EMAIL')->nullable();
            $table->string('PERSON_CONTACT')->nullable();
            $table->unsignedBigInteger('PERSON_PARENT')->nullable();
            $table->string('PERSON_MAPPING')->nullable();
            $table->unsignedBigInteger('RELATION_ORGANIZATION_ID')->nullable();
            $table->integer('STRUCTURE_ID')->nullable();
            $table->integer('DIVISION_ID')->nullable();
            $table->integer('OFFICE_ID')->nullable();
            $table->integer('PERSON_IS_DELETED')->nullable()->comment('0 = ACTIVE, 1=INACTIVE');
            $table->bigIncrements('PERSON_CREATED_BY')->nullable();
            $table->timestamp('PERSON_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigIncrements('PERSON_UPDATED_BY')->nullable();
            $table->timestamp('PERSON_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->integer('PERSON_CATEGORY')->nullable();
            $table->date('PERSON_HIRE_DATE')->nullable();
            $table->date('PERSON_END_DATE')->nullable();
            $table->string('PERSON_KTP')->nullable();
            $table->string('PERSON_NPWP')->nullable();
            $table->integer('PERSON_BANK_ACCOUNT_ID')->nullable();
            $table->integer('PERSON_IMAGE_ID')->nullable();
            $table->string('PERSON_KK')->nullable();
            $table->integer('PERSON_BLOOD_TYPE')->nullable()->comment('1=A, 2=B, 3=AB, 4=0');
            $table->integer('PERSON_BLOOD_RHESUS')->nullable()->comment('1=positive, 2=negative');
            $table->integer('PERSON_MARITAL_STATUS')->nullable()->comment('1=Single, 2= Married,3=Divorced,4=Widowed');
            $table->integer('TEXT_STATUS_ID')->nullable();
            $table->string('PERSON_RECRUITMENT_LOCATION')->nullable();
            $table->integer('PERSON_LOCK_UPDATE')->nullable()->comment('null/0 = lock 1=unlock');
            $table->date('PERSON_LOCK_UPDATED_DATE')->nullable();
            $table->date('PERSON_SALARY_ADJUSTMENT1')->nullable();
            $table->date('PERSON_SALARY_ADJUSTMENT2')->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_person');
    }
};
