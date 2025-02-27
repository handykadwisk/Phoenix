<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TRequestTimeOffException extends Seeder
{
    /**
     * Seed the application's database - TEST.
     */
    public function run(): void
    {
        // 2024_10-08_r_time_off_type.sql
        $requestTimeOffException = resource_path('../database/LogDB/2024_10_09_t_request_time_off_exception.sql');

        DB::unprepared(
            file_get_contents($requestTimeOffException)
        );
       
    }
}