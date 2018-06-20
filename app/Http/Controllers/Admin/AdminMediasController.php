<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Media;
use App\Tag;


class AdminMediasController extends Controller
{

  public function __construct(){
    $this->middleware(['auth', 'permissions'])->except('index');
  }

  /**
   * Update // save an object
   *
   * @param $model
   * @param $request
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
   */

  public function saveObject($media, $request){
    $file = $request->file('file');
    $this->linkRelatedArticle($request);
    $article = $request->model::findOrFail($request->article_id);
    if(!empty($request->file) && !empty($article)){
      if(!empty($media)){
        $media->delete();
      }
      // Store new media
      list($width, $height) = getimagesize($file);
      $file_name = $file->getClientOriginalName();
      $orig_name = pathinfo($file_name, PATHINFO_FILENAME);
      $extension = $file->getClientOriginalExtension();
      $name = str_slug($orig_name).'.'.$extension;
      $new_media = $article->addMediaFromRequest('file')->usingFileName($name)->withCustomProperties(['width' => $width, 'height' => $height])->toMediaCollection();
    }
    return redirect()->route('admin.medias.index');
  }



    /**
     * Update // save an object
     *
     * @param $model
     * @param $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */

    public function createObject($request){

    }


  /**
  * Link Related Article id exists
  *
  * @param  \Illuminate\Http\Request  $request
  * @return true
  */

  static function linkRelatedArticle($request){
    if(!empty($request->associated_article)):
      $article = explode(',', $request->associated_article);
      $article_model = $article[0];
      $article_id = $article[1];
      if(!empty($article_model) && !empty($article_id) && $article_id != 'null'):
        $request['model'] = $article_model;
        $request['article_id'] = $article_id;
      endif;
    else:
      $request['model'] = null;
      $request['article_id'] = null;
    endif;
    return true;
  }


  /**
  * Get the class from table name
  *
  * @return string
  */

  public function getClass($table_name){
    return !empty($table_name) ?
      'App\\' . studly_case(str_singular($table_name)) :
      null;
  }


  /**
   * Delete
   *
   * @param $model
   * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
   */

  public function destroyObject($model, $path = 'index'){
    $class = get_class($model);
    $article = $class::findOrFail($model->id);
    // cascade delete medias
    if(!empty($article->medias)):  foreach ($article->medias as $media):
      Media::deleteMediaFile($media->id);
    endforeach; endif;
    $article -> delete();
    session()->flash('flash_message', 'Deleted');
    return redirect()->route('admin.medias.index');
  }
}
