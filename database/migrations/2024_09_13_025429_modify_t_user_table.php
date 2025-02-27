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
        Schema::table('t_user', function (Blueprint $table) {
            // Hapus kolom yang tidak diperlukan lagi
            $table->dropColumn(['person_id', 'email', 'role_id']);

            // Tambahkan kolom baru dan foreign key
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->unsignedBigInteger('individual_relation_id')->nullable();
            $table->string('user_login')->unique()->nullable();
            $table->smallInteger('user_status')->default(1);
            

            // Tambahkan foreign key ke tabel r_user_type
            $table->unsignedInteger('user_type_id')->nullable();
            $table->foreign('user_type_id')->references('user_type_id')->on('r_user_type')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('t_user', function (Blueprint $table) {
            // Tambahkan kembali kolom yang dihapus
            $table->smallInteger('person_id')->nullable();
            $table->string('email')->unique();
            $table->foreignId('role_id')->constrained();

            // Hapus kolom yang ditambahkan dan foreign key
            $table->dropForeign(['user_type_id']);
            $table->dropColumn(['employee_id', 'individual_relation_id', 'user_login', 'user_type_id']);
        });
    }
};
