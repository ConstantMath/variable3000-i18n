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
          'fr'  => ['title' => 'Projecs', 'slug' => 'projecs'],
          'published' => 1,
          'parent_id' => 0,
          'order' => 0,
      ]);

      Article::create([
          'en'  => ['title' => 'News', 'slug' => 'news'],
          'fr'  => ['title' => 'News', 'slug' => 'news'],
          'published' => 1,
          'parent_id' => 0,
          'order' => 1,
      ]);

      Article::create([
          'en'  => ['title' => 'Static texts', 'slug' => 'static_texts'],
          'fr'  => ['title' => 'Textes', 'slug' => 'textes'],
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

      // Add 2 news
      for ($i=0; $i < 2; $i++) {
        $faker = Faker\Factory::create();
        $title_en = $faker->unique()->word;
        $title_fr = $faker->unique()->word;
        Article::create([
          'published' => 1,
          'parent_id' => 2,
          'order' => $i,
          'en'  => [
            'title' => $title_en,
            'slug' => str_slug($title_en),
            'text' => $faker->text($maxNbChars = 800)
          ],
          'fr'  => [
            'title' => $title_fr,
            'slug' => str_slug($title_fr),
            'text' => $faker->text($maxNbChars = 800)
          ]
        ]);
      }

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
        'parent_id' => 3,
        'published' => 1,
        'order' => 0,
      ]);

    }
}
