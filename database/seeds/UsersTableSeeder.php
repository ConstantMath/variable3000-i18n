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
        'password' => bcrypt('3myAwLRjOEd0lha'),
      ]);

      DB::table('users')->insert([
        'name' => 'Antoine Jaunard',
        'email'  => 'antoine@variable.club',
        'password' => bcrypt('L9G8GQA3m123khB'),
      ]);
    }
}
