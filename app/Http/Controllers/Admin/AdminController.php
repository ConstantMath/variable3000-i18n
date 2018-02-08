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
    $this->middleware('auth');
    $this->model = $this->getModel();
  }


  /**
   * Update // save an object
   *
   * @param $model
   * @param $request
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
   */

  public function saveObject($model, $request){
    $class = get_class($model);
    $collection = $class::findOrFail($model->id);
    if($request['created_at']){
      $request['created_at'] = Carbon::createFromFormat('d.m.Y', $model->created_at )->format('Y-m-d H:i:s');
    }
    // Checkbox update
    $request['published'] = (($model->published) ? 1 : 0);
    // Taxonomies
    if(!empty($model->taxonomies)):
      // Loop inside all taxonomies model's attributes to delete the existing ones first
      foreach ($model->taxonomies as $key => $val):
        $new_taxonomies_array = !empty($request->taxonomies[$val->parent_id]) ? $request->taxonomies[$val->parent_id] : null;
        Taxonomy::detachOldAddNew($new_taxonomies_array, $val->parent_id, $request['id']);
      endforeach;
    endif;
    // Do update
    $collection->update($request->all());
    // Redirect
    if(isset($request['finish'])){
      return redirect()->route('admin.' . snake_case($this->model) . '.index');
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

  public function createObject($class, $request){
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
    if(!empty($request->taxonomies)):
      // Loop inside all taxonomies requests
      foreach ($request->taxonomies as $key => $val):
        Taxonomy::detachOldAddNew($val, $key, $article->id);
      endforeach;
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
    return redirect()->route('admin.' . snake_case($this->getModel()) . '.index', $request->parent_id);
  }


  /**
   * Reorder an object
   *
   * @param $model
   * @param $request
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
   */

  public function orderObject($class, $request){
    $id          = $request->id;
    $new_order   = $request->new_order;
    // Select articles by parent
    $articles = $class::orderBy('order', 'asc')->get();
    if(isset($articles) && !empty($id)){
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
}
