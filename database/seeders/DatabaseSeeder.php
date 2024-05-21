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
    }
}
