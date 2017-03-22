<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Validator;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Tag;

class TaxonomiesController extends Controller
{
  public function __construct(){
    $this->middleware('auth');
  }


  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
   public function index($parent_slug = null){
     $taxonomies = Tag::where('parent_id', 0)->orderBy('name')->get();
     // Add children
     foreach ($taxonomies as $t) {
       $t->children = $t->children;
     }
     return view('admin/templates/taxonomies', compact('taxonomies'));
   }

    /**
     * Show the form for creating a new resource.
     * @param  int  $parent_id     *
     * @return \Illuminate\Http\Response
     */

    public function create($parent_id){
      $taxonomy = collect(new Tag);
      $taxonomy->parent = Tag::where('id', $parent_id)->first();
      return view('admin.templates.taxonomy-edit', compact('taxonomy'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      dd('sdlfkj');
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
      $taxonomy = Tag::findOrFail($id);
      return view('admin/templates/taxonomy-edit',  compact('taxonomy'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id){
      $validator = Validator::make($request->all(), [
        'name' => 'required',
      ]);
      $taxonomy = Tag::findOrFail($id);
      // Validator check
      if ($validator->fails()) {
        return redirect()->route('admin.taxonomies.edit', $id)->withErrors($validator);
      } else {
        // Update de l'article
        $taxonomy->update($request->all());
        return redirect()->route('admin.taxonomies.index');
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
      $taxonomy -> delete();
      session()->flash('flash_message', 'Deleted');
      return redirect()->route('admin.taxonomies.index');
    }
}
