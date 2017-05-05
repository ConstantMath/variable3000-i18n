<?php

use Illuminate\Database\Seeder;

class ArticlesTableSeeder extends Seeder
{
  /**
  * Run the database seeds.
  *
  * @return void
  */
  public function run(){
    $faker = Faker\Factory::create();
    DB::table('articles')->insert([
      'title' => 'Projects',
      'slug'  => 'projects',
      'intro' => '',
      'text'  => '',
      'published' => 1,
      'parent_id' => 0,
    ]);

    DB::table('articles')->insert([
      'title' => 'Pages',
      'slug'  => 'pages',
      'intro' => '',
      'text'  => '',
      'published' => 1,
      'parent_id' => 0,
    ]);

    for ($i=0; $i < 2; $i++) {
      $title = $faker->unique()->word;
      DB::table('articles')->insert([
        'title' => $title,
        'slug' => str_slug($title),
        'intro' => $faker->text($maxNbChars = 300),
        'text' => $faker->text($maxNbChars = 800),
        'parent_id' => 1,
        'published' => 1,
      ]);
    }

    DB::table('articles')->insert([
      'title' => 'About',
      'slug'  => 'about',
      'intro' => $faker->text($maxNbChars = 300),
      'text' => $faker->text($maxNbChars = 800),
      'published' => 1,
      'parent_id' => 2,
    ]);

  }
}
