<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('users')->insert([
        'name' => 'Variable',
        'email'  => 'bonjour@variable.club',
        'password' => bcrypt('000000'),
      ]);

    }
}
