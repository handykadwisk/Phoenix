<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RCashAdvanceStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $r_cash_advance_status = resource_path('../database/LogDB/2024_07_29_r_cash_advance_status.sql');

        DB::unprepared(
            file_get_contents($r_cash_advance_status)
        );
    }
}