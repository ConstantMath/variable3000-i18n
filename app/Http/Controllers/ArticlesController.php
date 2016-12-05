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
      $inputs = $request->all();
      $inputs['slug'] = str_slug($inputs['title']);
      Article::create($inputs);
      return redirect('admintool')->withOk("L'article " . $request->input('title') . " a été modifié.");
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


    public function update(){
      $inputs = Request::all();
      return $inputs;
      // $Article->title = $inputs['title'];
      // $Article->slug = str_slug($inputs['title']);
      // $Article->description = $inputs['description'];
      // // Chekcbox test
      // if(!empty($inputs['published'])):
      //   $Article->published = $inputs['published'];
      // else:
      //   $Article->published = 0;
      // endif;
      // // $Article->type = $inputs['type'];
      // // $Article->order = $inputs['order'];
      // // $Article->article_parent = $inputs['article_parent'];
  		// $Article->save();
      //
      // //$this->articlesRepository->update($id, $request->all());
      // return redirect('admintool')->withOk("L'article " . $request->input('title') . " a été modifié.");
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
