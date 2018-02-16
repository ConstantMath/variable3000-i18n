<?php

namespace App\Http\Middleware;
use App;
use Closure;
use Illuminate\Support\Facades\Auth;

class PermissionsMiddleware{

    /**
    * Handle an incoming request.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  \Closure  $next
    * @return mixed
    */

    public function handle($request, Closure $next){
        $locale_path = !empty(App::getLocale()) ? App::getLocale().'/' : '' ;
        // Articles
        if ($request->is($locale_path.'admin/articles/*')) {
          if (!Auth::user()->hasPermissionTo('Admin articles')) {
            abort('401');
          }
        }
        // Pages
        if ($request->is($locale_path.'admin/pages/*')) {
          if (!Auth::user()->hasPermissionTo('Admin pages')) {
            abort('401');
          }
        }
        // Taxonomies
        if ($request->is($locale_path.'admin/taxonomies/*')) {
          if (!Auth::user()->hasPermissionTo('Admin categories')) {
            abort('401');
          }
        }
        // Users
        if ($request->is($locale_path.'admin/users/*')) {
          if (!Auth::user()->hasPermissionTo('Admin users')) {
            abort('401');
          }
        }
        // Roles & permissions
        if ($request->is($locale_path.'admin/roles/*') || $request->is($locale_path.'admin/permissions/*')) {
          if (!Auth::user()->hasPermissionTo('Admin roles & permissions')) {
            abort('401');
          }
        }
        // Settings
        if ($request->is($locale_path.'admin/settings/*')) {
          if (!Auth::user()->hasPermissionTo('Admin settings')) {
            abort('401');
          }
        }
        return $next($request);
    }
}
