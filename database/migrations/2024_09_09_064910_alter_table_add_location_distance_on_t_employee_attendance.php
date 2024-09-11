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
        Schema::table('t_employee_attendance', function (Blueprint $table) {
            $table->decimal('LOCATION_DISTANCE', 20, 2)->comment('Jarak lokasi kehadiran ke kantor dalam Meter')->nullable();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
