<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class rusertype extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file_path = resource_path('../database/LogDB/2024_09_09_r_user_type.sql');

        DB::unprepared(
            file_get_contents($file_path)
        );
    }
}
