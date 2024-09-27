<?php

namespace Database\Seeders;

use App\Models\CashAdvanceCostClassification;
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
use App\Models\RReimburseNotes;
use App\Models\Salutation;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database - TEST.
     */
    public function run(): void
    {
        $this->call([
            RBankTransactionSeeder::class,
            RCashAdvanceApprovalSeeder::class,
            RCashAdvanceDifferenceSeeder::class,
            RCashAdvanceMethodSeeder::class,
            RCashAdvancePurposeSeeder::class,
            RCashAdvanceStatusSeeder::class,
            RCurrencySeeder::class,
            RJournalTypeSeeder::class,
            RReimburseNotesSeeder::class
        ]);
        
        // create menu
        // $dashboard = Menu::create(
        //     [
        //         'menu_name'       => 'Dashboard',
        //         'menu_url'        => 'dashboard',
        //         'menu_is_deleted' => 1,
        //         'menu_sequence'   => 1,
        //         'menu_created_by' => 'admin'
        //     ]
        // );
        // $relation = Menu::create(
        //     [
        //         'menu_name'       => 'Relation',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 2,
        //         'menu_created_by' => 'admin'
        //     ]
        // );
        // $policy = Menu::create(
        //     [
        //         'menu_name'       => 'Policy',
        //         'menu_url'        => 'policy',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 3,
        //         'menu_created_by' => 'admin'
        //     ]
        // );
        // $group = Menu::create(
        //     [
        //         'menu_name'       => 'Policy',
        //         'menu_parent_id'  => $relation->id,
        //         'menu_url'        => 'policy/policy',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 8,
        //         'menu_created_by' => 'admin'
        //     ]
        // );
        // $group = Menu::create(
        //     [
        //         'menu_name'       => 'Group',
        //         'menu_parent_id'  => $relation->id,
        //         'menu_url'        => 'relation/group',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 5,
        //         'menu_created_by' => 'admin'
        //     ]
        // );
        // $childRelation = Menu::create(
        //     [
        //         'menu_name'       => 'Relation',
        //         'menu_parent_id'  => $relation->id,
        //         'menu_url'        => 'relation',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 4,
        //         'menu_created_by' => 'admin'
        //     ]
        // );

        // $childAgent = Menu::create(
        //     [
        //         'menu_name'       => 'Agent',
        //         'menu_parent_id'  => $relation->id,
        //         'menu_url'        => 'relation/agent',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 6,
        //         'menu_created_by' => 'admin'
        //     ]
        // );

        // $childBAA = Menu::create(
        //     [
        //         'menu_name'       => 'BAA',
        //         'menu_parent_id'  => $relation->id,
        //         'menu_url'        => 'relation/baa',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 7,
        //         'menu_created_by' => 'admin'
        //     ]
        // );

        // $finance = Menu::create(
        //     [
        //         'menu_name'       => 'Finance',
        //         'menu_url'        => NULL,
        //         'menu_is_deleted' => 0,
        //         'menu_created_by' => 'admin'
        //     ]
        // )->id;

        // $cashAdvance = Menu::create(
        //     [
        //         'menu_parent_id' => $finance,
        //         'menu_name'       => 'Cash Advance',
        //         'menu_url'        => 'cashAdvance',
        //         'menu_is_deleted' => 0,
        //         'menu_created_by' => 'admin'
        //     ]
        // )->id;

        // $reimburse = Menu::create(
        //     [
        //         'menu_parent_id' => $finance,
        //         'menu_name'       => 'Reimburse',
        //         'menu_url'        => 'reimburse',
        //         'menu_is_deleted' => 0,
        //         'menu_created_by' => 'admin'
        //     ]
        // )->id;

        // $otherExpenses = Menu::create(
        //     [
        //         'menu_parent_id' => $finance,
        //         'menu_name'       => 'Other Expenses',
        //         'menu_url'        => 'otherExpenses',
        //         'menu_is_deleted' => 0,
        //         'menu_created_by' => 'admin'
        //     ]
        // )->id;

        // $setting = Menu::create(
        //     [
        //         'menu_name'       => 'Settings',
        //         'menu_url'        => NULL,
        //         'menu_is_deleted' => 0,
        //         'menu_created_by' => 'admin'
        //     ]
        // )->id;

        // $approvalLimit = Menu::create(
        //     [
        //         'menu_parent_id'  => $finance,
        //         'menu_name'       => 'Approval Limit',
        //         'menu_url'        => 'approvalLimit',
        //         'menu_is_deleted' => 0,
        //         'menu_created_by' => 'admin'
        //     ]
        // )->id;

        // $setting = Menu::create(
        //     [
        //         'menu_name'       => 'Setting',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 99,
        //         'menu_created_by' => 'admin'
        //     ]
        // );

        // $ACLMenu = Menu::create(
        //     [
        //         'menu_name'       => 'ACL - Menu',
        //         'menu_parent_id'  => $setting->id,
        //         'menu_url'        => 'setting/menu',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 6,
        //         'menu_created_by' => 'admin'
        //     ]
        // );

        // $ACLPermission = Menu::create(
        //     [
        //         'menu_name'       => 'ACL - Permission',
        //         'menu_parent_id'  => $setting->id,
        //         'menu_url'        => 'setting/permission',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 6,
        //         'menu_created_by' => 'admin'
        //     ]
        // );

        // $ACLRole = Menu::create(
        //     [
        //         'menu_name'       => 'ACL - Role',
        //         'menu_parent_id'  => $setting->id,
        //         'menu_url'        => 'setting/role',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 6,
        //         'menu_created_by' => 'admin'
        //     ]
        // );

        // $HR = Menu::create(
        //     [
        //         'menu_name'       => 'HR',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 77,
        //         'menu_created_by' => 'admin'
        //     ]
        // );

        // $hrCompany = Menu::create(
        //     [
        //         'menu_name'       => 'Company Setting',
        //         'menu_parent_id'  => $HR->id,
        //         'menu_url'        => 'hr/settingCompany',
        //         'menu_is_deleted' => 0,
        //         'menu_sequence'   => 1,
        //         'menu_created_by' => 'admin'
        //     ]
        // );

        // create role
        $admin = Role::create([
            'role_name' => 'Admin'
        ]);
        $user = Role::create([
            'role_name' => 'User'
        ]);

        // Mapping data menu
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $dashboard->id
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $relation->id
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $policy->id
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $finance
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $cashAdvance
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $reimburse
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $otherExpenses
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $approvalLimit
        // ]);

        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $setting->id
        // ]);

        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $ACLMenu->id
        // ]);

        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $ACLPermission->id
        // ]);

        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $ACLRole->id
        // ]);

        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $group->id
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $childRelation->id
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $childAgent->id
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $childBAA->id
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $HR->id
        // ]);
        // RoleAccessMenu::create([
        //     'role_id' => $admin->id,
        //     'menu_id' => $hrCompany->id
        // ]);

        // create user
        // User::create(
        //     [
        //         'name' => 'Admin',
        //         'email' => 'admin@email.com',
        //         'password' => bcrypt('12345678'),
        //         'role_id' => $admin->id
        //     ]
        // );
        // User::create(
        //     [
        //         'name' => 'Fadhlan',
        //         'email' => 'fadhlan@email.com',
        //         'password' => bcrypt('12345678'),
        //         'role_id' => $user->id
        //     ]
        // );
        // User::create(
        //     [
        //         'name' => 'Haris',
        //         'email' => 'haris@email.com',
        //         'password' => bcrypt('12345678'),
        //         'role_id' => $user->id
        //     ]
        // );
        // User::create(
        //     [
        //         'name' => 'Pian',
        //         'email' => 'pian@email.com',
        //         'password' => bcrypt('12345678'),
        //         'role_id' => $user->id
        //     ]
        // );
        // User::create(
        //     [
        //         'name' => 'Fitano',
        //         'email' => 'fitano@email.com',
        //         'password' => bcrypt('12345678'),
        //         'role_id' => $user->id
        //     ]
        // );
        // User::create(
        //     [
        //         'name' => 'Mei',
        //         'email' => 'mei@email.com',
        //         'password' => bcrypt('12345678'),
        //         'role_id' => $user->id
        //     ]
        // );
        // User::create(
        //     [
        //         'name' => 'Apep',
        //         'email' => 'apep@email.com',
        //         'password' => bcrypt('12345678'),
        //         'role_id' => $user->id
        //     ]
        // );
        // User::create(
        //     [
        //         'name' => 'Ica',
        //         'email' => 'ica@email.com',
        //         'password' => bcrypt('12345678'),
        //         'role_id' => $user->id
        //     ]
        // );
        // User::create(
        //     [
        //         'name' => 'Fika',
        //         'email' => 'fika@email.com',
        //         'password' => bcrypt('12345678'),
        //         'role_id' => $user->id
        //     ]
        // );

        // // create 2024_21_05_Store_Procedure_And_Function
        // $file_path1 = resource_path('../database/LogDB/2024_21_05_Store_Procedure_And_Function.sql');

        // DB::unprepared(
        //     file_get_contents($file_path1)
        // );

        // create 2024_25_06_r_grade
        $file_path2 = resource_path('../database/LogDB/2024_25_06_r_grade.sql');

        DB::unprepared(
            file_get_contents($file_path2)
        );

        // create 2024_27_06_r_relation_location_type
        $file_path3 = resource_path('../database/LogDB/2024_27_06_r_relation_location_type.sql');

        DB::unprepared(
            file_get_contents($file_path3)
        );

        // create 2024_27_06_r_wilayah_kemendagri
        $file_path4 = resource_path('../database/LogDB/2024_27_06_r_wilayah_kemendagri.sql');

        DB::unprepared(
            file_get_contents($file_path4)
        );

        // create 2024_20_06_r_bank
        $file_path5 = resource_path('../database/LogDB/2024_20_06_r_bank.sql');

        DB::unprepared(
            file_get_contents($file_path5)
        );

        // create 2024_16_06_r_tax-status
        $file_path6 = resource_path('../database/LogDB/2024_16_06_r_tax-status.sql');

        DB::unprepared(
            file_get_contents($file_path6)
        );

        // create 2024_12_06_r_person_relationship
        $file_path7 = resource_path('../database/LogDB/2024_12_06_r_person_relationship.sql');

        DB::unprepared(
            file_get_contents($file_path7)
        );

        // create 2024_30_05_r_proffesion
        $file_path8 = resource_path('../database/LogDB/2024_18_07_r_proffesion.sql');

        DB::unprepared(
            file_get_contents($file_path8)
        );

        // create 2024_30_05_r_relation_type
        $file_path9 = resource_path('../database/LogDB/2024_30_05_r_relation_type.sql');

        DB::unprepared(
            file_get_contents($file_path9)
        );

        // create 2024_16_05_r_relation_lob
        $file_path10 = resource_path('../database/LogDB/2024_16_05_r_relation_lob.sql');

        DB::unprepared(
            file_get_contents($file_path10)
        );

        // create 2024_16_05_r_relation_status
        $file_path11 = resource_path('../database/LogDB/2024_16_05_r_relation_status.sql');

        DB::unprepared(
            file_get_contents($file_path11)
        );

        // create 2024_16_05_r_insurance_type
        $file_path12 = resource_path('../database/LogDB/2024_16_05_r_insurance_type.sql');

        DB::unprepared(
            file_get_contents($file_path12)
        );
        

        // create 2024_08_07_r_interest_insured
        $r_interest_insured = resource_path('../database/LogDB/2024_08_07_r_interest_insured.sql');

        DB::unprepared(
            file_get_contents($r_interest_insured)
        );

        RelationStatus::create([
            'relation_status_name' => 'Individu',
        ]);

        $file_path15 = resource_path('../database/LogDB/2024_07_31_r_coa.sql');

        DB::unprepared(
            file_get_contents($file_path15)
        );
        // create 2024_24_07_r_address_status
        $file_path16 = resource_path('../database/LogDB/2024_24_07_r_address_status.sql');

        DB::unprepared(
            file_get_contents($file_path16)
        );

        // create 2024_29_07_r_education_degree
        $r_education_degree = resource_path('../database/LogDB/2024_29_07_r_education_degree.sql');

        DB::unprepared(
            file_get_contents($r_education_degree)
        );

        // create 2024_29_07_r_certificate_qualification
        $r_certificate_qualification = resource_path('../database/LogDB/2024_29_07_r_certificate_qualification.sql');

        DB::unprepared(
            file_get_contents($r_certificate_qualification)
        );

        $file_path17 = resource_path('../database/LogDB/2024_07_31_r_coa_class.sql');

        DB::unprepared(
            file_get_contents($file_path17)
        );

        $file_path18 = resource_path('../database/LogDB/2024_07_31_r_coa_group.sql');

        DB::unprepared(
            file_get_contents($file_path18)
        );

        $file_path19 = resource_path('../database/LogDB/2024_07_31_t_relation.sql');

        DB::unprepared(
            file_get_contents($file_path19)
        );

        $file_path20 = resource_path('../database/LogDB/2024_07_31_m_role_access_menu.sql');

        DB::unprepared(
            file_get_contents($file_path20)
        );
        // create 2024_16_05_r_salutation
        $r_salutation = resource_path('../database/LogDB/2024_16_05_r_salutation.sql');

        DB::unprepared(
            file_get_contents($r_salutation)
        );

        // create 2024_08_08_r_for_bank_account
        $r_for_bank_account = resource_path('../database/LogDB/2024_08_08_r_for_bank_account.sql');

        DB::unprepared(
            file_get_contents($r_for_bank_account)
        );

        // create 2024_31_08_r_plugin_process
        $r_plugin_process = resource_path('../database/LogDB/2024_31_08_r_plugin_process.sql');

        DB::unprepared(
            file_get_contents($r_plugin_process)
        );


        $file_path27 = resource_path('../database/LogDB/2024_08_27_t_company.sql');

        DB::unprepared(
            file_get_contents($file_path27)
        );

        $file_path28 = resource_path('../database/LogDB/2024_08_27_t_company_division.sql');

        DB::unprepared(
            file_get_contents($file_path28)
        );

        $file_path29 = resource_path('../database/LogDB/2024_08_27_t_company_structure.sql');

        DB::unprepared(
            file_get_contents($file_path29)
        );

        $file_path30 = resource_path('../database/LogDB/2024_08_27_t_company_office.sql');

        DB::unprepared(
            file_get_contents($file_path30)
        );

        $file_path31 = resource_path('../database/LogDB/2024_08_27_t_employee.sql');

        DB::unprepared(
            file_get_contents($file_path31)
        );

        $file_path32 = resource_path('../database/LogDB/2024_08_27_t_user.sql');

        DB::unprepared(
            file_get_contents($file_path32)
        );

        $file_path33 = resource_path('../database/LogDB/2024_07_31_t_menu.sql');

        DB::unprepared(
            file_get_contents($file_path33)
        );
    }
}