<?php

use Illuminate\Database\Seeder;
use App\Page;

class Pages extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Page::create([
            'en'  => ['title' => 'A page', 'slug' => 'a-page'],
            'fr'  => ['title' => 'Une page', 'slug' => 'une-page'],
            'published' => 1,
            'parent_id' => 0,
        ]);

        Page::create([
            'en'  => ['title' => 'A sub-page', 'slug' => 'a-sub-page'],
            'fr'  => ['title' => 'Une sous-page', 'slug' => 'une-sous-page'],
            'published' => 1,
            'parent_id' => 1,
        ]);

    }
}
