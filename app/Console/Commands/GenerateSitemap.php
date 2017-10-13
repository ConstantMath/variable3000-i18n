<?php

namespace App\Console\Commands;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'sitemap:GenerateSitemap';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'GenerateSitemap description';

  /**
   * Create a new command instance.
   *
   * @return void
   */
  public function __construct()
  {
      parent::__construct();
  }

  /**
   * Execute the console command.
   *
   * @return mixed
   */
  public function handle()
  {
      $this->info('sitemap generate started..');
      // Sitemap::create()
      //   ->add(Url::create('/')
      //       ->setLastModificationDate(Carbon::yesterday())
      //       ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
      //       ->setPriority(0.1))
      //
      //   ->writeToFile(public_path('sitemap_test.xml');
      Sitemap::create()
        // home
        ->add(Url::create('/')
            ->setLastModificationDate(Carbon::yesterday())
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY)
            ->setPriority(0.8))
        ->writeToFile(public_path('sitemap.xml'));


  }
}
