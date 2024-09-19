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
        Schema::create('m_pks_relation', function (Blueprint $table) {
            $table->bigIncrements('M_PKS_RELATION_ID')->unique()->primary();
            $table->unsignedBigInteger('RELATION_ORGANIZATION_ID')->nullable();
            $table->string('NO_PKS', 255)->nullable();
            $table->date('STAR_DATE_PKS')->nullable();
            $table->date('END_DATE_PKS')->nullable();
            $table->string('DOCUMENT_PKS_ID')->nullable();
            $table->bigInteger('FOR_PKS')->nullable()->comment('1 = Agent, 2. Corporate => FBI By PKS');
            $table->text('REMARKS_PKS')->nullable();
            $table->bigInteger('STATUS_PKS')->nullable();
            $table->bigInteger('ENDING_BY_CANCEL')->nullable()->comment('0 = Yes, 1 = No');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_pks_relation');
    }
};
