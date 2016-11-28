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
      for ($i=0; $i < 10; $i++) {
        $faker = Faker\Factory::create();
        $title = $faker->unique()->word;

        DB::table('articles')->insert([
          'title' => $title,
          'slug' => str_slug($title),
          'description' => $faker->text($maxNbChars = 400),
          'published' => 1,
        ]);
      }
    }
}
