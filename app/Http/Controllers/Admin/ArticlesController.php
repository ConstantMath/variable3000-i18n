<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Article;
use App\Media;
use App\Tag;
use DB;
use Carbon\Carbon;
use Lang;

class ArticlesController extends AdminController
{

  public function __construct(){
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
    if($parent_id > 0){
      $articles = Article::where('id', $parent_id)
                    ->orderBy('order', 'asc')
                    ->orderBy('created_at', 'desc')
                    ->get();
      $data = array(
        'page_class' => 'index-'.$parent_id,
        'page_title' => 'Index',
      );
    }else{
      $articles = Article::where('parent_id', $parent_id)
                    ->orderBy('order', 'asc')
                    ->orderBy('created_at', 'desc')
                    ->get();
      $data = array(
        'page_class' => 'index',
        'page_title' => 'Index',
      );
    }
    return view('admin/templates/articles-index', compact('articles', 'data'));
  }


  /**
   * Show the form for editing the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function edit($parent_id, $id){
    $article = Article::findOrFail($id);
    $data = array(
      'page_class' => 'article',
      'page_title' => 'Article edit',
    );
    $article->parent = Article::where('id', $parent_id)->first();
    $article->medias = $article->medias;
    $article->image_une =  ($article->image_une)? Media::find($article->image_une) : null;
  	return view('admin/templates/article-edit',  compact('article', 'data'));
  }


  /**
   * Show the form for creating a new resource.
   *
   * @param  string  $parent_slug
   * @return \Illuminate\Http\Response
   */

  public function create($parent_id){
    $data = array(
      'page_class' => 'article create',
      'page_title' => 'Article create',
    );
    $article = new Article;
    $article->parent = Article::where('id', $parent_id)->first();
    return view('admin.templates.article-edit', compact('article', 'data'));
  }


  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   */

  public function update(Request $request, $id){
    // Get the current article
    $article = Article::findOrFail($id);
    // Validator test by lang
    foreach (config('translatable.locales') as $lang){
      if(empty($request->input($lang.'.title'))){
        $validator = Validator::make($request->all(), [
          'title' => 'required|max:400',
        ]);
      }
    }
    // Validator check
    if (isset($validator) && $validator->fails()) {
      return redirect()->route('admin.articles.edit', ['parent_slug' => $article->parent_id, 'id' => $id])->withErrors($validator)->withInput();
    } else {
      $request['created_at'] = Carbon::createFromFormat('d.m.Y', $request->input('created_at'))->format('Y-m-d H:i:s');
      // Checkbox update
      $request['published'] = (($request->published) ? 1 : 0);
      // ----- Taxonomies ----- //
      // Categories
      $categories_parent_id = 1;
      $categories_input = $request->input('categories');
      Tag::detachOldAddNew($categories_input, $categories_parent_id, $id);
      // Tags
      $tags_parent_id = 2;
      $tags_input = $request->input('tag_list');
      if(!empty($tags_input)){
        $new_tags = Tag::processTags($tags_input, $tags_parent_id);
      }else{
        $new_tags = "";
      }
      Tag::detachOldAddNew($new_tags, $tags_parent_id, $id);
      // Article update
      $article->update($request->all());
      $data = $request->all();
      if(isset($data['finish'])){
        return redirect()->route('admin.index', ['parent_id' => $article->parent_id]);
      }else{
        return redirect()->route('admin.articles.edit', ['parent_id' => $article->parent_id, 'articles' => $id]);
      }
    }
  }


  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */

  public function store(Request $request){
    // Validator test
    // if(empty($request->input(Lang::getLocale().'.title'))){
    foreach (config('translatable.locales') as $lang){
      if(empty($request->input($lang.'.title'))){
        $validator = Validator::make($request->all(), [
          'title' => 'required|max:400',
        ]);
      }
    }
    // Validation test
    if (isset($validator) && $validator->fails()) {
      return redirect()->route('admin.articles.create', ['parent_id' => $request->input('parent_id')])->withErrors($validator)->withInput();
    } else {
      // Increment order of all articles
      DB::table('articles')
            ->where('parent_id', $request->input('parent_id'))
            ->increment('order');
      // Article create
      $article = Article::create($request->all());
      // ----- Taxonomies : categories ----- //
      $categories = $request->input('categories');
      if(!empty($categories) && !empty($categories[0])){$article->tags()->attach($categories);}
      // ----- Taxonomies: tags ----- //
      $tags = $request->input('tag_list');
      if(!empty($tags) && !empty($tags[0])){$article->tags()->attach($tags);}
      // Image une
      if ($request->has('post_image_une')) {
        $article->image_une = $request->get('post_image_une');
        $article->update();
      }
      // Medias gallery
      if ($request->has('mediagallery') && !empty($request->mediagallery[0])) {
        $medias = $request->get('mediagallery');
        $medias_a = explode(",", $medias[0]);
        if($medias_a && is_array($medias_a)){
          foreach ($medias_a as $media) {
            $media = Media::findOrFail($media);
            $article->medias()->save($media);
          }
        }
      }
      return redirect()->route('admin.index', ['parent_id' => $article->parent_id]);
    }
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
    return redirect()->route('admin.index', ['parent_id' => $article->parent_id]);
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
