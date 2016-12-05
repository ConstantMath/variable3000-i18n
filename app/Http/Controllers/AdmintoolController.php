<?php

namespace App\Http\Controllers;

use App\Article;
use App\Http\Requests\ArticlesCreateRequest;
use App\Http\Requests\ArticlesUpdateRequest;

use App\Http\Requests;

use Illuminate\Http\Request;

class AdmintoolController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      //$articles = $this->articlesRepository->getAll();
      $articles = Article::all();

      return view('admintool/dashboard', compact('articles'));
    }
}
