<?php

namespace App\Providers;
use Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';
    protected $adminNamespace = 'App\Http\Controllers\Admin';
    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
      $this->mapAdminRoutes();
      $this->mapApiRoutes();
      $this->mapWebRoutes();
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
     protected function mapWebRoutes(){

      // If there is more than one language defined
      if(count(config('translatable.locales')) > 1 ){
        $locale = Request::segment(1);
        Route::prefix($locale)
            ->middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
      }else{
        Route::middleware('web')
             ->namespace($this->namespace)
             ->group(base_path('routes/web.php'));
      }
     }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace($this->namespace)
             ->group(base_path('routes/api.php'));
    }


    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapAdminRoutes()
    {
        // If there is more than one language defined
        if(count(config('translatable.locales')) > 1 ){
          $locale = Request::segment(1);
          Route::middleware('admin')
              ->as('admin.')
              ->namespace($this->adminNamespace)
              ->prefix($locale.'/admin')
              ->group(base_path('routes/admin.php'));
        }else{
            Route::middleware('admin')
                ->as('admin.')
                ->namespace($this->adminNamespace)
                ->prefix('admin')
                ->group(base_path('routes/admin.php'));
        }

    }
}
