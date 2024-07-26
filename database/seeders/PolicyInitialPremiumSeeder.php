<?php

namespace Database\Seeders;

use App\Models\MPolicyPremium;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PolicyInitialPremiumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MPolicyPremium::create([
            'POLICY_ID' => 1,
            'CURRENCY_ID' => 1,
            'SUM_INSURED' => 100,
            'RATE' => 10,
            'INITIAL_PREMIUM' => 50,
            'INSTALLMENT' => 2,
            'CREATED_BY' => 1,
            'CREATED_DATE' => now()
        ]);
        MPolicyPremium::create([
            'POLICY_ID' => 1,
            'CURRENCY_ID' => 2,
            'SUM_INSURED' => 10,
            'RATE' => 5,
            'INITIAL_PREMIUM' => 50,
            'INSTALLMENT' => 2,
            'CREATED_BY' => 1,
            'CREATED_DATE' => now()
        ]);
        MPolicyPremium::create([
            'POLICY_ID' => 2,
            'CURRENCY_ID' => 1,
            'SUM_INSURED' => 100,
            'RATE' => 10,
            'INITIAL_PREMIUM' => 50,
            'INSTALLMENT' => 2,
            'CREATED_BY' => 1,
            'CREATED_DATE' => now()
        ]);
        MPolicyPremium::create([
            'POLICY_ID' => 2,
            'CURRENCY_ID' => 2,
            'SUM_INSURED' => 10,
            'RATE' => 5,
            'INITIAL_PREMIUM' => 50,
            'INSTALLMENT' => 2,
            'CREATED_BY' => 1,
            'CREATED_DATE' => now()
        ]);
    }
}
