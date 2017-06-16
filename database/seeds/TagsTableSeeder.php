<?php

use Illuminate\Database\Seeder;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('tags')->insert([
          'name' => 'Categories',
          'slug'  => 'categories',
          'parent_id' => 0,
          'order' => 0,
      ]);

      DB::table('tags')->insert([
        'name' => 'Tags',
        'slug'  => 'tags',
        'parent_id' => 0,
        'order' => 0,
      ]);

      DB::table('tags')->insert([
        'name' => 'Categorie 01',
        'slug' => 'categorie-01',
        'parent_id' => 1,
        'order' => 0,
      ]);

      DB::table('tags')->insert([
        'name' => 'Tag 01',
        'slug' => 'tag-01',
        'parent_id' => 2,
        'order' => 0,
      ]);
    }
}
