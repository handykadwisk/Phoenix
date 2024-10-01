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
        Schema::create('t_job_posts', function (Blueprint $table) {
            $table->increments('jobpost_id')->primary()->unique();
            $table->unsignedBigInteger('company_division_id')->nullable();
            $table->string('jobpost_name', 255)->nullable();
            $table->text('jobpost_description')->nullable();
            $table->bigInteger('jobpost_parent')->nullable();
            $table->smallInteger('jobpost_status')->default(1);
            $table->bigInteger('jobpost_created_by')->nullable();
            $table->timestamp('jobpost_created_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->bigInteger('jobpost_updated_by')->nullable();
            $table->timestamp('jobpost_updated_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->foreign('company_division_id')->references('COMPANY_DIVISION_NAME')->on('t_company_division')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_job_posts');
    }
};
