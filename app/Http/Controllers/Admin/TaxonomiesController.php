<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Validator;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Tag;
use Lang;

class TaxonomiesController extends AdminController
{
  public function __construct(){
    $this->middleware('auth');
    // Construct admin controller
    parent::__construct();
  }


  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */

   public function index($parent_slug = null){
     $data = array(
       'page_class' => 'taxonomies-index',
       'page_title' => 'Taxonomies',
       'page_id'    => 'taxonomies',
     );
     $taxonomies = Tag::where('parent_id', 0)->orderBy('order', 'asc')->get();
     // Add children
     foreach ($taxonomies as $t) {
       $t->children = $t->children;
     }
     return view('admin/templates/taxonomies-index', compact('taxonomies', 'data'));
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
     $taxonomy = collect(new Tag);
     $taxonomy->parent = Tag::where('id', $parent_id)->first();
     return view('admin.templates.taxonomy-edit', compact('taxonomy', 'data'));
   }


   /**
    * Store a newly created resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
   public function store(Request $request){
     $unset_requests = array();
     // Loop in locales to test if empty
     foreach (config('translatable.locales') as $lang){
       if($lang != Lang::getLocale()){
         // If lang title is empty : add to array
         if(empty($request->input($lang.'.name'))){
           array_push($unset_requests, $lang);
         }
       }
     }
     if(empty($request->input('en.name'))){
       $validator = Validator::make($request->all(), [
         'name' => 'required|size:400',
       ]);
     }else{
       $validator = Validator::make($request->all(), [
         'name' => 'size:400',
       ]);
     }

     // Validator check
     if ($validator->fails()) {
       return redirect()->route('taxonomies.create', ['parent_id' => $request->parent_id])->withErrors($validator);
     } else {
       // Store the taxonomy
       $article = Tag::create($request->all());
       return redirect()->route('taxonomies.index');
     }
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
      $taxonomy = Tag::findOrFail($id);
      return view('admin/templates/taxonomy-edit',  compact('taxonomy', 'data'));
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
      // Loop in locales to test if empty
      foreach (config('translatable.locales') as $lang){
        if($lang != Lang::getLocale()){
          // If lang title is empty : add to array
          if(empty($request->input($lang.'.name'))){
            array_push($unset_requests, $lang);
          }
        }
      }
      if(empty($request->input('en.name'))){
        $validator = Validator::make($request->all(), [
          'name' => 'required|size:400',
        ]);
      }else{
        $validator = Validator::make($request->all(), [
          'name' => 'size:400',
        ]);
      }

      $taxonomy = Tag::findOrFail($id);
      // Validator check
      if ($validator->fails()) {
        return redirect()->route('taxonomies.edit', $id)->withErrors($validator);
      } else {
        // Update de l'article
        $taxonomy->update($request->all());
        return redirect()->route('taxonomies.index');
      }
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function destroy($id){
      $taxonomy = Tag::findOrFail($id);
      $taxonomy->delete();
      session()->flash('flash_message', 'Deleted');
      return redirect()->route('taxonomies.index');
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
         $tags = Tag::where('parent_id', $parent_id)
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
