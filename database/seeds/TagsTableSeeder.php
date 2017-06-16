<?php

use Illuminate\Database\Seeder;
use App\Tag;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      Tag::create([
        'en'  => ['name' => 'Categories', 'slug' => 'categories'],
        'fr'  => ['name' => 'Categories', 'slug' => 'categories'],
        'parent_id' => 0,
        'order' => 0,
      ]);

      Tag::create([
        'en'  => ['name' => 'Category', 'slug' => 'tags'],
        'fr'  => ['name' => 'Categorie', 'slug' => 'tags'],
        'parent_id' => 0,
        'order' => 1,
      ]);

      Tag::create([
        'en'  => ['name' => 'Categorie 1', 'slug' => 'categorie-1'],
        'fr'  => ['name' => 'Categorie 1', 'slug' => 'categorie-1'],
        'parent_id' => 1,
        'order' => 0,
      ]);

      Tag::create([
        'en'  => ['name' => 'Tag 01', 'slug' => 'tag-01'],
        'fr'  => ['name' => 'Tag 01', 'slug' => 'tag-01'],
        'parent_id' => 2,
        'order' => 0,
      ]);
    }
}
