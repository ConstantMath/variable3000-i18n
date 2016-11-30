<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticlesCreateRequest;
use App\Http\Requests\ArticlesUpdateRequest;

use App\Http\Requests;
use App\Repositories\ArticlesRepository;

use Illuminate\Http\Request;

class AdmintoolController extends Controller
{
    protected $articlesRepository;
    protected $nbrPerPage = 5;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(ArticlesRepository $articlesRepository)
    {
        $this->middleware('auth');
        $this->articlesRepository = $articlesRepository;
    }
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $articles = $this->articlesRepository->getAll();

      return view('admintool/dashboard', compact('articles'));
    }
}
