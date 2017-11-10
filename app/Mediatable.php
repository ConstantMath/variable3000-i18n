<?php
namespace App;

trait Mediatable{

  /**
   * Fetch all medias for the model ordered
   *
   * @return \Illuminate\Database\Eloquent\Relations\MorphMany
   */

  public function medias(){
    return $this->morphMany(Media::class, 'mediatable')
                ->orderBy('order', 'asc');
  }





  /**
   * Fetch last media from article
   *
   * @param  string  $type
   * @return \Illuminate\Database\Eloquent\Relations\MorphMany
   */

  public function lastMediaId($type){
    return $this->morphMany(Media::class, 'mediatable')
                ->where('type', $type)
                ->orderBy('order', 'desc')
                ->pluck('order')
                ->first();
  }

}
