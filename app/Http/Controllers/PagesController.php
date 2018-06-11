<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Page;
use App\Setting;

class PagesController extends FrontController{

  /**
   * Create a new controller instance.
   *
   * @return void
   */
  public function __construct(){
      parent::__construct();
  }
  /**
   * Show the article
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function show($slug = 0){
    $articles = Page::where('parent_id', 0)
                  ->where('published', 1)
                  ->orderBy('order', 'asc')
                  ->get();
    if($slug != 0){
      $article = $articles->first();
    }else{
      $article = Page::whereTranslation('slug', $slug)->first();
    }
    $data = array(
      'page_class' => 'article'.' '.$article->slug,
      'page_title' => $article->title,
    );
    return view('templates/page', compact('article', 'articles', 'data'));
  }
}
