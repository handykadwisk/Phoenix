<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RJournalTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $r_journal_type = resource_path('../database/LogDB/2024_09_19_r_journal_type.sql');

        DB::unprepared(
            file_get_contents($r_journal_type)
        );
    }
}