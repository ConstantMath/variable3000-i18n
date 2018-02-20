<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Article;
use App\Media;
use App\Setting;

class HomeController extends FrontController{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(){
      parent::__construct();
    }


    /**
     * Show the homepage
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
      $settings = Setting::find([1,2]);
      $website_description = $settings[0]->content;
      $data = array(
        'page_class' => config('app.name'),
        'page_title' => config('app.name'),
      );
      $articles = Article::where('parent_id', 0)
                    ->where('published', 1)
                    ->orderBy('order', 'asc')
                    ->get();
      return view('templates/home', compact('articles','data'));
    }
}
