<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Article;

class ArticlesController extends Controller{

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

  public function show($parent_slug, $slug){
    $article = Article::where('slug', $slug)->first();
    $image_une =  ($article->media_id)? Media::find($article->media_id) : null;
    return view('templates/article-view', compact('article', 'image_une'));
  }

}
