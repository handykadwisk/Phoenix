<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('t_document', function (Blueprint $table) {
            $table->bigIncrements('DOCUMENT_ID');
            $table->string('DOCUMENT_ORIGINAL_NAME');
            $table->string('DOCUMENT_FILENAME');
            $table->string('DOCUMENT_DIRNAME');
            $table->string('DOCUMENT_FILETYPE');
            $table->decimal('DOCUMENT_FILESIZE', 15,0);
            $table->integer('DOCUMENT_CREATED_BY');
            $table->timestamp('DOCUMENT_CREATED_DATE')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('DOCUMENT_UPDATED_BY')->nullable();
            $table->timestamp('DOCUMENT_UPDATED_DATE')->nullable();
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