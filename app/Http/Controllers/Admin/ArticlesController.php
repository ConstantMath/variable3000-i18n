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
   * Lsite des articles par parent
   *
   * @param  string  $parent_slug
   * @return \Illuminate\Http\Response
   */

  public function index($parent_slug = null){
    $articles = Article::all();
    return view('admin/index', compact('articles'));
  }


  /**
   * Show the form for creating a new resource.
   *
   * @param  string  $parent_slug
   * @return \Illuminate\Http\Response
   */

  public function create($parent_slug){
    $tags_general = Tag::where('parent_id', 1)->lists('name', 'id');
    $parent_id = Article::where('slug', $parent_slug)->pluck('id')->first();
    $article = null;
    return view('admin.article-create', compact('tags_general', 'parent_id', 'article'));
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
      $article = Article::create($request->all());
      $article->tags()->attach($request->input('tag_list'));
      // Ajoute l'image une à l'article
      if ($request->has('post_image_une')) {
        $article->media_id = $request->get('post_image_une');
        $article->update();
      }
      // Ajoute les médias à l'article
      if ($request->has('post_medias') && !empty($request->post_medias[0])) {
        $medias = $request->get('post_medias');
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
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function show($id)
  {
      //
  }


  /**
   * Show the form for editing the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function edit($parent_slug, $id){
    $article = Article::findOrFail($id);
    $parent_id = Article::where('slug', $parent_slug)->pluck('id')->first();
    $medias = $article->medias;
    $image_une =  ($article->media_id)? Media::find($article->media_id) : null;
    // liste les tags
    $tags_general = Tag::where('parent_id', 1)->lists('name', 'id');
	  return view('admin/article-edit',  compact('article', 'medias', 'tags_general', 'image_une', 'parent_id', 'parent_slug'));
  }


  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function update(Request $request, $id){
    $article = Article::findOrFail($id);
    $parent_slug = Article::getSlugFromId($request->input('parent_id'));
    // Checkbox update
    $article->published = (($request->published) ? 1 : 0);
    // Tags généraux
    $tags_general = ($request->input('tag_list')? : []);
    $parent_tag_id = 1;
    $article->tags()->sync($this->processTags($tags_general, $parent_tag_id));

    $article->update($request->all());
    return redirect()->route('admin.index', ['parent_slug' => $parent_slug]);
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
      // loop dans les articles
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
      'status'        => 'success',
    ]);
  }


  /**
   * Ajoute les tags en fonction du tableau retourné par Select2.js
   *
   * @param  $tags
   * @return Aray
   */

  private function processTags($tags, $parent_tag_id){

    // sépare le tableau retourné en numeric (tags existant) et string (nouveaux tags)
    $currentTags = array_filter($tags, 'is_numeric');
    $newTags = array_filter($tags, 'is_string');

    // crée un nouveau tag pour chaque string retournée et l'ajoute au tableau ‘tags' courant
    foreach ($newTags as $newTag):
      // check si le tag n'es tpas déjà dans les tags existants
      if(in_array($newTag, $currentTags)):
        continue;
      endif;
      // check si le tag exsite déjà
      $tag = Tag::where("name", "=", $newTag)->first();
      // sinon, création du nouveau tag
      if(!$tag):
        $tag = Tag::create([
          'name' => $newTag,
          'parent_id' => $parent_tag_id,
        ]);
      endif;
      // et ajoute le nouvel ID au tableau
      $currentTags[] = $tag->id;
    endforeach;
    return $currentTags;
  }


}
