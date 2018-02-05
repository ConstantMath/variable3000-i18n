<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $this->call(Articles::class);
      $this->call(UsersTableSeeder::class);
      $this->call(Taxonomies::class);
      $this->call(pages::class);
    }
}
