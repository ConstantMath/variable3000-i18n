<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Language
{
  // Ajoute le suffixe (fallback) de langue  à l'url si pas de suffixe présent
  // Ex: https://mydnic.be/post/how-to-build-an-efficient-and-seo-friendly-multilingual-architecture-for-your-laravel-application
  public function handle(Request $request, Closure $next){
    // Exception : https://mydnic.be/post/how-to-build-an-efficient-and-seo-friendly-multilingual-architecture-for-your-laravel-application#comment-3308174451
    $noTranslationPrefixes = ['patternlab']; // add what ever prefix that you don't need translation
    // Check if the first segment matches a language code
    if (!in_array($request->segment(1), config('translatable.locales')) && !in_array($request->segment(1), $noTranslationPrefixes)) {
      // Store segments in array
      $segments = $request->segments();
      // Set the default language code as the first segment
      // Si un cookie de langue existe et présent dans les locales
      if($request->cookie('locale') && in_array($request->cookie('locale'), config('translatable.locales'))){
        $segments = array_prepend($segments, $request->cookie('locale'));
      }else{
        $segments = array_prepend($segments, config('app.fallback_locale'));
      }
      // Redirect to the correct url
      return redirect()->to(implode('/', $segments));
    }
    return $next($request);
  }
}
