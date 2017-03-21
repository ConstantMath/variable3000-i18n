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
        'name' => 'Constant Mathieu',
        'email'  => 'constant@variable.club',
        'password' => bcrypt('3ofjdhlv04Hkz6b'),
      ]);

      DB::table('users')->insert([
        'name' => 'Antoine Jaunard',
        'email'  => 'antoine@variable.club',
        'password' => bcrypt('lm3o25H28CZ2y3K'),
      ]);
    }
}
