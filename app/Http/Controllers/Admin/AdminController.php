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
    $article = $class::findOrFail($model->id);
    if($request['created_at']){
      $request['created_at'] = Carbon::createFromFormat('d.m.Y', $request->created_at )->format('Y-m-d H:i:s');
    }
    // Checkbox update
    if($model->published):
      $request['published'] = (($request['published']) ? 1 : 0);
    endif;
    // Taxonomies
    if(!empty($taxonomies)):
      Taxonomy::manageRelationships($taxonomies, $request, $article->id, $class);
    endif;
    // Do update
    $article->update($request->all());
    // Redirect
    session()->flash('flash_message', __('admin.updated'));
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
      Taxonomy::manageRelationships($taxonomies, $request, $article->id, $class);
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
    session()->flash('flash_message', __('admin.created'));
    if(isset($request['finish'])){
      return redirect()->route('admin.' . snake_case($this->model) . '.index');
    }else{
      return redirect()->route('admin.' . snake_case($this->model) . '.edit', $article->id);
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
    session()->flash('flash_message', __('admin.deleted'));
    return redirect()->route('admin.' . snake_case($this->model) . '.index', $article->parent_id);
  }

  /**
   * Reorder an object
   *
   * @param $class
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
   */

  public function orderObject(Request $request, $mediatable_type){

    $count = 0;
    $class = $this->getClass($mediatable_type);

    if (count($request->json()->all())) {
      $ids = $request->json()->all();
      // Loop through update positions
      foreach($ids as $i => $key){
        $id = $key['id'];
        $position = $key['position'];
        $article = $class::find($id);
        $article->order = $position;
        $article->timestamps = false;
        $article->save();
        $count++;
      }
      $response = 'Articles ordered';
      return response()->json( $response );
    } else {
      $response = 'Nothing to order';
      return response()->json( $response );
    }
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


}
