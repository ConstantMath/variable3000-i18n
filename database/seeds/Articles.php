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


      Article::create([
          'en'  => ['title' => 'Projects', 'slug' => 'projects'],
          'fr'  => ['title' => 'Projets', 'slug' => 'projets'],
          'published' => 1,
          'parent_id' => 0,
          'order' => 0,
      ]);

      Article::create([
          'en'  => ['title' => 'Static texts', 'slug' => 'static_texts'],
          'fr'  => ['title' => 'Textes statiques', 'slug' => 'textes-statiques'],
          'published' => 1,
          'parent_id' => 0,
          'order' => 2,
      ]);


      // Add 1 project
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
        'parent_id' => 1,
        'published' => 1,
        'order' => 0,
      ]);

      // // Add 1 text
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
        'parent_id' => 2,
        'published' => 1,
        'order' => 0,
      ]);

    }
}
