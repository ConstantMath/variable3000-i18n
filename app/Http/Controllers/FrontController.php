<?php

namespace App\Http\Controllers;
use App\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

class FrontController extends Controller
{
  public function __construct(){
    $google_analytics = Setting::find(2);
    $google_analytics_content = (!empty($google_analytics->content)) ? $google_analytics->content : '' ;
    View::share('google_analytics', $google_analytics_content);
  }
}
