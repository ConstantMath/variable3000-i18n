<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Article;
use App\Media;
use App\Tag;

class ArticlesController extends Controller
{

  public function __construct(){
    $this->middleware('auth');
  }

  /**
   * List all articles by parent
   *
   * @param  string  $parent_slug
   * @return \Illuminate\Http\Response
   */

  public function index($parent_slug = null){
    $articles = Article::where('parent_id', 0)->orderBy('order', 'asc')->get();
    // Ajoute les articles enfants à la collection
    foreach ($articles as $a) {
      $a->children = $a->children;
    }
    return view('admin/templates/home', compact('articles'));
  }


  /**
   * Show the form for editing the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function edit($parent_slug, $id){
    $article = Article::findOrFail($id);
    $article->parent = Article::where('slug', $parent_slug)->first();
    $article->medias = $article->medias;
    $article->image_une =  ($article->image_une)? Media::find($article->image_une) : null;
    // Taxonomies for dropdown select
    $categories = Tag::where('parent_id', 1)->lists('name', 'id')->prepend('', '');
    $tags = Tag::where('parent_id', 2)->lists('name', 'id');
  	return view('admin/templates/article-edit',  compact('article', 'categories', 'tags'));
  }


  /**
   * Show the form for creating a new resource.
   *
   * @param  string  $parent_slug
   * @return \Illuminate\Http\Response
   */

  public function create($parent_slug){
    $article = collect(new Article);
    $article->parent = Article::where('slug', $parent_slug)->first();
    // Taxonomies for dropdown select
    $categories = Tag::where('parent_id', 1)->lists('name', 'id')->prepend('', '');
    if(!empty($categories) && !empty($categories[0])){$article->tags()->attach($categories);}
    $tags = Tag::where('parent_id', 2)->lists('name', 'id');
    if(!empty($tags) && !empty($tags[0])){$article->tags()->attach($tags);}
    return view('admin.templates.article-edit', compact('article', 'categories', 'tags'));
  }


  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function update(Request $request, $id){
    $validator = Validator::make($request->all(), [
      'title' => 'required',
    ]);
    $article = Article::findOrFail($id);
    // Validator check
    if ($validator->fails()) {
      return redirect()->route('admin.articles.edit', ['parent_slug' => $article->parent_id, 'id' => $id])->withErrors($validator);
    } else {
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
      // Update de l'article
      $article->update($request->all());
      $data = $request->all();
      if(isset($data['finish'])){
        return redirect()->route('admin.index', ['parent_slug' => $article->parent_id]);
      }else{
        return redirect()->route('admin.articles.edit', ['parent_slug' => $article->parent_id, 'articles' => $id]);
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
    $validator = Validator::make($request->all(), [
      'title' => 'required',
    ]);
    $parent_slug = Article::getSlugFromId($request->input('parent_id'));

    if ($validator->fails()) {
      return redirect()->route('admin.articles.create', ['parent_slug' => $parent_slug])->withErrors($validator);
    } else {
      // Store the article
      $article = Article::create($request->all());
      // ----- Taxonomies ----- //
      $categories = $request->input('categories');
      if(!empty($categories) && !empty($categories[0])){$article->tags()->attach($categories);}
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
      return redirect()->route('admin.index', ['parent_slug' => $parent_slug]);
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
    session()->flash('flash_message', 'Article supprimé');
    return redirect('admin');
    // return redirect()->action('Admin\ArticlesController@edit', ['id'=>$id]);
  }


  /**
   * Reorder the media relative to parent
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return Json response
   */

  public function reorder(Request $request, $id){
    $parent_slug = $request->parent_slug;
    $new_order   = $request->new_order;
    if(!empty($parent_slug)){
      $articles = (!empty($parent_slug))? Article::getByParent($parent_slug) : '' ;
    }
    if(isset($articles)){
      $v = 0;
      // Loop dans les articles
      foreach ($articles as $article) {
        if($v == $new_order){$v++;}
        $a = Article::find($article->id);
        if($a->id == $id){
          $n_order = $new_order;
        }else{
          $n_order = $v;
          $v++;
        }
        $a->timestamps = false;
        $a->update(['order' => $n_order]);
      }
    }
    return response()->json([
      'status' => 'success',
    ]);
  }

}
