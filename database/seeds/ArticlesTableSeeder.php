<?php

use Illuminate\Database\Seeder;

class ArticlesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $title = $faker->unique()->title;

      DB::table('users')->insert([
        'title' => $title,
        'slug' => str_slug($title),
        'description' => $faker->paragraph,
        
      ]);
    }
}
