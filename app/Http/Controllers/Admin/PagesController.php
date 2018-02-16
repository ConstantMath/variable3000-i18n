<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Page;
use App\Media;
use App\Tag;
use DB;
use Carbon\Carbon;
use Lang;
use App\Http\Requests\Admin\PageRequest;
use View;

class PagesController extends AdminController
{

  protected $model = 'pages';

  public function __construct(){
    // Header share : get all parent articles
    $parent_pages = Page::where('parent_id', 0)->get();
    View::share('parent_pages', $parent_pages );
    $this->middleware(['auth', 'permissions'])->except('index');    
  }

  /**
   * List all articles
   *
   * @return \Illuminate\Http\Response
   */

   public function index($parent_id = 0){
     $articles = Page::where('parent_id', $parent_id)
                   ->orderBy('order', 'asc')
                   ->get();
     if($parent_id != 0){
       $parent_article = Page::findOrFail($parent_id);
     }else{
       $parent_article = null;
     }
     $parent =
     $data = array(
       'page_class' => 'pages',
       'page_title' => 'Pages',
       'page_id'    => 'index-pages',
     );
     return view('admin/templates/nestedset-index', compact('articles', 'parent_article', 'data'));
   }


  /**
   * Show the form for editing the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function edit($id){
    $article = Page::findOrFail($id);
    $data = array(
      'page_class' => 'pages',
      'page_title' => 'Page edit',
      'page_id'    => 'index-pages',
    );
  	return view('admin/templates/page-edit',  compact('article', 'data'));
  }


  /**
   * Show the form for creating a new resource.
   *
   * @param  string  $parent_slug
   * @return \Illuminate\Http\Response
   */

  public function create($parent_id = 0){
    $data = array(
      'page_class' => 'pages',
      'page_title' => 'Page create',
      'page_id'    => 'create-page-'.$parent_id,
    );
    $article = new Page;
    // $article->parent_id = $parent_id;
    $article->parent = Page::where('id', $parent_id)->first();
    return view('admin/templates/page-edit', compact('article', 'data'));
  }


  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   */

  public function update(Page $page, PageRequest $request){
    return $this->saveObject($page, $request);
  }


  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */

  public function store(PageRequest $request){
    return $this->createObject(Page::class, $request);
  }


  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function destroy(Page $page){
    return $this->destroyObject($page);
  }

}
