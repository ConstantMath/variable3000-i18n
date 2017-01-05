<?php
namespace App\Http\Controllers;

use App\Article;
use App\Http\Requests;
use App\Http\Requests\CreateArticleREquest;
use App\Http\Controllers\Controller;

use Illuminate\HttpResponse;


class ArticlesController extends Controller
{

    public function __construct(){
    }

    public function index(){
      $articles = Article::all();
      return view('index', compact('articles', 'links'));
    }

    public function create(){
      return view('admintool.article-create');
    }

    public function store(CreateArticleRequest $request){
      Article::create($request->all());
      return redirect('admintool');
      //return redirect('admintool')->withOk("L'article " . $request->input('title') . " a été modifié.");
    }

    public function show($id)
    {
      $article = Article::findOrFail($id);
      return view('admintool/article-show', compact('article'));
    }


    public function edit($id){
      $article = Article::findOrFail($id);
  	  return view('admintool/article-edit',  compact('article'));
    }


    public function update(CreateArticleRequest $request, $id){
      $article = Article::findOrFail($id);
      $article->update($request->all());
      return redirect('admintool');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
