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
        Schema::create('r_menu', function (Blueprint $table) {
            $table->id();
            $table->string('menu_name');
            $table->unsignedBigInteger('menu_parent_id')->nullable();
            $table->string('menu_url')->nullable();
            $table->integer('menu_is_deleted')->nullable();
            $table->string('menu_is_deleted_by')->nullable();
            $table->timestamp('menu_is_deleted_at')->nullable();
            $table->string('menu_is_deleted_description')->nullable();
            $table->integer('menu_sequence')->nullable();
            $table->string('menu_created_by');
            $table->string('menu_updated_by')->nullable();
            $table->timestamp('menu_created_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('menu_updated_date')->nullable();
            $table->foreign('menu_parent_id')->references('id')->on('r_menu')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_menu');
    }
};
