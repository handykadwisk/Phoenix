<?php

namespace Database\Seeders;

use App\Models\CashAdvancePurpose;
use App\Models\CashAdvanceStatus;
use App\Models\User;
use App\Models\Menu;
use App\Models\Relation;
use App\Models\RelationGroup;
use App\Models\RelationLob;
use App\Models\RelationStatus;
use App\Models\RelationType;
use App\Models\Role;
use App\Models\RoleAccessMenu;
use App\Models\Salutation;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
                'menu_sequence'   => 1,
                'menu_created_by' => 'admin'
            ]
        );
        $relation = Menu::create(
            [
                'menu_name'       => 'Relation',
                'menu_is_deleted' => 0,
                'menu_sequence'   => 2,
                'menu_created_by' => 'admin'
            ]
        );
        $policy = Menu::create(
            [
                'menu_name'       => 'Policy',
                'menu_url'        => 'policy',
                'menu_is_deleted' => 0,
                'menu_sequence'   => 3,
                'menu_created_by' => 'admin'
            ]
        );
        $group = Menu::create(
            [
                'menu_name'       => 'Group',
                'menu_parent_id'  => $relation->id,
                'menu_url'        => 'relation/group',
                'menu_is_deleted' => 0,
                'menu_sequence'   => 5,
                'menu_created_by' => 'admin'
            ]
        );
        $childRelation = Menu::create(
            [
                'menu_name'       => 'Relation',
                'menu_parent_id'  => $relation->id,
                'menu_url'        => 'relation',
                'menu_is_deleted' => 0,
                'menu_sequence'   => 4,
                'menu_created_by' => 'admin'
            ]
        );

        $childAgent = Menu::create(
            [
                'menu_name'       => 'Agent',
                'menu_parent_id'  => $relation->id,
                'menu_url'        => 'relation/agent',
                'menu_is_deleted' => 0,
                'menu_sequence'   => 6,
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

        // add Group
        $addGroup = RelationGroup::create([
            'RELATION_GROUP_NAME' => 'FRESNEL',
            'RELATION_GROUP_CREATED_BY' => 1,
            'RELATION_GROUP_CREATED_DATE' => now(),
        ]);

        // Add Relation
        $addRelation = Relation::create([
            'RELATION_ORGANIZATION_NAME' => "Fresnel Perdana Mandiri",
            'RELATION_ORGANIZATION_ALIAS' => "Fresnel Perdana Mandiri",
            'RELATION_ORGANIZATION_PARENT_ID' => "0",
            "RELATION_ORGANIZATION_ABBREVIATION" => "FPM",
            // "RELATION_ORGANIZATION_AKA" => "1",
            "RELATION_ORGANIZATION_GROUP" => $addGroup->RELATION_GROUP_ID,
            "RELATION_ORGANIZATION_CREATED_BY" => 1,
            "RELATION_ORGANIZATION_CREATED_DATE" => now(),
            "HR_MANAGED_BY_APP" => 1,
            "salutation_id" => 3,
            "relation_status_id" => 1,
        ]);

        // update Relation
        $updateRelation = Relation::where('RELATION_ORGANIZATION_ID', $addRelation->RELATION_ORGANIZATION_ID)
        ->update([
            "RELATION_ORGANIZATION_MAPPING" => $addRelation->RELATION_ORGANIZATION_ID . "."
        ]);



        // // create 2024_21_05_Store_Procedure_And_Function
        // $file_path1 = resource_path('../database/LogDB/2024_21_05_Store_Procedure_And_Function.sql');

        // \DB::unprepared(
        //     file_get_contents($file_path1)
        // );

        // create 2024_25_06_r_grade
        $file_path2 = resource_path('../database/LogDB/2024_25_06_r_grade.sql');

        \DB::unprepared(
            file_get_contents($file_path2)
        );

        // create 2024_27_06_r_relation_location_type
        $file_path3 = resource_path('../database/LogDB/2024_27_06_r_relation_location_type.sql');

        \DB::unprepared(
            file_get_contents($file_path3)
        );

        // create 2024_27_06_r_wilayah_kemendagri
        $file_path4 = resource_path('../database/LogDB/2024_27_06_r_wilayah_kemendagri.sql');

        \DB::unprepared(
            file_get_contents($file_path4)
        );

        // create 2024_20_06_r_bank
        $file_path5 = resource_path('../database/LogDB/2024_20_06_r_bank.sql');

        \DB::unprepared(
            file_get_contents($file_path5)
        );

        // create 2024_16_06_r_tax-status
        $file_path6 = resource_path('../database/LogDB/2024_16_06_r_tax-status.sql');

        \DB::unprepared(
            file_get_contents($file_path6)
        );

        // create 2024_12_06_r_person_relationship
        $file_path7 = resource_path('../database/LogDB/2024_12_06_r_person_relationship.sql');

        \DB::unprepared(
            file_get_contents($file_path7)
        );

        // create 2024_30_05_r_proffesion
        $file_path8 = resource_path('../database/LogDB/2024_30_05_r_proffesion.sql');

        \DB::unprepared(
            file_get_contents($file_path8)
        );

        // create 2024_30_05_r_relation_type
        $file_path9 = resource_path('../database/LogDB/2024_30_05_r_relation_type.sql');

        \DB::unprepared(
            file_get_contents($file_path9)
        );

        // create 2024_16_05_r_relation_lob
        $file_path10 = resource_path('../database/LogDB/2024_16_05_r_relation_lob.sql');

        \DB::unprepared(
            file_get_contents($file_path10)
        );

        // create 2024_16_05_r_relation_status
        $file_path11 = resource_path('../database/LogDB/2024_16_05_r_relation_status.sql');

        \DB::unprepared(
            file_get_contents($file_path11)
        );

        RelationStatus::create([
            'relation_status_name' => 'Individu',
        ]);
    }
}
