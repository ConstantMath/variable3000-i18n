<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Article;
use App\Media;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }


    /**
     * Show the homepage
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
      $data = array(
        'page_class' => 'homepage',
        'page_title' => 'Homepage',
      );
      $articles = Article::where('parent_id', 0)
                    ->where('published', 1)
                    ->orderBy('order', 'asc')
                    ->get();
      return view('templates/home', compact('articles','data'));
    }
}
