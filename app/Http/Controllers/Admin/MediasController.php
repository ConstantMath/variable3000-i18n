<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Media;
use App\DB;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Illuminate\Support\Facades\Storage;

class MediasController extends AdminController {

  use HasMediaTrait;

  public function __construct(){
    $this->middleware(['auth', 'permissions'])->except('index');
  }


  /**
   * Return article's medias
   *
   * @param  string  $media_type
   * @param  string  $mediatable_type
   * @param  int  $article_id
   * @return \Json\Response
   */

  public function mediasArticle($model_type, $article_id, $collection_name){
    $class = $this->getClass($model_type);
    $article = $class::findOrFail($article_id);
    $medias = null;
    if($article->medias):
      $medias = $article->medias->where('type', $collection_name);
    endif;
    return response()->json([
      'success' => true,
      'medias' => $medias,
    ]);
  }


  /**
   * Store media related to an article
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  string  $mediatable_type
   * @param  int  $article_id
   * @return JSON\Response
   */

  public function storeAndLink(Request $request, $mediatable_type, $article_id){
    // Validator conditions
    $validator = Validator::make($request->all(), [
      'image' => 'required|mimes:jpeg,jpg,png,gif,pdf,mp4|max:3000',
    ]);
    // Validator test
    if ($validator->fails()) {
      return response()->json([
        'status' => 'error',
        'error'    =>  'Error while uploading file, please check file format and size.',
        'type'             => $request->input('type'),
        'article_id'       => $article_id,
      ]);
    }else{
      $class = $this->getClass($mediatable_type);
      $article = $class::findOrFail($article_id);
      // Champs requests
      $file = $request->file('image');
      if($file && !empty($article_id) && $article_id != 'null'){
        list($width, $height) = getimagesize($file);
        $file_name = $file->getClientOriginalName();
        $orig_name = pathinfo($file_name, PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $name = str_slug($orig_name).'.'.$extension;
        $media = $article->addMediaFromRequest('image')->usingFileName($name)->withCustomProperties(['width' => $width, 'height' => $height])->toMediaCollection('une');

        return response()->json([
          'success'          => true,
          'media'            => $media,
        ]);
      }
    }
  }


  /**
  * Destroy
  *
  * @param  \Illuminate\Http\Request  $request
  * @return \Illuminate\Http\Response
  */

  public function destroy(Request $request, $mediatable_type){
    $media_type = $request->media_type;
    $media_id   = $request->media_id;
    Media::deleteMediaFile($media_id);
    return response()->json([
      'success'         => true,
      'media_type'      => $media_type,
      'media_id'        => $media_id,
      'mediatable_type' => $mediatable_type,
    ]);
  }


  /**
   * Reorder medais related to an article
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */

   public function reorder(Request $request, $media_type, $mediatable_type, $article_id){
     $class = $this->getClass($mediatable_type);
     $article = $class::findOrFail($article_id);
     $media_id  = $request->mediaId;
     $media_type  = $request->mediaType;
     $new_order = $request->newOrder;
     $v = 1;
     $medias = $article->medias->where('type', $media_type);
     if(isset($medias)){
       $v = 0;
       // loop in related medias
       foreach ($medias as $media) {
         $media = Media::findOrFail($media->id);
         if($v == $new_order){$v++;}
         if($media->id == $media_id){
           $media->order = $new_order;
         }else{
           $media->order = $v;
           $v++;
         }
         $media->timestamps = false;
         // Update Media with new order
         $media->update();
       }
     }
     return response()->json([
       'status' => 'success',
     ]);
   }



  /**
   * Upload de fichier simple (pour les champs texte)
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */

   public function fileUpload(Request $request){
     // Validator conditions
     $validator = Validator::make($request->all(), [
       'file' => 'required|mimes:jpeg,jpg,png,gif,pdf,mp4',
     ]);
     // Validator test
     if ($validator->fails()) {
       return response()->json([
         'status' => 'error',
         'error'    =>  'Error while uploading file, please check file format and size.'
       ]);
     }else{
       $file = $request->file;
       $file_name = $file->getClientOriginalName();
       $orig_name = pathinfo($file_name, PATHINFO_FILENAME);
       $extension = $file->getClientOriginalExtension();
       $name = time() .'-'. str_slug($orig_name).'.'.$extension;
       $mediapath = public_path().'/medias/';
       // Store the file
       //$path = $file->storeAs('public', $name);
       if($extension == 'pdf'){
         $file_url = '/medias/'.$name;
       }else{
         $file_url = '/imagecache/large/'.$name;
       }
       $file->move('medias', $name);

       return response()->json([
         'status'     => 'success',
         'filename'   => $file_url,
         'name'       => $file_name,
         'extension' =>  $extension
       ]);
     }
   }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */

   public function update(Request $request, $mediatable_type){
     $id = $request->media_id;
     $media = Media::findOrFail($id);
     $file = $request->file('background_image_file');
     if($file){
       // Upload
       $background_image = Media::uploadMediaFile($file);
       $media->update(['background_image' => $background_image['name']]);
     }
     $media->update($request->all());
     return response()->json([
       'status'                  => 'success',
       'media_id'                => $media->id,
       'media_alt'               => $media->alt,
       'media_description'       => $media->description,
       'media_type'              => $media->type,
       'mediatable_type'         => $mediatable_type,
     ]);
   }


  /**
   * GEt all medias from id array
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */

  public function getFromArray(Request $request){
    $medias_array = explode( ',', $request->medias[0]);
    $medias = Media::whereIn('id', $medias_array)->get();
    return response()->json([
      'success' => true,
      'medias' => $medias,
      'medias_array' => $medias_array,
    ]);
  }

}
