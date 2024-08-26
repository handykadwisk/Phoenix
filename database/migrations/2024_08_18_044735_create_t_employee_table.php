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
        Schema::create('t_employee', function (Blueprint $table) {
            $table->bigIncrements('EMPLOYEE_ID')->unique()->primary();
            $table->string('EMPLOYEE_NUMBER_ID')->nullable();
            $table->string('EMPLOYEE_FIRST_NAME')->nullable();
            $table->string('EMPLOYEE_MIDDLE_NAME')->nullable();
            $table->string('EMPLOYEE_LAST_NAME')->nullable();
            $table->string('EMPLOYEE_NICKNAME')->nullable();
            $table->string('EMPLOYEE_GENDER')->nullable()->comment('m = male, f = female');
            $table->string('EMPLOYEE_BIRTH_PLACE')->nullable();
            $table->date('EMPLOYEE_BIRTH_DATE')->nullable();
            $table->string('EMPLOYEE_EMAIL')->nullable();
            $table->string('EMPLOYEE_CONTACT')->nullable();
            $table->unsignedBigInteger('EMPLOYEE_PARENT')->nullable();
            $table->string('EMPLOYEE_MAPPING')->nullable();
            $table->unsignedBigInteger('COMPANY_ID')->nullable();
            $table->integer('STRUCTURE_ID')->nullable();
            $table->integer('DIVISION_ID')->nullable();
            $table->integer('OFFICE_ID')->nullable();
            $table->integer('EMPLOYEE_IS_DELETED')->nullable()->comment('0 = ACTIVE, 1=INACTIVE');
            $table->bigInteger('EMPLOYEE_CREATED_BY')->nullable();
            $table->timestamp('EMPLOYEE_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->bigInteger('EMPLOYEE_UPDATED_BY')->nullable();
            $table->timestamp('EMPLOYEE_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable()->nullable();
            $table->integer('EMPLOYEE_CATEGORY')->nullable();
            $table->date('EMPLOYEE_HIRE_DATE')->nullable();
            $table->date('EMPLOYEE_END_DATE')->nullable();
            $table->string('EMPLOYEE_KTP')->nullable();
            $table->string('EMPLOYEE_NPWP')->nullable();
            $table->integer('EMPLOYEE_BANK_ACCOUNT_ID')->nullable();
            $table->integer('EMPLOYEE_IMAGE_ID')->nullable();
            $table->string('EMPLOYEE_KK')->nullable();
            $table->integer('EMPLOYEE_BLOOD_TYPE')->nullable()->comment('1=A, 2=B, 3=AB, 4=0');
            $table->integer('EMPLOYEE_BLOOD_RHESUS')->nullable()->comment('1=positive, 2=negative');
            $table->integer('EMPLOYEE_MARITAL_STATUS')->nullable()->comment('1=Single, 2= Married,3=Divorced,4=Widowed');
            $table->integer('TAX_STATUS_ID')->nullable();
            $table->string('EMPLOYEE_RECRUITMENT_LOCATION')->nullable();
            $table->integer('EMPLOYEE_LOCK_UPDATE')->nullable()->comment('null/0 = lock 1=unlock');
            $table->date('EMPLOYEE_LOCK_UPDATED_DATE')->nullable();
            $table->date('EMPLOYEE_SALARY_ADJUSTMENT1')->nullable();
            $table->date('EMPLOYEE_SALARY_ADJUSTMENT2')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_employee');
    }
};
