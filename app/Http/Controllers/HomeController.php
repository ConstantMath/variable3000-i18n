<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Article;
use App\Media;
use GrahamCampbell\Markdown\Facades\Markdown;

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
      $articles = Article::where('parent_id', 0)->orderBy('order', 'asc')->get();
      // Ajoute les articles enfants à la collection
      foreach ($articles as $a) {
        $a->children = $a->children;
      }
      return view('templates/home', compact('articles'));
    }
}
