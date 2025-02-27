<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RCurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $r_currency = resource_path('../database/LogDB/2024_16_05_r_currency.sql');

        DB::unprepared(
            file_get_contents($r_currency)
        );
    }
}