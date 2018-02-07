<?php

use Illuminate\Database\Seeder;
use App\Setting;

class SettingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      Setting::create([
        'en'  => ['name' => 'Website description', 'description' => 'Describe your website for search engines results (max. 320 characters)', 'content' => config('app.name') ],
        'fr'  => ['name' => 'Description du site', 'description' => 'Une courte description de votre site web pour les moteurs de recherche (320 caractères max.)', 'content' => config('app.name')],
        'order' => 0,
      ]);

      Setting::create([
        'en'  => ['name' => 'Google analytics', 'description' => 'Enter a valid tracking ID. It should look like: UA-XXXXXX-X.'],
        'order' => 0,
      ]);


    }
}
