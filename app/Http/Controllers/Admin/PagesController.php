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
    $this->table_type = 'pages';
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
       'table_type' => $this->table_type,
     );
     return view('admin/templates/nestedset-index', compact('articles', 'parent_article', 'data'));
   }


   /**
    * Get articles for datatables (ajax)
    *
    * @return \Illuminate\Http\Response
    */

   public function getDataTable($parent_id = 0){
     return \DataTables::of(Page::withTranslation()
                         ->where('parent_id', $parent_id)
                         ->orderBy('order', 'asc')
                         ->get())
                         ->addColumn('action', function ($article) {
                           if(count($article->children)) {
                             return '<a href="' . route('admin.pages.index', $article->id) . '" class="link">View&nbsp;Pages</a> <a href="' . route('admin.pages.create', $article->id) . '" class="link">Add&nbsp;Page</a> <a href="' . route('admin.pages.edit', $article->id) . '" class="link">Edit</a>';
                           }
                           elseif($article->parent_id == 0){
                             return '<a href="' . route('admin.pages.create', $article->id) . '" class="link">Add Page</a> <a href="' . route('admin.pages.edit', $article->id) . '" class="link">Edit</a>';
                           }
                           else {
                             return '<a href="' . route('admin.pages.edit', $article->id) . '" class="link">Edit</a>';
                           }
                         })
                         ->setRowClass(function ($article) {
                           if(count($article->children)) {
                            return 'has-child';
                           }
                         })
                         ->make(true);
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



    /**
    * Reorder the pages relative to parent
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
       $pages = Page::where('parent_id', $parent_id)
                    ->orderBy('order', 'asc')
                    ->get();
     }
     if(isset($pages)){
       $v = 0;
       // Articles loop
       foreach ($pages as $pages) {
         if($v == $new_order){$v++;}
         if($pages->id == $id){
           $n_order = $new_order;
         }else{
           $n_order = $v;
           $v++;
         }
         $pages->timestamps = false;
         // Update with new order
         $pages->update(['order' => $n_order]);
       }
     }
     return response()->json([
       'status' => 'success',
     ]);
    }

}
