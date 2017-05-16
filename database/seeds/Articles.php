<?php

use Illuminate\Database\Seeder;

class Articles extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $faker = Faker\Factory::create();
      DB::table('articles')->insert([
        'title' => 'Projects',
        'slug'  => 'projects',
        'published' => 1,
        'parent_id' => 0,
        'order' => 0,
      ]);

      DB::table('articles')->insert([
        'title' => 'News',
        'slug'  => 'news',
        'published' => 1,
        'parent_id' => 0,
        'order' => 1,
      ]);

      DB::table('articles')->insert([
        'title' => 'Texts',
        'slug'  => 'texts',
        'published' => 1,
        'parent_id' => 0,
        'order' => 2,

      ]);

      for ($i=0; $i < 2; $i++) {
        $title = $faker->unique()->word;
        DB::table('articles')->insert([
          'title' => $title,
          'slug' => str_slug($title),
          'intro' => $faker->text($maxNbChars = 300),
          'text' => $faker->text($maxNbChars = 800),
          'parent_id' => 0,
          'published' => 1,
          'order' => $i,
        ]);
      }

      $title = $faker->unique()->word;
      DB::table('articles')->insert([
        'title' => $title,
        'slug' => str_slug($title),
        'intro' => $faker->text($maxNbChars = 300),
        'text' => $faker->text($maxNbChars = 800),
        'parent_id' => 1,
        'published' => 1,
        'order' => 0,
      ]);


      DB::table('articles')->insert([
        'title' => 'Contact',
        'slug'  => 'contact',
        'published' => 1,
        'parent_id' => 2,
        'order' => 0,
      ]);

    }
}
