<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Validator;
use App\Http\Requests;
use App\Http\Requests\Admin\TaxonomyRequest;
use App\Http\Controllers\Controller;
use App\Taxonomy;
use Lang;

class TaxonomiesController extends AdminController
{
  public function __construct(){
    $this->table_type = 'taxonomies';
    $this->middleware(['auth', 'permissions'])->except('index');
    // Construct admin controller
    parent::__construct();
  }


  /**
  * Display a listing of the resource.
  *
  * @return \Illuminate\Http\Response
  */

  public function index(){
   $data = array(
     'page_class' => 'taxonomies-index tools',
     'page_title' => 'Taxonomies',
     'page_id'    => 'taxonomies',
     'table_type' => $this->table_type,
   );
   $taxonomies = Taxonomy::where('parent_id', 0)->orderBy('order', 'asc')->get();
   return view('admin/templates/taxonomies-index', compact('taxonomies', 'data'));
  }


  /**
   * Get articles for datatables (ajax)
   *
   * @return \Illuminate\Http\Response
   */

  public function getDataTable(){
    $parent_id = (!empty($_GET['parent_id'])) ? $_GET['parent_id'] : 0;
    return \DataTables::of(Taxonomy::where('parent_id', $parent_id)->get())
                        ->addColumn('action', function ($article) {
                          return '<a href="' . route('admin.taxonomies.edit', $article->id) . '" class="link">' . __('admin.edit') . '</a>';
                        })
                        ->make(true);
  }

  /**
  * Show the form for creating a new resource.
  * @param  int  $parent_id     *
  * @return \Illuminate\Http\Response
  */

  public function create($parent_id){
   $data = array(
     'page_class' => 'taxonomies-create',
     'page_title' => 'Taxonomy create',
     'page_id'    => 'taxonomies',
   );
   $taxonomy = collect(new Taxonomy);
   $taxonomy->parent = Taxonomy::where('id', $parent_id)->first();
   return view('admin.templates.taxonomy-edit', compact('taxonomy', 'data'));
  }


  /**
  * Store a newly created resource in storage.
  *
  * @param  \Illuminate\Http\Request  $request
  * @return \Illuminate\Http\Response
  */

  public function store(TaxonomyRequest $request){
    return $this->createObject(Taxonomy::class, $request);
  }



  /**
  * Update the specified resource in storage.
  *
  * @param  \Illuminate\Http\Request  $request
  * @param  int  $id
  * @return \Illuminate\Http\Response
  */

  public function update(Taxonomy $taxonomy, TaxonomyRequest $request){
    return $this->saveObject($taxonomy, $request);
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

  public function edit($id){
  $data = array(
    'page_class' => 'taxonomies-edit',
    'page_title' => 'Taxonomy edit',
    'page_id'    => 'taxonomies',
  );
  $taxonomy = Taxonomy::findOrFail($id);
  return view('admin/templates/taxonomy-edit',  compact('taxonomy', 'data'));
  }



  /**
  * Remove the specified resource from storage.
  *
  * @param  int  $id
  * @return \Illuminate\Http\Response
  */

  public function destroy(Taxonomy $taxonomy){
    return $this->destroyObject($taxonomy);
  }


  /**
  * Reorder the taxonomies relative to parent
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
     $tags = Taxonomy::where('parent_id', $parent_id)
                  ->orderBy('order', 'asc')
                  ->get();
   }
   if(isset($tags)){
     $v = 0;
     // Articles loop
     foreach ($tags as $tag) {
       if($v == $new_order){$v++;}
       if($tag->id == $id){
         $n_order = $new_order;
       }else{
         $n_order = $v;
         $v++;
       }
       $tag->timestamps = false;
       // Update with new order
       $tag->update(['order' => $n_order]);
     }
   }
   return response()->json([
     'status' => 'success',
   ]);
  }
}
