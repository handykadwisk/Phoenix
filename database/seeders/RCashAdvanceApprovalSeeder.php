<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RCashAdvanceApprovalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $r_cash_advance_approval = resource_path('../database/LogDB/2024_07_29_r_cash_advance_approval.sql');

        DB::unprepared(
            file_get_contents($r_cash_advance_approval)
        );
    }
}