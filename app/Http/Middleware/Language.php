<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Language
{
    // Ex: https://mydnic.be/post/how-to-build-an-efficient-and-seo-friendly-multilingual-architecture-for-your-laravel-application
    public function handle(Request $request, Closure $next){
      // Check if the first segment matches a language code
      if (! in_array($request->segment(1), config('translatable.locales'))) {
        // Store segments in array
        $segments = $request->segments();
        // Set the default language code as the first segment
        $segments = array_prepend($segments, config('app.fallback_locale'));
        //dd(config('translatable.locales'));
        // dd($segments);
        // Redirect to the correct url
        return redirect()->to(implode('/', $segments));
      }
      return $next($request);
    }
}
