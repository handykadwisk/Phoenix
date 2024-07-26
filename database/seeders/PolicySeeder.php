<?php

namespace Database\Seeders;

use App\Models\Policy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Policy::create([
            'RELATION_ID' => 24,
            'POLICY_NUMBER' => '11223344',
            'INSURANCE_TYPE_ID' => 1,
            'POLICY_THE_INSURED' => 'The Insured Satu',
            'POLICY_INCEPTION_DATE' =>'2024-05-16',
            'POLICY_DUE_DATE' => '2024-06-08',
            'POLICY_STATUS_ID' => null,
            'POLICY_INSURANCE_PANEL' => 2,
            'POLICY_SHARE' => 100,
            'POLICY_CREATED_BY' => 1,
            'POLICY_CREATED_DATE' => '2024-05-14 09:43:40'
        ]);

        Policy::create([
            'RELATION_ID' => 23,
            'POLICY_NUMBER' => '55667788',
            'INSURANCE_TYPE_ID' => 2,
            'POLICY_THE_INSURED' => 'The Insured Dua',
            'POLICY_INCEPTION_DATE' =>'2024-05-16',
            'POLICY_DUE_DATE' => '2024-06-08',
            'POLICY_STATUS_ID' => null,
            'POLICY_INSURANCE_PANEL' => 2,
            'POLICY_SHARE' => 100,
            'POLICY_CREATED_BY' => 1,
            'POLICY_CREATED_DATE' => '2024-05-14 09:43:40'
        ]);

        Policy::create([
            'RELATION_ID' => 22,
            'POLICY_NUMBER' => '00998877',
            'INSURANCE_TYPE_ID' => 3,
            'POLICY_THE_INSURED' => 'The Insured Tiga',
            'POLICY_INCEPTION_DATE' =>'2024-05-16',
            'POLICY_DUE_DATE' => '2024-06-08',
            'POLICY_STATUS_ID' => null,
            'POLICY_INSURANCE_PANEL' => 2,
            'POLICY_SHARE' => 100,
            'POLICY_CREATED_BY' => 1,
            'POLICY_CREATED_DATE' => '2024-05-14 09:43:40'
        ]);
    }
}
