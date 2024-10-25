<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class mroleusers extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $file_path = resource_path('../database/LogDB/2024_10_23_m_role_users.sql');

        DB::unprepared(
            file_get_contents($file_path)
        );
    }
}
