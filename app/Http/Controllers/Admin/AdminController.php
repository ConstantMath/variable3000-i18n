<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Article;
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
    $request['created_at'] = Carbon::createFromFormat('d.m.Y', $model->created_at )->format('Y-m-d H:i:s');
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

  public function createObject($model, $request){

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
