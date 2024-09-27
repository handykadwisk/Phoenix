<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RReimburseNotesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $r_reimburse_notes = resource_path('../database/LogDB/2024_08_15_r_reimburse_notes.sql');

        DB::unprepared(
            file_get_contents($r_reimburse_notes)
        );
    }
}