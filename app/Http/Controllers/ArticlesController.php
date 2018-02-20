<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Article;

class ArticlesController extends FrontController{

  /**
   * Create a new controller instance.
   *
   * @return void
   */
  public function __construct(){

  }

  /**
   * Show the article
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function show($slug){
    $article = Article::whereTranslation('slug', $slug)->first();
    $data = array(
      'page_class' => 'article'.' '.$article->slug,
      'page_title' => $article->title,
    );
    // $text01 = Article::where('slug', 'about')->where('published', 1)->first();
    return view('templates/article', compact('article', 'data'));
  }
}
