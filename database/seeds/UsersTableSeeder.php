<?php

use Illuminate\Database\Seeder;
//Importing laravel-permission models
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      //Create permissions
      DB::table('permissions')->insert([
        'name' => 'Admin articles',
        'guard_name' => 'web',
      ]);

      DB::table('permissions')->insert([
        'name' => 'Admin pages',
        'guard_name' => 'web',
      ]);

      DB::table('permissions')->insert([
        'name' => 'Admin categories',
        'guard_name' => 'web',
      ]);

      DB::table('permissions')->insert([
        'name' => 'Admin settings',
        'guard_name' => 'web',
      ]);

      DB::table('permissions')->insert([
        'name' => 'Admin users',
        'guard_name' => 'web',
      ]);

      DB::table('permissions')->insert([
        'name' => 'Delete users',
        'guard_name' => 'web',
      ]);

      DB::table('permissions')->insert([
        'name' => 'Admin roles & permissions',
        'guard_name' => 'web',
      ]);

      $superadmin = Role::create([
        'name' => 'Super admin',
        'guard_name' => 'web',
      ]);

      $superadmin->givePermissionTo([
        'Admin articles',
        'Admin pages',
        'Admin categories',
        'Admin roles & permissions',
        'Admin settings',
        'Admin users',
        'Delete users',
      ]);

      $admin = Role::create([
        'name' => 'Admin',
        'guard_name' => 'web',
      ]);

      $admin->givePermissionTo([
        'Admin articles',
        'Admin pages',
        'Admin categories',
        'Admin roles & permissions',
        'Admin settings',
        'Admin users',
      ]);

      $editor = Role::create([
        'name' => 'Editor',
        'guard_name' => 'web',
      ]);

      $editor->givePermissionTo([
        'Admin articles',
        'Admin pages',
        'Admin categories',
      ]);

     $variable = User::create([
         'name' => 'Variable',
         'email'  => 'bonjour@variable.club',
         'password' => '000000',
      ]);

      $variable->assignRole('Super admin');

    }
}
