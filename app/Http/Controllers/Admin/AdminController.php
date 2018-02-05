<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests;
use App\Article;
use View;

class AdminController extends Controller
{

  public function __construct(){
    $this->middleware('auth');
    // Header share : get all parent articles
    $parent_articles = Article::where('parent_id', 0)->get();
    $data = array(
      'page_class' => 'index-articles index-0',
      'page_title' => 'Index',
      'page_id'    => 'index-0'
    );
    View::share('parent_articles', $parent_articles );
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

  public function saveObject($class, $request, $imageColumn = false, $path = 'index'){
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
    Tag::detachOldAddNew($tags_input, $tags_parent_id, $id);
    // Article update
    $article->update($request->all());
    $data = $request->all();
    if(isset($data['finish'])){
      return redirect()->route('admin.articles.index');
    }else{
      return redirect()->route('admin.articles.edit', ['parent_id' => $article->parent_id, 'articles' => $id]);
    }


    // $model = $class::create($this->getData($request, $imageColumn));
    // $model->id ? flash(trans('admin.create.success'), 'success') : flash(trans('admin.create.fail'), 'error');
    // return $this->redirectRoutePath($path);
  }
}
