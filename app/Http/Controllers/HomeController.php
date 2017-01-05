<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Article;

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
    public function index()
    {
      $publications = Article::getByParent('publications')->where('published', 1);
      $pages = Article::getByParent('pages')->where('published', 1);
      return view('templates/home', compact('publications', 'pages'));
    }
}
