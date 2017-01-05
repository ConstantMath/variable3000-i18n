<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Article;
use App\Media;
use App\Tag;


class ArticlesMediasController extends Controller
{

  public function __construct(){
    $this->middleware('auth');
  }

  /**
   * Ajoute un media à l'article courant
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function addMedia(Request $request, $id){
    if(!empty($id) && $id != 'null'){
      $article = Article::findOrFail($id);
    }
    $type = $request->input('type');

    // File
    $file = $request->file('image');

    if($file){
      // Upload
      $media_file = Media::uploadMediaFile($file);
      // Media store
      $media = New media;
      $media->name = $media_file['name'];
      $media->alt  = $media_file['orig_name'];
      $media->type = $file->getClientOriginalExtension();

      // Ajout d'un media de type gallerie (one to many)
      if($type == 'mediagallery'){
        if(isset($article)){
          // retourne le dernier media
          $next_media_order = $article->lastMediaId();
          $next_media_order += 1;
          // Article -> media
          $media->order = $next_media_order;
          $article->medias()->save($media);
        }
        $media->save();

      // Ajout d'un media de type image une (media_id dans table article)
      }else{
        // Si article déjà créé (ID)
        if(isset($article)){
          $old_media_id =  $article->media_id;
          if($old_media_id){ Media::deleteMediaFile($old_media_id); }
          $media->save();
          $article->media_id = $media->id;
          $article->update();
        }else{
          $media->save();
        }
      }

      return response()->json([
        'alt'           => $media_file['orig_name'],
        'name'          => '/imagecache/small/'.$media_file['name'],
        'article_id'    => $id,
        'media_id'      => $media->id,
        'type'          => $type,
      ]);
    }
  }


  /**
   * Supprime un media de l'article courant
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function deleteMedia(Request $request, $id){
    $article = Article::findOrFail($id);
    $media_id  = $request->media_id;
    Media::deleteMediaFile($media_id);

    if($request->type && $request->type == 'image-une'){
      $article->media_id = null;
      $article->update();
    }
    return response()->json([
      'status'    => 'success',
      'type'      => $request->type,
      'media_id'  => $media_id,
    ]);
  }

  /**
   * Réordonne les médias liés à l'article
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function reorderMedia(Request $request, $id){
    $article = Article::findOrFail($id);
    $media_id  = $request->mediaId;
    $new_order = $request->newOrder;
    $v = 0;
    // loop dans les médias liés
    foreach ($article->medias as $media) {
      if($v == $new_order){$v++;}
      $media = Media::findOrFail($media->id);
      if($media->id == $media_id){
        $media->order = $new_order;
      }else{
        $media->order = $v;
        $v++;
      }
      $media->update();
    }
    return response()->json([
      'status'        => 'success',
    ]);
  }
}
