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
        Schema::create('t_other_expenses_detail', function (Blueprint $table) {
            $table->increments('OTHER_EXPENSES_DETAIL_ID');
            $table->smallInteger('OTHER_EXPENSES_ID')->nullable();
            $table->date('OTHER_EXPENSES_DETAIL_DATE')->nullable();
            $table->text('OTHER_EXPENSES_DETAIL_PURPOSE')->nullable();
            $table->text('OTHER_EXPENSES_DETAIL_LOCATION')->nullable();
            $table->smallInteger('OTHER_EXPENSES_DETAIL_RELATION_ORGANIZATION_ID')->nullable();
            $table->string('OTHER_EXPENSES_DETAIL_RELATION_NAME')->nullable();
            $table->string('OTHER_EXPENSES_DETAIL_RELATION_POSITION')->nullable();
            $table->decimal('OTHER_EXPENSES_DETAIL_AMOUNT', 16, 2)->nullable();
            $table->boolean('OTHER_EXPENSES_DETAIL_STATUS')->nullable();
            $table->string('OTHER_EXPENSES_DETAIL_DOCUMENT_ID')->nullable();
            $table->text('OTHER_EXPENSES_DETAIL_NOTE')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_other_expenses_detail');
    }
};
