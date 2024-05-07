<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Menu;
use App\Models\Role;
use App\Models\RoleAccessMenu;
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
                'menu_is_deleted' => 0,
                'menu_created_by' => 'admin'
            ]
        );
        $settings = Menu::create(
            [
                'menu_name'       => 'Settings',
                'menu_is_deleted' => 0,
                'menu_created_by' => 'admin'
            ]
        );
        $aclmenu = Menu::create(
            [
                'menu_name'       => 'ACL - Menu',
                'menu_parent_id'  => $settings->id,
                'menu_url'        => 'settings/menu',
                'menu_is_deleted' => 0,
                'menu_created_by' => 'admin'
            ]
        );
        $aclrole = Menu::create(
            [
                'menu_name'       => 'ACL - Role',
                'menu_parent_id'  => $settings->id,
                'menu_url'        => 'settings/role',
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
            'menu_id' => $settings->id
        ]);
        RoleAccessMenu::create([
            'role_id' => $admin->id,
            'menu_id' => $aclmenu->id
        ]);
        RoleAccessMenu::create([
            'role_id' => $admin->id,
            'menu_id' => $aclrole->id
        ]);
        RoleAccessMenu::create([
            'role_id' => $user->id,
            'menu_id' => $dashboard->id
        ]);
        RoleAccessMenu::create([
            'role_id' => $admin->id,
            'menu_id' => $policy->id
        ]);
        RoleAccessMenu::create([
            'role_id' => $user->id,
            'menu_id' => $policy->id
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
