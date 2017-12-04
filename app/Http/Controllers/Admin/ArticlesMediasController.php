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
   * Return article's medias
   *
   * @param  int  $id
   * @return \Json\Response
   */

  public function getMedias($id, $media_type){
    $article = Article::findOrFail($id);
    $medias = $article->medias->where('type', $media_type);
    return response()->json([
      'success' => true,
      'medias' => $medias,
    ]);
  }


  /**
   * Ajoute un media unique à l'article courant
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  public function addSingleMedia(Request $request, $id){
    if(!empty($id) && $id != 'null'){
      $article = Article::findOrFail($id);
    }
    // Champs requests
    $file        = $request->file('image');
    if($file){
      list($width, $height) = getimagesize($file);
      // Upload
      $media_file = Media::uploadMediaFile($file);
      // Media store
      $media = New media;
      $media->name       = $media_file['name'];
      $media->alt        = $media_file['orig_name'];
      $media->ext        = $file->getClientOriginalExtension();
      $media->type       = $request->input('type');
      $media->width      = $width;
      $media->height     = $height;
      /// If Media unique (not gallery) > Delete current before saving,
      if(($media->type == 'une' or $media->type == 'home_media') && isset($article)){
        $current_media = $article->medias->where('type', $media->type)->first();
        if(!empty($current_media)):
          Media::deleteMediaFile($current_media->id);
        endif;
      }
      $media->save();
      // Link media to article
      if(isset($article)){
        // retourne le dernier media
        $next_media_order = $article->lastMediaId($media->type);
        $next_media_order += 1;
        // Article -> media
        $media->order = $next_media_order;
        $article->medias()->save($media);
      }
      return response()->json([
        'success'     => true,
        'alt'         => $media->alt,
        'name'        => $media->name,
        'ext'         => $media->ext,
        'type'        => $media->type,
        'mediatable_type'  => 'articles',
        'article_id'  => $id,
        'id'          => $media->id,
        'description' => $media->description,
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
    // $article = Article::findOrFail($id);
    $media_type = $request->media_type;
    $media_id   = $request->media_id;
    Media::deleteMediaFile($media_id);
    return response()->json([
      'success'    => true,
      'media_type' => $media_type,
      'media_id'   => $media_id,
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
     $media_type  = $request->mediaType;
     $new_order = $request->newOrder;
     $v = 1;
     $medias = $article->medias->where('type', $media_type);
     // loop dans les médias liés
     foreach ($medias as $media) {
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
