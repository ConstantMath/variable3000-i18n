<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Intervention\Image\ImageManagerStatic as Image;
use Config;

class Media extends Model{
  protected $table = 'medias';
  protected $fillable = [
      'name',
      'alt',
      'description',
      'type',
  ];



  /**
   * Upload fichier media
   * @param  file  $file
   * @return string name
   *
   */

  public static function uploadMediaFile($file){

    $file_name = $file->getClientOriginalName();
    $orig_name = pathinfo($file_name, PATHINFO_FILENAME);
    $extension = $file->getClientOriginalExtension();
    $name = time() .'-'. str_slug($orig_name).'.'.$extension;
    $mediapath = public_path().'/medias/';
    $file->move($mediapath, $name);

    return [
      'orig_name' => $orig_name,
      'name'      => $name,
    ];
  }


  /**
   * Supprime le media et le fichier associé
   * @param  int  $id
   */

  public static function deleteMediaFile($id){
    $media   = Media::find($id);
    if($media){
      if(file_exists(public_path().'/medias/'.$media->name)) @unlink('medias/'.$media->name);
      $media->delete();
    }
  }
}
