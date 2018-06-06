<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Intervention\Image\ImageManagerStatic as Image;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Illuminate\Support\Facades\Storage;
use Config;

class Media extends Model{
  protected $table = 'media';
  protected $fillable = ['name', 'alt', 'description', 'type', 'width', 'height'];


  /**
   * Get all of the owning articletable models.
   */

  public function articletable(){
    return $this->morphTo();
  }


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
    // Response
    return [
      'orig_name' => $orig_name,
      'name'      => $name,
    ];
  }


  /**
   * Upload fichier media & store dans la Database
   * @param  file  $file
   * @return string name
   *
   */

  public static function uploadMediaSave($file){
    if($file){
      $file_name = $file->getClientOriginalName();
      $orig_name = pathinfo($file_name, PATHINFO_FILENAME);
      $extension = $file->getClientOriginalExtension();
      $name = time() .'-'. str_slug($orig_name).'.'.$extension;
      $mediapath = public_path().'/medias/';
      $file->move($mediapath, $name);
      // Media store
      $media = New media;
      $media->name = $name;
      $media->alt  = $orig_name;
      $media->type = $extension;
      $media->save();
      // Response
      return [
        'media_id' => $media->id,
      ];
    }
  }


  /**
   * Supprime le media et le fichier associé
   * @param  int  $id
   */

  public static function deleteMediaFile($id){
    $media = Media::find($id);
    $media->delete();
    if($media){
      if(file_exists(public_path().'/medias/'.$media->name)) @unlink('medias/'.$media->name);
      $media->delete();
    }
  }
}
