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
    Lang::setLocale('en');
    $this->middleware('auth');
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
    // Taxonomies for dropdown select
    $categories = Tag::where('parent_id', 1)->get()->pluck('name', 'id')->prepend('', '');
    $tags = Tag::where('parent_id', 2)->get()->pluck('name', 'id');
  	return view('admin/templates/article-edit',  compact('article', 'categories', 'tags', 'data'));
  }


  /**
   * Show the form for creating a new resource.
   *
   * @param  string  $parent_slug
   * @return \Illuminate\Http\Response
   */

  public function create($parent_slug){
    $data = array(
      'page_class' => 'article create',
      'page_title' => 'Article create',
    );
    $article = collect(new Article);
    $article->parent = Article::where('slug', $parent_slug)->first();
    // Taxonomies for dropdown select
    $categories = Tag::where('parent_id', 1)->pluck('name', 'id')->prepend('', '');
    if(!empty($categories) && !empty($categories[0])){$article->tags()->attach($categories);}
    $tags = Tag::where('parent_id', 2)->pluck('name', 'id');
    if(!empty($tags) && !empty($tags[0])){$article->tags()->attach($tags);}
    return view('admin.templates.article-edit', compact('article', 'categories', 'tags', 'data'));
  }


  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function update(Request $request, $id){
    $unset_requests = array();
    // Validator test
    if(empty($request->input('en.title'))){
      $validator = Validator::make($request->all(), [
        'title' => 'required|size:400',
      ]);
    }else{

      $validator = Validator::make($request->all(), [
        'title' => 'size:400',
      ]);
    }
    // Get the current article
    $article = Article::findOrFail($id);
    // Loop in locales to test if empty
    foreach (config('translatable.locales') as $lang){
      if($lang != Lang::getLocale()){
        // If lang title is empty
        if(empty($request->input($lang.'.title'))){
          // If text is not empty
          if(!empty($request->input($lang.'.text'))){
            $validator = Validator::make($request->all(), [
              'title' => 'required|size:400',
            ]);
          }else{
            // If lang title is empty : add to unset_requests array to avoid saving it later
            array_push($unset_requests, $lang);
            $translation = $article->getTranslation($lang);
            if(!empty($translation) && $translation->locale != Lang::getLocale()){
              // Delete this translation
              $translation->delete();
            }
          }
        }
      }
    }

    // Validator check
    if ($validator->fails()) {
      return redirect()->route('admin.articles.edit', ['parent_slug' => $article->parent_id, 'id' => $id])->withErrors($validator);
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
      // Article update : test if there are requests to remove ($unset_requests)
      if(empty($unset_requests)):
        $article->update($request->all());
      else:
        $article->update($request->except($unset_requests));
      endif;
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
    $validator = Validator::make($request->all(), [
      'title' => 'required',
    ]);
    $parent_slug = Article::getSlugFromId($request->input('parent_id'));

    if ($validator->fails()) {
      return redirect()->route('admin.articles.create', ['parent_slug' => $parent_slug])->withErrors($validator);
    } else {
      // Increment order of all articles
      DB::table('articles')
            ->where('parent_id', $request->input('parent_id'))
            ->increment('order');
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
    return redirect('admin');
    // return redirect()->action('Admin\ArticlesController@edit', ['id'=>$id]);
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
