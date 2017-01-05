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

      return response()->json([
        'status' => 'success',
        'alt' => $orig_name,
        'name' => '/medias/'.$name,
      ]);
    }
  }

}
