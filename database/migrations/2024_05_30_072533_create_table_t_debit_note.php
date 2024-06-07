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
        Schema::create('t_debit_note', function (Blueprint $table) {
            // $table->id();
            // $table->timestamps();
            $table->increments('DEBIT_NOTE_ID');
            $table->char('DEBIT_NOTE_NUMBER', length:255)->nullable();
            $table->unsignedBigInteger('POLICY_ID');
            $table->unsignedBigInteger('POLICY_INSTALLMENT_ID');
            $table->tinyInteger('DEBIT_NOTE_TYPE')->comment('1:DN Initial Premium; 2:DN Additional Premium; 3:CN Refund Premium')->nullable();
            $table->decimal('TERM_RATE',20,2)->nullable();
            $table->date('INSURANCE_DUE_DATE')->nullable();
            $table->unsignedBigInteger('CLIENT_ID');
            $table->unsignedBigInteger('AGENT_ID');
            $table->decimal('AGENT_COMMISSION_RATE',20,2)->nullable();
            $table->decimal('AGENT_COMMISSION_AMOUNT',20,2)->nullable();
            $table->decimal('AGENT_COMMISSION_PPH_21',20,2)->nullable();
            $table->decimal('AGENT_COMMISSION_PPH_23',20,2)->nullable();
            $table->decimal('AGENT_COMMISSION_NETTO',20,2)->nullable();
            $table->unsignedBigInteger('CURRENCY_ID');
            $table->decimal('SUM_INSURED',20,2)->nullable();
            $table->decimal('PREMIUM_AMOUNT',20,2)->nullable();
            $table->decimal('SPECIAL_PREMIUM_AMOUNT',20,2)->nullable();
            $table->tinyInteger('USE_VALUE_TO_CLIENT')->comment('0:No; 1:Yes, Special Premium')->nullable();
            $table->decimal('DISCOUNT',20,2)->nullable();
            $table->decimal('POLICY_COST',20,2)->nullable();
            $table->decimal('ADMIN_COST',20,2)->nullable();
            $table->decimal('DUE_TO_US',20,2)->nullable();
            $table->text('NOTE')->nullable();
            $table->integer('DN_CREATED_BY')->nullable();
            $table->timestamp('DN_CREATED_DATE')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('DN_UPDATED_BY')->nullable();
            $table->timestamp('DN_UPDATED_DATE')->nullable();
            $table->foreign('POLICY_ID')->references('POLICY_ID')->on('t_policy')->onDelete('cascade');
            // $table->foreign('POLICY_INSTALLMENT_ID')->references('POLICY_INSTALLMENT_ID')->on('t_policy_installment')->onDelete('cascade');
            // $table->foreign('CLIENT_ID')->references('RELATION_ORGANIZATION_ID')->on('t_relation')->onDelete('cascade');
            // $table->foreign('AGENT_ID')->references('RELATION_ORGANIZATION_ID')->on('t_relation')->onDelete('cascade');
            // $table->foreign('CURRENCY_ID')->references('CURRENCY_ID')->on('r_currency')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_debit_note');
    }
};
