<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(Request $request)
    {
      Schema::defaultStringLength(191);
      // If many languages > Set the app locale according to the URL
      if(count(config('translatable.locales')) > 1 ){
        app()->setLocale($request->segment(1));
      }
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
