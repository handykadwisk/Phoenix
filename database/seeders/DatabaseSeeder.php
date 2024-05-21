<?php

namespace Database\Seeders;

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
                'menu_url'        => 'relation',
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
                'menu_url'        => 'group',
                'menu_is_deleted' => 0,
                'menu_sequence'   => 4,
                'menu_created_by' => 'admin'
            ]
        );

        // create role
        $admin = Role::create([
            'role_name' => 'Admin'
        ]);
        $user = Role::create([
            'role_name' => 'User'
        ]);

        // mapping
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
            'menu_id' => $group->id
        ]);

        // create user
        User::create(
            [
                'name' => 'admin',
                'email' => 'admin@email.com',
                'password' => bcrypt('12345678'),
                'role_id' => $admin->id
            ]
        );
        User::create(
            [
                'name' => 'user',
                'email' => 'user@email.com',
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
    }
}
