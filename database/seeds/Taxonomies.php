<?php

use Illuminate\Database\Seeder;
use App\Taxonomy;

class Taxonomies extends Seeder
{

      /**
       * Run the database seeds.
       *
       * @return void
       */
      public function run()
      {
        Taxonomy::create([
          'en'  => ['name' => 'Categories', 'slug' => 'categories'],
          'fr'  => ['name' => 'Categories', 'slug' => 'categories'],
          'parent_id' => 0,
          'order' => 0,
        ]);

        Taxonomy::create([
          'en'  => ['name' => 'Tags', 'slug' => 'tags'],
          'fr'  => ['name' => 'Tags', 'slug' => 'tags'],
          'parent_id' => 0,
          'order' => 1,
        ]);

        Taxonomy::create([
          'en'  => ['name' => 'Categorie 1', 'slug' => 'categorie-1'],
          'fr'  => ['name' => 'Categorie 1', 'slug' => 'categorie-1'],
          'parent_id' => 1,
          'order' => 0,
        ]);

        Taxonomy::create([
          'en'  => ['name' => 'Tag 01', 'slug' => 'tag-01'],
          'fr'  => ['name' => 'Tag 01', 'slug' => 'tag-01'],
          'parent_id' => 2,
          'order' => 0,
        ]);
      }

}
