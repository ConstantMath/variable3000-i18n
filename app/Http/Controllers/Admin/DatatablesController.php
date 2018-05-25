<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Redirect;
use DataTables;
use App\Article;

class DatatablesController extends Controller
{
  public function datatable()
  {
      return view('datatable');
  }

  public function getArticles()
  {
      return \DataTables::of(Article::withTranslation()->get())->make(true);
  }
}
