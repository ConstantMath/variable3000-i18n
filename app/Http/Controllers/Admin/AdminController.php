<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests;
use App\Article;

class AdminController extends Controller
{
  public function __construct(){
    $this->middleware('auth');
  }

  // public function index(){
  //   $articles = Article::all();
  //   return view('admin/dashboard', compact('articles'));
  // }
}
