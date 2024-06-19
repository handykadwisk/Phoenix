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
        Schema::create('t_document', function (Blueprint $table) {
            $table->bigIncrements('DOCUMENT_ID')->unique()->primary();
            $table->string('DOCUMENT_FILENAME', 255)->nullable();
            $table->text('DOCUMENT_PATHNAME')->nullable();
            $table->string('DOCUMENT_EXTENTION')->nullable();
            $table->string('DOCUMENT_TYPE')->nullable();
            $table->decimal('DOCUMENT_SIZE', 15,0)->nullable();
            $table->bigInteger('DOCUMENT_CREATED_BY')->nullable();
            $table->timestamp('DOCUMENT_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable();
            $table->bigInteger('DOCUMENT_UPDATED_BY')->nullable();
            $table->timestamp('DOCUMENT_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'))->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_document');
    }
};
