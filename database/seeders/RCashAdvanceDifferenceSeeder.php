<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RCashAdvanceDifferenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $r_cash_advance_difference = resource_path('../database/LogDB/2024_08_05_r_cash_advance_difference.sql');

        DB::unprepared(
            file_get_contents($r_cash_advance_difference)
        );
    }
}