<?php

namespace App\Http\Controllers\Admin;
use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Media;

class MediasController extends Controller {

  public function __construct(){
    $this->middleware('auth');
  }

  /**
   * Upload de fichier simple (pour les champs texte)
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */

  public function fileUpload(Request $request){

    $validator = Validator::make($request->all(), [
      'file' => 'required|image|mimes:jpeg,jpg,png,gif',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'status' => 'error',
        'msg'    =>  'Format de fichier non valide'
      ]);
    }else{
      $file = $request->file;
      $orig_name = $file->getClientOriginalName();
      $name = time() .'-'. $orig_name;
      $file->move('medias', $name);
      // ajax return
      return response()->json([
        'status' => 'success',
        'alt' => $orig_name,
        'name' => '/medias/'.$name,
      ]);
    }
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */

  public function update(Request $request){
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
      'media_size'              => $media->size,
      'media_background_image'   => $media->background_image,
      'media_background_color'  => $media->background_color,
    ]);
  }

}
