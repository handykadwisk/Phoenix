<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RBankTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $r_bank_transaction = resource_path('../database/LogDB/2024_09_20_r_bank_transaction.sql');

        DB::unprepared(
            file_get_contents($r_bank_transaction)
        );
    }
}