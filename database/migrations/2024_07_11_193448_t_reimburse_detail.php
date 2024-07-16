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
        Schema::create('t_reimburse_detail', function (Blueprint $table) {
            $table->increments('REIMBURSE_DETAIL_ID');
            $table->smallInteger('REIMBURSE_ID')->nullable();
            $table->date('REIMBURSE_DETAIL_DATE')->nullable();
            $table->text('REIMBURSE_DETAIL_PURPOSE')->nullable();
            $table->text('REIMBURSE_DETAIL_LOCATION')->nullable();
            $table->smallInteger('REIMBURSE_DETAIL_RELATION_ORGANIZATION_ID')->nullable();
            $table->string('REIMBURSE_DETAIL_RELATION_NAME')->nullable();
            $table->string('REIMBURSE_DETAIL_RELATION_POSITION')->nullable();
            $table->decimal('REIMBURSE_DETAIL_AMOUNT', 16, 2)->nullable();
            $table->boolean('REIMBURSE_DETAIL_STATUS')->nullable();
            $table->string('REIMBURSE_DETAIL_DOCUMENT_ID')->nullable();
            $table->text('REIMBURSE_DETAIL_NOTE')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_reimburse_detail');
    }
};
