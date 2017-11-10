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
      'media_type'              => $media->type,
    ]);
  }

}
