<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests;
use App\Taxonomy;
use View;
use Carbon\Carbon;

class AdminController extends Controller
{

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
   * Create, flash success or error then redirect
   *
   * @param $class
   * @param $request
   * @param bool|false $imageColumn
   * @param string $path
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
   */

  public function saveObject($model, $request, $imageColumn = false){
    $model->created_at = Carbon::createFromFormat('d.m.Y', $model->created_at )->format('Y-m-d H:i:s');
    // Checkbox update
    $model->published = (($model->published) ? 1 : 0);
    // ----- Taxonomies ----- //
    if(!empty($request->taxonomies)):
      foreach ($request->taxonomies as $key => $val):
        Taxonomy::detachOldAddNew($val, $key, $request['id']);
      endforeach;
    endif;
    // Article update
    dd($model);
    $model->save() ? $request->session()->flash('status', 'Task was successful!') : $request->session()->flash('status', 'Task was not successful!');
    if(isset($request->finish)){
      dd('fin');
      return redirect()->route('admin.' . snake_case($this->model) . '.index');
    }else{
      // return redirect($this->urlRoutePath($path));
      // route($this->routePath($path));
      return redirect(route('admin.articles.edit', 2));
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
}
