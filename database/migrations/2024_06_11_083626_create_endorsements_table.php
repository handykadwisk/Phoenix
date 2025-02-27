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
        Schema::create('t_endorsement', function (Blueprint $table) {
            $table->increments('ENDORSEMENT_ID')->primary();
            $table->unsignedInteger('POLICY_ID');
            $table->string('ENDORSEMENT_NUMBER')->nullable();
            $table->smallInteger('ENDORSEMENT_STATUS')->comment('0: Ongoing; 1: Finalized; 2: Canceled')->nullable();
            $table->date('ENDORSEMENT_EFFECTIVE_DATE')->nullable();
            $table->date('ENDORSEMENT_EXPIRY_DATE')->nullable();
            $table->string('ENDORSEMENT_OCCUPATION')->nullable();
            $table->string('ENDORSEMENT_CONVEYANCE')->nullable();
            $table->string('ENDORSEMENT_FROM')->nullable();
            $table->string('ENDORSEMENT_TO')->nullable();
            $table->string('ENDORSEMENT_TRANSHIPMENT')->nullable();
            $table->text('ENDORSEMENT_NOTE')->nullable();
            $table->integer('ENDORSEMENT_CREATED_BY')->nullable();
            $table->timestamp('ENDORSEMENT_CREATED_DATE')->nullable();
            $table->integer('ENDORSEMENT_UPDATE_BY')->nullable();
            $table->timestamp('ENDORSEMENT_UPDATE_DATE')->nullable();

            $table->foreign('POLICY_ID')->references('POLICY_ID')->on('t_policy')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_endorsement');
    }
};
