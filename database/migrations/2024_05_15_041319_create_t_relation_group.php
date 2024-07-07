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
        Schema::create('t_relation_group', function (Blueprint $table) {
            $table->increments('RELATION_GROUP_ID')->primary()->unique();
            $table->string('RELATION_GROUP_NAME')->nullable();
            $table->string('RELATION_GROUP_DESCRIPTION')->nullable();
            $table->bigInteger('RELATION_GROUP_CREATED_BY')->nullable();
            $table->timestamp('RELATION_GROUP_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->bigInteger('RELATION_GROUP_UPDATED_BY')->nullable();
            $table->timestamp('RELATION_GROUP_UPDATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->bigInteger('RELATION_GROUP_PARENT')->nullable();
            $table->string('RELATION_GROUP_ALIAS')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_relation_group');
    }
};
