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


class PagesController extends Controller
{
  /**
   * List all articles
   *
   * @return \Illuminate\Http\Response
   */

   public function index($parent_id = 0){
     $articles = Page::where('parent_id', $parent_id)
                   ->orderBy('order', 'asc')
                   ->get();
     $data = array(
       'page_class' => 'index',
       'page_title' => 'Pages',
       'page_id'    => 'index-pages',
     );
     return view('admin/templates/nestedset-index', compact('articles', 'data'));
   }
}
