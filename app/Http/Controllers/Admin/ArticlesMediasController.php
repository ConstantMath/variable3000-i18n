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
      $media->save();
      // Link media to article
      if(isset($article)){
        // retourne le dernier media
        $next_media_order = $article->lastMediaId();
        $next_media_order += 1;
        // Article -> media
        $media->order = $next_media_order;
        $article->medias()->save($media);
      }
      return response()->json([
        'alt'         => $media->alt,
        'name'        => $media->name,
        'ext'         => $media->ext,
        'type'        => $media->type,
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
    $type     = $request->type;
    $media_id = $request->media_id;
    Media::deleteMediaFile($media_id);
    return response()->json([
      'status'    => 'success',
      'type'      => $type,
      'media_id'  => $media_id,
    ]);
  }


  /**
   * Ajoute des medias de type gallerie à l'article courant
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

  // public function addManyMedia(Request $request, $id){
  //   if(!empty($id) && $id != 'null'){
  //     $article = Article::findOrFail($id);
  //   }
  //   $column_name = $request->input('column_name');
  //   $file = $request->file('image');
  //
  //   if($file){
  //     list($width, $height) = getimagesize($file);
  //     // Upload
  //     $media_file = Media::uploadMediaFile($file);
  //     // Media store
  //     $media = New media;
  //     $media->name = $media_file['name'];
  //     $media->alt  = $media_file['orig_name'];
  //     $media->type = $file->getClientOriginalExtension();
  //     $media->width = $width;
  //     $media->height = $height;
  //     // Link media to article
  //     if(isset($article)){
  //       // retourne le dernier media
  //       $next_media_order = $article->lastMediaId();
  //       $next_media_order += 1;
  //       // Article -> media
  //       $media->order = $next_media_order;
  //       $article->medias()->save($media);
  //     }
  //     $media->save();
  //
  //     return response()->json([
  //       'media_alt'         => $media->alt,
  //       'media_name'        => $media->name,
  //       'media_type'        => $media->type,
  //       'article_id'        => $id,
  //       'media_id'          => $media->id,
  //       'media_description' => $media->description,
  //       'column_name'       => $column_name,
  //     ]);
  //   }
  // }


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
     $v = 1;
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
