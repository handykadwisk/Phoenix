<?php

namespace Database\Seeders;

use App\Models\CashAdvanceCostClassification;
use App\Models\CashAdvancePurpose;
use App\Models\CashAdvanceStatus;
use App\Models\User;
use App\Models\Menu;
use App\Models\RelationLob;
use App\Models\RelationStatus;
use App\Models\RelationType;
use App\Models\Role;
use App\Models\RoleAccessMenu;
use App\Models\Salutation;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // create menu
        $dashboard = Menu::create(
            [
                'menu_name'       => 'Dashboard',
                'menu_url'        => 'dashboard',
                'menu_is_deleted' => 1,
                'menu_created_by' => 'admin'
            ]
        );
        $relation = Menu::create(
            [
                'menu_name'       => 'Relation',
                'menu_url'        => 'relation',
                'menu_is_deleted' => 0,
                'menu_created_by' => 'admin'
            ]
        );
        $policy = Menu::create(
            [
                'menu_name'       => 'Policy',
                'menu_url'        => 'policy',
                'menu_is_deleted' => 0,
                'menu_created_by' => 'admin'
            ]
        );

        $finance = Menu::create(
            [
                'menu_name'       => 'Finance',
                'menu_url'        => NULL,
                'menu_is_deleted' => 0,
                'menu_created_by' => 'admin'
            ]
        )->id;

        $cashAdvance = Menu::create(
            [
                'menu_parent_id' => $finance,
                'menu_name'       => 'Cash Advance',
                'menu_url'        => 'cashAdvance',
                'menu_is_deleted' => 0,
                'menu_created_by' => 'admin'
            ]
        )->id;

        $reimburse = Menu::create(
            [
                'menu_parent_id' => $finance,
                'menu_name'       => 'Reimburse',
                'menu_url'        => 'reimburse',
                'menu_is_deleted' => 0,
                'menu_created_by' => 'admin'
            ]
        )->id;

        $otherExpenses = Menu::create(
            [
                'menu_parent_id' => $finance,
                'menu_name'       => 'Other Expenses',
                'menu_url'        => 'otherExpenses',
                'menu_is_deleted' => 0,
                'menu_created_by' => 'admin'
            ]
        )->id;

        // $setting = Menu::create(
        //     [
        //         'menu_name'       => 'Settings',
        //         'menu_url'        => NULL,
        //         'menu_is_deleted' => 0,
        //         'menu_created_by' => 'admin'
        //     ]
        // )->id;

        $approvalLimit = Menu::create(
            [
                'menu_parent_id'  => $finance,
                'menu_name'       => 'Approval Limit',
                'menu_url'        => 'approvalLimit',
                'menu_is_deleted' => 0,
                'menu_created_by' => 'admin'
            ]
        )->id;

        // create role
        $admin = Role::create([
            'role_name' => 'Admin'
        ]);
        $user = Role::create([
            'role_name' => 'User'
        ]);

        // Mapping data menu
        RoleAccessMenu::create([
            'role_id' => $admin->id,
            'menu_id' => $dashboard->id
        ]);
        RoleAccessMenu::create([
            'role_id' => $admin->id,
            'menu_id' => $relation->id
        ]);
        RoleAccessMenu::create([
            'role_id' => $admin->id,
            'menu_id' => $policy->id
        ]);
        RoleAccessMenu::create([
            'role_id' => $admin->id,
            'menu_id' => $finance
        ]);
        RoleAccessMenu::create([
            'role_id' => $admin->id,
            'menu_id' => $cashAdvance
        ]);
        RoleAccessMenu::create([
            'role_id' => $admin->id,
            'menu_id' => $reimburse
        ]);
        RoleAccessMenu::create([
            'role_id' => $admin->id,
            'menu_id' => $otherExpenses
        ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $setting
        // ]);
        RoleAccessMenu::create([
            'role_id' => $admin->id,
            'menu_id' => $approvalLimit
        ]);

        // create user
        User::create(
            [
                'name' => 'Admin',
                'email' => 'admin@email.com',
                'password' => bcrypt('12345678'),
                'role_id' => $admin->id
            ]
        );
        User::create(
            [
                'name' => 'Fadhlan',
                'email' => 'fadhlan@email.com',
                'password' => bcrypt('12345678'),
                'role_id' => $user->id
            ]
        );
        User::create(
            [
                'name' => 'Haris',
                'email' => 'haris@email.com',
                'password' => bcrypt('12345678'),
                'role_id' => $user->id
            ]
        );
        User::create(
            [
                'name' => 'Pian',
                'email' => 'pian@email.com',
                'password' => bcrypt('12345678'),
                'role_id' => $user->id
            ]
        );
        User::create(
            [
                'name' => 'Fitano',
                'email' => 'fitano@email.com',
                'password' => bcrypt('12345678'),
                'role_id' => $user->id
            ]
        );
        User::create(
            [
                'name' => 'Mei',
                'email' => 'mei@email.com',
                'password' => bcrypt('12345678'),
                'role_id' => $user->id
            ]
        );
        User::create(
            [
                'name' => 'Apep',
                'email' => 'apep@email.com',
                'password' => bcrypt('12345678'),
                'role_id' => $user->id
            ]
        );

        // Create Relation Lob
        RelationLob::create(
            [
                'RELATION_LOB_NAME' => 'Pertanian Tanaman, Peternakan, Perburuan dan Kegiatan ybdi',
                'RELATION_LOB_DESC' => NULL
            ]
        );

        RelationLob::create(
            [
                'RELATION_LOB_NAME' => 'Kehutanan dan Penebangan Kayu',
                'RELATION_LOB_DESC' => NULL
            ]
        );

        RelationLob::create(
            [
                'RELATION_LOB_NAME' => 'Asuransi',
                'RELATION_LOB_DESC' => NULL
            ]
        );


        // create relation type
        RelationType::create(
            [
                'RELATION_TYPE_NAME' => 'Insurance',
                'RELATION_TYPE_DESCRIPTION' => NULL
            ]
        );
        RelationType::create(
            [
                'RELATION_TYPE_NAME' => 'Agent',
                'RELATION_TYPE_DESCRIPTION' => NULL
            ]
        );
        RelationType::create(
            [
                'RELATION_TYPE_NAME' => 'Broker',
                'RELATION_TYPE_DESCRIPTION' => NULL
            ]
        );

        // created salutation
        Salutation::create([
            'salutation_name' => 'CV',
            'salutation_desc' => NULL,
            'relation_status_id' => '1'
        ]);

        Salutation::create([
            'salutation_name' => 'PT',
            'salutation_desc' => NULL,
            'relation_status_id' => '1'
        ]);

        Salutation::create([
            'salutation_name' => 'PD',
            'salutation_desc' => NULL,
            'relation_status_id' => '1'
        ]);

        // created ralation status
        RelationStatus::create([
            'relation_status_name' => 'Corporate',
        ]);

        RelationStatus::create([
            'relation_status_name' => 'Individu',
        ]);

        $file_path12 = resource_path('../database/LogDB/2024_07_29_r_cash_advance_status.sql');

        DB::unprepared(
            file_get_contents($file_path12)
        );

        $file_path13 = resource_path('../database/LogDB/2024_07_29_r_cash_advance_purpose.sql');

        DB::unprepared(
            file_get_contents($file_path13)
        );

        $file_path14 = resource_path('../database/LogDB/2024_07_29_r_cash_advance_cost_classification.sql');

        DB::unprepared(
            file_get_contents($file_path14)
        );
    }
}