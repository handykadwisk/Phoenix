<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RPaymentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $r_payment_type = resource_path('../database/LogDB/2024_10_03_r_payment_type.sql');

        DB::unprepared(
            file_get_contents($r_payment_type)
        );
    }
}