<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Article;
use App\Media;
use App\Taxonomy;
use DB;
use Carbon\Carbon;
use Lang;
use App\Http\Requests\Admin\ArticleRequest;

class ArticlesController extends AdminController
{

  public function __construct(){
    $parent_articles = Article::where('parent_id', 0)->get();
    Lang::setLocale(config('app.locale'));
    $this->middleware('auth');
    parent::__construct();
  }

  /**
   * List all articles by parent
   *
   * @param  string  $parent_id
   * @return \Illuminate\Http\Response
   */

  public function index($parent_id = 0){
    $articles = Article::orderBy('order', 'asc')
                  ->orderBy('created_at', 'desc')
                  ->get();
    $data = array(
      'page_class' => 'index',
      'page_title' => 'Articles',
      'page_id'    => 'index-articles',
    );
    return view('admin/templates/articles-index', compact('articles', 'data'));
  }


  /**
   * Show the form for editing the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function edit($id){
    $article = Article::findOrFail($id);
    $data = array(
      'page_class' => 'article',
      'page_title' => 'Article edit',
      'page_id'    => 'index-',
    );
  	return view('admin/templates/article-edit',  compact('article', 'data'));
  }


  /**
   * Show the form for creating a new resource.
   *
   * @param  string  $parent_slug
   * @return \Illuminate\Http\Response
   */

  public function create($parent_id = 0){
    $data = array(
      'page_class' => 'article create',
      'page_title' => 'Article create',
      'page_id'    => 'index-'.$parent_id,
    );
    $article = new Article;
    $article->parent = new Article;
    return view('admin.templates.article-edit', compact('article', 'data'));
  }


  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   */

  public function update(Article $article, ArticleRequest $request){
    // Save article
    return $this->saveObject($article, $request);
  }


  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */

  public function store(ArticleRequest $request){
      // Increment order of all articles
      DB::table('articles')
            ->where('parent_id', $request->input('parent_id'))
            ->increment('order');
      // Article create
      $article = Article::create($request->all());
      // ----- Taxonomies : categories ----- //
      $categories = $request->input('categories');
      if(!empty($categories) && !empty($categories[0])){$article->tags()->attach($categories);}
      // Tags
      $tags_parent_id = 2;
      $tags_input = $request->input('tag_list');
      Tag::detachOldAddNew($tags_input, $tags_parent_id, $article->id);
      if(!empty($tags) && !empty($tags[0])){$article->tags()->attach($tags);}
      // Image une
      if ($request->has('une') && !empty($request->une[0])) {
        $medias = $request->get('une');
        $medias_a = explode(",", $medias[0]);
        if($medias_a && is_array($medias_a)){
          foreach ($medias_a as $media) {
            $media = Media::findOrFail($media);
            $article->medias()->save($media);
          }
        }
      }
      // Medias gallery
      if ($request->has('gallery') && !empty($request->gallery[0])) {
        $medias = $request->get('gallery');
        $medias_a = explode(",", $medias[0]);
        if($medias_a && is_array($medias_a)){
          foreach ($medias_a as $media) {
            $media = Media::findOrFail($media);
            $article->medias()->save($media);
          }
        }
      }
      return redirect()->route('admin.articles.index', ['parent_id' => $article->parent_id]);

  }


  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function destroy($id){
    $article = Article::findOrFail($id);

    // cascade delete medias
    foreach ($article->medias as $media) {
      Media::deleteMediaFile($media->id);
    }
    $article -> delete();
    session()->flash('flash_message', 'Deleted');
    return redirect()->route('admin.articles.index');
  }


  /**
   * Reorder the articles relative to parent
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return Json response
   */

   public function reorder(Request $request, $id){
     $parent_id   = $request->parent_id;
     $new_order   = $request->new_order;
     // Select articles by parent
     if(!empty($parent_id)){
       $articles = Article::where('parent_id', $parent_id)
                    ->orderBy('order', 'asc')
                    ->get();
     }
     if(isset($articles)){
       $v = 0;
       // Articles loop
       foreach ($articles as $article) {
         if($v == $new_order){$v++;}
         if($article->id == $id){
           $n_order = $new_order;
         }else{
           $n_order = $v;
           $v++;
         }
         $article->timestamps = false;
         // Update article with new order
         $article->update(['order' => $n_order]);
       }
     }
     return response()->json([
      'status' => 'success',
     ]);
   }

}
