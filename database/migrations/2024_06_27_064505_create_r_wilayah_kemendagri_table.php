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
        Schema::create('r_wilayah_kemendagri', function (Blueprint $table) {
            $table->string('kode', 30);
            $table->string('nama', 100);
            $table->string('tipe_wilayah', 255);
            $table->string('kode_mapping', 255);
            $table->string('kode_parent', 100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_wilayah_kemendagri');
    }
};
