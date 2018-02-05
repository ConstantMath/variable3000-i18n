<?php

use Illuminate\Database\Seeder;
use App\Article;

class Articles extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {


      // Add 1 article
      $faker = Faker\Factory::create();
      $title_en = $faker->unique()->word;
      $title_fr = $faker->unique()->word;
      Article::create([
        'en'  => [
          'title' => $title_en,
          'slug' => str_slug($title_en),
          'text' => $faker->text($maxNbChars = 800)
        ],
        'fr'  => [
          'title' => $title_fr,
          'slug' => str_slug($title_fr),
          'text' => $faker->text($maxNbChars = 800)
        ],
        'published' => 1,
        'order' => 0,
      ]);

    }
}
