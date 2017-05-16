<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests;
use App\Article;
use View;

class AdminController extends Controller
{

  public function __construct(){
    $this->middleware('auth');
    // Header share : get all parent articles
    $parent_articles = Article::where('parent_id', 0)->get();
    View::share('parent_articles', $parent_articles );
  }
}
