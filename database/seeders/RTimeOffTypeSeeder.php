<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RTimeOffTypeSeeder extends Seeder
{
    /**
     * Seed the application's database - TEST.
     */
    public function run(): void
    {
        // 2024_10-08_r_time_off_type.sql
        $rTimeOffType = resource_path('../database/LogDB/2024_10-08_r_time_off_type.sql');

        DB::unprepared(
            file_get_contents($rTimeOffType)
        );
       
    }
}