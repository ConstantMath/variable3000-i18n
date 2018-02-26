<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Article;
use App\Page;
use App\Media;
use App\Taxonomy;
use DB;
use Carbon\Carbon;
use Lang;

class AdminController extends Controller{

  /**
   * Model name
   *
   * @var string
   */

  protected $model = '';


  /**
   * Construct
   *
   * @var string
   */

  public function __construct(){
    $this->middleware(['auth', 'permissions'])->except('index');
    $this->model = $this->getModel();
  }


  /**
   * Update // save an object
   *
   * @param $model
   * @param $request
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
   */

  public function saveObject($model, $request, $taxonomies = false){
    $class = get_class($model);
    $collection = $class::findOrFail($model->id);
    if($request['created_at']){
      $request['created_at'] = Carbon::createFromFormat('d.m.Y', $request->created_at )->format('Y-m-d H:i:s');
    }
    // Checkbox update
    if($model->published):
      $request['published'] = (($request['published']) ? 1 : 0);
    endif;
    // Taxonomies
    if(!empty($taxonomies)):
      $this->manageTaxonomies($taxonomies, $request, $collection->id, $class);
    endif;
    // Do update
    $collection->update($request->all());
    // Redirect
    session()->flash('flash_message', 'Updated');
    if(isset($request['finish'])){
      return redirect()->route('admin.' . snake_case($this->model) . '.index', $request->parent_id);
    }else{
      return redirect()->route('admin.' . snake_case($this->model) . '.edit', $request->id);
    }
  }


  /**
   * Update // save an object
   *
   * @param $model
   * @param $request
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
   */

  public function createObject($class, $request, $return_type = 'redirect', $taxonomies = false){
    // Increment order of all articles
    if(isset($request->order)):
      if(empty($request->parent_id)):
        $incremented = $class::increment('order');
      else:
        $incremented = $class::where('parent_id', $request->parent_id)->increment('order');
      endif;
    endif;
    // Article create
    $article = $class::create($request->all());
    // Taxonomies
    if(!empty($taxonomies)):
      $this->manageTaxonomies($taxonomies, $request, $article->id, $class);
    endif;
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
    session()->flash('flash_message', 'Created');
    if($return_type == 'redirect'){
      return redirect()->route('admin.' . snake_case($this->getModel()) . '.index', $request->parent_id);
    }else{
      return $article;
    }
  }


  /**
   * Delete
   *
   * @param $model
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
   */

  public function destroyObject($model, $path = 'index'){
    $class = get_class($model);
    $article = $class::findOrFail($model->id);
    // cascade delete medias
    if(!empty($article->medias)):  foreach ($article->medias as $media):
      Media::deleteMediaFile($media->id);
    endforeach; endif;
    $article -> delete();
    session()->flash('flash_message', 'Deleted');
    return redirect()->route('admin.' . snake_case($this->model) . '.index', $article->parent_id);
  }

  /**
   * Reorder an object
   *
   * @param $class
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
   */

  public function orderObject(Request $request, $mediatable_type){
    $class       = $this->getClass($mediatable_type);
    $id          = $request->id;
    $parent_id   = !empty($request->parent_id) ? $request->parent_id : 0;
    $new_order   = $request->new_order;
    // Select articles by parent
    $articles = $class::where('parent_id', $parent_id)
                 ->orderBy('order', 'asc')
                 ->get();
    // Reorder
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


  /**
  * Get model name, if isset the model parameter, then get it, if not then get the class name, strip "Controller" out
  *
  * @return string
  */

  protected function getModel(){
    return empty($this->model) ?
      explode('Controller', substr(strrchr(get_class($this), '\\'), 1))[0]  :
      $this->model;
  }


  /**
  * Get the class from table name
  *
  * @return string
  */

  public function getClass($table_name){
    return !empty($table_name) ?
      'App\\' . studly_case(str_singular($table_name)) :
      null;
  }


  /**
  * Manage relationsips
  *
  * @param $model taxonomies
  * @param $request
  * @return string
  */

  public function manageTaxonomies($model_taxonomies, $request, $article_id, $class){
    // Loop through all model s taxonomies
    foreach ($model_taxonomies as $key => $val):
      $taxonomy_parent_id = $val;
      // Get the taxonmies request input
      $taxonomy_input = (!empty($request->taxonomies[$taxonomy_parent_id])) ? $request->taxonomies[$taxonomy_parent_id] : '' ;
      if(!empty($taxonomy_input) && !empty($taxonomy_input[0])){
        $new_taxonomies = Taxonomy::processTaxonomies($taxonomy_input, $taxonomy_parent_id);
      }else{
        $new_taxonomies = '';
      }
      // Link the taxonomies
      Taxonomy::detachOldAddNew($new_taxonomies, $taxonomy_parent_id, $article_id, $class);
    endforeach;
  }


}
